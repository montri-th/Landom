import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { PUBLISH_PATHS, renderLocalizedEntrypoint } from '../tools/build.mjs';
import { REQUIRED_UI_IDS, validateDataContract, validateSite } from '../tools/validate-site.mjs';

function fixture() {
  return {
    meta: { schemaVersion: 'test' },
    institutions: [],
    programs: [],
    educationRecords: [],
    people: [
      {
        personId: 'S0001',
        names: { full: { en: 'Suppaphol Areewattanawong' }, nickname: { th: 'โอ๊ต', en: 'Oat' } },
        publication: { consentStatus: 'granted' }
      }
    ],
    engagements: [],
    works: [
      { workId: 'W-LAND-PORTFOLIO', name: { en: 'Land Portfolio' } },
      { workId: 'W-LEAD2LOAN', name: { en: 'Lead2Loan' } }
    ],
    contributions: [
      {
        contributionId: 'C-0001',
        personId: 'S0001',
        workId: 'W-LAND-PORTFOLIO',
        engagementId: null
      },
      {
        contributionId: 'C-0002',
        personId: 'S0001',
        workId: 'W-LEAD2LOAN',
        engagementId: null
      }
    ],
    achievements: [],
    socialProfiles: [],
    assets: [],
    certificates: []
  };
}

async function personModelComparatorFromSource() {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const orderingSource = app.match(
    /function engagementIsCurrent\b[\s\S]*?(?=function relationId\b)/
  )?.[0] ?? '';
  const monthYearSource = app.match(
    /function monthYearParts\b[\s\S]*?(?=function monthYearLabel\b)/
  )?.[0] ?? '';
  assert.ok(orderingSource, 'person ordering functions must remain independently testable');
  assert.ok(monthYearSource, 'month-year parsing must remain independently testable');

  const firstValue = (record, paths) => {
    for (const path of paths) {
      if (record?.[path] !== undefined && record[path] !== null) return record[path];
    }
    return null;
  };
  const localizedValue = (value, language = 'en') => {
    if (value && typeof value === 'object') return String(value[language] ?? value.en ?? value.th ?? '');
    return String(value ?? '');
  };

  return Function(
    'firstValue',
    'localizedValue',
    `${orderingSource}\n${monthYearSource}\nreturn personModelSort;`
  )(firstValue, localizedValue);
}

test('a minimal canonical public dataset passes', () => {
  assert.deepEqual(validateDataContract(fixture()), []);
});

test('person IDs are short, unique, and versionless', () => {
  const data = fixture();
  data.people.push({
    personId: 'S0001',
    personIdV1: 'LDM-P-001',
    names: { full: { en: 'A Duplicate Person' } },
    publication: { consentStatus: 'granted' }
  });
  const errors = validateDataContract(data).join('\n');
  assert.match(errors, /duplicated/);
  assert.match(errors, /alternate ID field/);
});

test('person ID prefix and education display follow the migration role', () => {
  const data = fixture();
  data.people[0].personId = 'I0001';
  data.people[0].migrationClassification = 'full_time';
  data.people[0].educationDisplayMode = 'program';
  data.people[0].canonicalIdPolicy = { frozenAcrossFutureRoleChanges: false };
  for (const contribution of data.contributions) contribution.personId = 'I0001';
  const errors = validateDataContract(data).join('\n');
  assert.match(errors, /wrong canonical ID prefix/);
  assert.match(errors, /educationDisplayMode/);
  assert.match(errors, /not frozen across future role changes/);
});

test('orphan foreign keys and zero-contribution people fail', () => {
  const data = fixture();
  data.people.push({
    personId: 'I0001',
    names: { full: { en: 'Intern Example' } },
    publication: { consentStatus: 'granted' }
  });
  data.contributions[0].workId = 'W-MISSING';
  const errors = validateDataContract(data).join('\n');
  assert.match(errors, /orphan reference W-MISSING/);
  assert.match(errors, /Person I0001 has no contribution/);
});

test('Oat has distinct Land Portfolio and Lead2Loan work records', () => {
  const data = fixture();
  data.contributions = data.contributions.filter((record) => record.workId !== 'W-LEAD2LOAN');
  assert.match(validateDataContract(data).join('\n'), /must have a Lead2Loan contribution/);
});

test('public social profiles require verification and an approved publication basis', () => {
  const data = fixture();
  data.socialProfiles.push({
    socialProfileId: 'SOC-0001',
    personId: 'S0001',
    platform: 'linkedin',
    profileUrl: 'https://example.com/person',
    publicationStatus: 'publishable',
    verificationStatus: 'pending',
    consentStatus: 'granted'
  });
  assert.match(validateDataContract(data).join('\n'), /public without verified source and an approved publication basis/);
});

test('owner-authorized public profile links do not masquerade as individual consent', () => {
  const data = fixture();
  data.people[0].publication.consentStatus = 'pending';
  data.socialProfiles.push({
    socialProfileId: 'SOC-0002',
    personId: 'S0001',
    platform: 'linkedin',
    publicUrl: 'https://www.linkedin.com/in/example/',
    publicationStatus: 'publishable',
    verificationStatus: 'verified',
    consentStatus: 'pending',
    publicationBasis: 'owner_authorized_public_profile_link',
    ownerApproval: { status: 'granted' }
  });
  assert.deepEqual(validateDataContract(data), []);
});

test('Facebook cannot be exposed by the public web contract even when its governance fields pass', () => {
  const data = fixture();
  data.socialProfiles.push({
    socialProfileId: 'SOC-S0001-FACEBOOK',
    personId: 'S0001',
    platform: 'facebook',
    publicUrl: 'https://example.invalid/facebook-profile',
    publicationStatus: 'publishable',
    verificationStatus: 'verified',
    consentStatus: 'pending',
    publicationBasis: 'owner_authorized_public_profile_link',
    ownerApproval: { status: 'granted' }
  });
  assert.match(
    validateDataContract(data).join('\n'),
    /unsupported public platform facebook; only LinkedIn and GitHub may appear on the web/
  );
});

test('web social normalization and icon rendering allow only LinkedIn and GitHub', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const normalizer = app.match(/function normalizeSocials\b[\s\S]*?(?=function normalizeSearch\b)/)?.[0] ?? '';
  const iconMarkup = app.match(/function socialIconMarkup\b[\s\S]*?(?=function profileSocialIconsMarkup\b)/)?.[0] ?? '';
  const iconRenderer = app.match(/function profileSocialIconsMarkup\b[\s\S]*?(?=function socialsMarkup\b)/)?.[0] ?? '';

  assert.match(app, /const PUBLIC_WEB_SOCIAL_KEYS = new Set\(\["linkedin", "github"\]\)/);
  assert.match(normalizer, /PUBLIC_WEB_SOCIAL_KEYS\.has\(platform\.key\)/);
  assert.match(iconRenderer, /PUBLIC_WEB_SOCIAL_KEYS\.has\(social\.key\)/);
  assert.match(iconMarkup, /key === "linkedin"/);
  assert.match(iconMarkup, /key === "github"/);
  assert.doesNotMatch(iconMarkup, /facebook|instagram|tiktok|gitlab/i);
});

test('person images require a fully approved asset record', () => {
  const data = fixture();
  data.people[0].profileImageAssetId = 'ASSET-0001';
  data.assets.push({
    assetId: 'ASSET-0001',
    personId: 'S0001',
    path: 'public/assets/people/s0001.webp',
    publicationStatus: 'public',
    verificationStatus: 'verified',
    consentStatus: 'granted',
    rightsStatus: 'pending'
  });
  assert.match(validateDataContract(data).join('\n'), /before all approvals pass/);
});

test('the build allowlist excludes private raw sheets and runtime secrets', () => {
  assert.deepEqual(PUBLISH_PATHS, ['index.html', 'llms.txt', 'robots.txt', 'sitemap.xml', 'src', 'public', 'data/generated']);
  assert.equal(PUBLISH_PATHS.some((entry) => entry.startsWith('data/raw')), false);
});

test('Thai root and localized English entrypoint have reciprocal metadata and crawlable initial copy', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const thai = renderLocalizedEntrypoint(source, 'th');
  const english = renderLocalizedEntrypoint(source, 'en');

  assert.match(thai, /<html[\s\S]*?lang="th"/);
  assert.match(thai, /data-locale-route="th"/);
  assert.match(thai, /<link rel="canonical" href="https:\/\/montri-th\.github\.io\/Landom\/">/);
  assert.match(thai, /id="page-title">ไม่ใช่สถานที่&#10;แต่คือผู้คน<\/h1>/);
  assert.match(thai, /id="footer-title">มาเป็นชาว Landom กัน<\/h2>/);
  assert.match(thai, /id="footer-copy">มาร่วมกันเข้าใจเมือง และช่วยกันทำให้ดีขึ้น<\/p>/);
  assert.match(thai, /id="footer-meta"[^>]*>ชาวด้อม Landom<\/p>/);
  assert.match(thai, /property="og:title" content="LANDOM · พวกเรา ที่ช่วยกันสร้าง LANDOMETER"/);
  assert.match(thai, /name="twitter:title" content="LANDOM · พวกเรา ที่ช่วยกันสร้าง LANDOMETER"/);
  assert.match(thai, /validLang\(langParam\) \|\| routeLang \|\| validLang\(storedLang\)/);
  assert.match(thai, /validLang\(root\.dataset\.localeRoute\) \|\| validLang\(root\.dataset\.defaultLanguage\) \|\| "th"/);
  assert.doesNotMatch(thai, /<base\b/);

  assert.match(english, /<html[\s\S]*?lang="en"/);
  assert.match(english, /data-locale-route="en"/);
  assert.match(english, /<link rel="canonical" href="https:\/\/montri-th\.github\.io\/Landom\/en\/">/);
  assert.match(english, /<title>Landom — meet the people shaping Landometer<\/title>/);
  assert.match(english, /property="og:title" content="Landom — meet the people shaping Landometer"/);
  assert.match(english, /name="twitter:title" content="Landom — meet the people shaping Landometer"/);
  assert.match(english, /id="page-title">It’s not a place\.&#10;It’s the people\.<\/h1>/);
  assert.match(english, /id="footer-title">Be part of Landom<\/h2>/);
  assert.match(english, /id="footer-copy">Understand cities\. Make them better, together\.<\/p>/);
  assert.match(english, /id="footer-address">[\s\S]*?Tri Mit Road, Talat Noi, Samphanthawong, Bangkok 10100, Thailand[\s\S]*?<\/address>/);
  assert.match(english, /id="footer-meta"[^>]*>People of Landom<\/p>/);
  assert.match(english, /"@graph": \[/);
  assert.match(english, /"@id": "https:\/\/montri-th\.github\.io\/Landom\/en\/#collection"/);
  assert.match(english, /"@type": "CollectionPage"[\s\S]*?"name": "Landom"[\s\S]*?"url": "https:\/\/montri-th\.github\.io\/Landom\/en\/"/);
  assert.match(english, /<base href="\.\.\/">/);
  assert.match(english, /href="https:\/\/montri-th\.github\.io\/Landom\/en\/#main-content"/);
  assert.equal(english.match(/href="https:\/\/montri-th\.github\.io\/Landom\/en\/#people"/g)?.length, 2);
  assert.doesNotMatch(english, /href="#people"/);
  assert.match(english, /<a class="brand" href="https:\/\/landometer\.com\/"/);
  assert.match(thai, /id="language-toggle"[\s\S]*?href="\.\/en\/"[\s\S]*?hreflang="en"/);
  assert.match(english, /id="language-toggle"[\s\S]*?href="https:\/\/montri-th\.github\.io\/Landom\/"[\s\S]*?hreflang="th"/);
  assert.match(thai, /<a href="\.\/" aria-current="page">/);
  assert.match(english, /<a href="https:\/\/montri-th\.github\.io\/Landom\/en\/" aria-current="page">/);

  for (const html of [thai, english]) {
    assert.match(html, /hreflang="th" href="https:\/\/montri-th\.github\.io\/Landom\/"/);
    assert.match(html, /hreflang="en" href="https:\/\/montri-th\.github\.io\/Landom\/en\/"/);
    assert.match(html, /hreflang="x-default" href="https:\/\/montri-th\.github\.io\/Landom\/"/);
    assert.match(html, /landometer-symbol-transparent\.png\?v=35a1496f/);
    assert.match(html, /property="og:image" content="https:\/\/montri-th\.github\.io\/Landom\/public\/assets\/social\/landom-people-og\.jpg\?v=a7c46cf31e97"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /name="twitter:image" content="https:\/\/montri-th\.github\.io\/Landom\/public\/assets\/social\/landom-people-og\.jpg\?v=a7c46cf31e97"/);
    assert.doesNotMatch(html, /apple-touch-icon/);
    assert.doesNotMatch(html, /montri-th\.github\.io\/Landom\/th\//);
  }
  assert.match(thai, /property="og:image:alt" content="ชาว Landom ถ่ายภาพร่วมกันที่สำนักงาน Landometer"/);
  assert.match(thai, /name="twitter:image:alt" content="ชาว Landom ถ่ายภาพร่วมกันที่สำนักงาน Landometer"/);
  assert.match(english, /property="og:image:alt" content="People of Landom together at the Landometer office"/);
  assert.match(english, /name="twitter:image:alt" content="People of Landom together at the Landometer office"/);
  assert.match(english, /alt="People of Landom working, learning, and spending time together"/);
});

test('the footer follows the contact-first rebuild02 treatment without a form and exposes exact corporate destinations', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const footer = index.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '';
  const socialUrls = [
    'https://www.facebook.com/landometer',
    'https://www.instagram.com/landometer',
    'https://www.tiktok.com/@landometer82',
    'https://www.linkedin.com/company/landometer',
    'https://x.com/landometer'
  ];

  assert.match(footer, /class="footer-measure-line"[\s\S]*?<span><\/span><span><\/span><span><\/span><span><\/span>/);
  assert.doesNotMatch(footer, /<form\b|id="footer-title">\s*Hello\b/i);
  assert.equal((footer.match(/<a class="footer-email" href="mailto:hello@landometer\.com">hello@landometer\.com<\/a>/g) ?? []).length, 1);
  assert.match(footer, /href="https:\/\/maps\.app\.goo\.gl\/8DQPVMtPdxWMBoZU9"/);
  assert.match(footer, /href="https:\/\/landometer\.com\/pdpa\/showDocVer"/);
  assert.match(footer, /id="footer-top-link" href="#top"/);
  assert.match(footer, /id="footer-people-link" href="#people"/);
  assert.match(footer, /class="footer-brand"[\s\S]*?public\/assets\/brand\/landometer-horizontal\.png/);
  for (const url of socialUrls) assert.equal(footer.split(`href="${url}"`).length - 1, 1);
  assert.equal((footer.match(/class="footer-social-links"[\s\S]*?<\/nav>/)?.[0].match(/<a href=/g) ?? []).length, 5);

  assert.match(styles, /\.site-footer\s*\{[^}]*background:\s*linear-gradient\(135deg, #89CEF6 0%, #5ECAD6 50%, #6CD5B3 100%\);/s);
  assert.match(styles, /\.footer-measure-line\s*\{[^}]*height:\s*8px;[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/s);
  for (const color of ['#FF5A5F', '#FFBC1F', '#0AD69C', '#59D2FE']) assert.match(styles, new RegExp(`background: ${color}`));
  assert.match(styles, /\.footer-bottom\s*\{[^}]*border-top:\s*1px solid #33403D;[^}]*background:\s*#11191D;/s);
  assert.match(styles, /\.footer-social-links a\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;[^}]*border-radius:\s*50%;/s);

  for (const token of [
    'footerTitle: "มาเป็นชาว Landom กัน"',
    'footerTitle: "Be part of Landom"',
    'footerSocialLabel: "ช่องทางสังคมของ Landometer"',
    'footerSocialLabel: "Landometer social profiles"',
    'footerBackTop: "กลับไปด้านบน"',
    'footerBackTop: "Back to top"',
    'footerPeople: "ชาว Landom"',
    'footerPeople: "People of Landom"',
    'setText(elements.footerTitle, copy.footerTitle)',
    'elements.footerSocialLinks?.setAttribute("aria-label", copy.footerSocialLabel)',
    'setText(elements.footerTopLink, copy.footerBackTop)',
    'setText(elements.footerPeopleLink, copy.footerPeople)'
  ]) {
    assert.ok(app.includes(token), `Missing locale-aware footer contract: ${token}`);
  }
});

test('the unified navigation preserves approved destinations, accessible menu behavior, and truthful page anchors', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const navigation = await readFile(new URL('../src/navigation.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const joinTeamUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdGVOA--7YLOP2Go4hB-Edj4452MPJyVuWsPDi_O9H2jM6wiw/viewform';

  assert.match(index, /<header[^>]*data-navigation-header[^>]*>[\s\S]*?<div class="header-identity">[\s\S]*?<nav class="header-nav"/);
  assert.match(index, /<a class="brand" href="https:\/\/landometer\.com\/"[\s\S]*?landometer-horizontal\.png\?v=6c71c10505ca/);
  assert.match(index, /<span class="brand-product"[^>]*>[\s\S]*?<span aria-hidden="true">\/<\/span> Landom<\/span>/);
  assert.match(index, /href="https:\/\/montri-th\.github\.io\/CityMETER\/">CityMETER<\/a>/);
  assert.match(index, /href="https:\/\/landometer\.com\/v3\/citywiki">CityWiki<\/a>/);
  const headerMarkup = index.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.ok((headerMarkup.match(/<(?:a|button)\b/g) ?? []).length <= 4, 'desktop navbar must expose at most four direct controls including brand');
  assert.equal(index.split(`href="${joinTeamUrl}"`).length - 1, 3);
  assert.equal((index.match(/class="header-cta-sweep"/g) ?? []).length, 2);
  assert.equal((index.match(/\bdata-cta-discovery\b/g) ?? []).length, 2);
  assert.match(index, /<a[^>]*class="header-cta"[^>]*id="join-team-link"[^>]*>[\s\S]*?<span class="header-cta-label">สมัครร่วมทีม<\/span>[\s\S]*?<span class="header-cta-sweep" aria-hidden="true">สมัครร่วมทีม<\/span>[\s\S]*?<\/a>/);
  assert.match(index, /<a[^>]*class="header-cta site-menu-mobile-cta"[^>]*id="join-team-link-mobile"[^>]*>[\s\S]*?<span class="header-cta-label">สมัครร่วมทีม<\/span>[\s\S]*?<span class="header-cta-sweep" aria-hidden="true">สมัครร่วมทีม<\/span>[\s\S]*?<\/a>/);
  assert.match(index, /id="menu-toggle"[\s\S]*?aria-haspopup="dialog"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="site-menu"/);
  assert.match(index, /id="site-menu" role="dialog" aria-modal="true"[^>]*tabindex="-1"/);
  assert.equal((index.match(/<a href="#people" data-menu-close>/g) ?? []).length, 1);
  assert.doesNotMatch(index, /bookmark-rail|data-scrollspy-link/);
  assert.doesNotMatch(index, /href="#certificates"/);

  assert.match(app, /import \{ initSiteNavigation \} from "\.\/navigation\.js";/);
  assert.match(app, /initSiteNavigation\(\);/);
  assert.match(app, /function setLayeredActionText\b[\s\S]*?querySelectorAll\("\.header-cta-label, \.header-cta-sweep"\)[\s\S]*?layers\.forEach\(\(layer\) => setText\(layer, value\)\)/);
  assert.match(app, /joinTeamLinks\?\.forEach\(\(link\) => setLayeredActionText\(link, copy\.joinTeam\)\)/);
  assert.doesNotMatch(app, /joinTeamLinks\?\.forEach\(\(link\) => setText\(link, copy\.joinTeam\)\)/);
  assert.match(navigation, /event\.key === 'Escape'/);
  assert.match(navigation, /event\.key !== 'Tab'/);
  assert.match(navigation, /toggle\.setAttribute\('aria-expanded'/);
  assert.match(navigation, /toggle\.focus\(\{ preventScroll: true \}\)/);
  assert.match(navigation, /url\.origin === here\.origin[\s\S]*?url\.pathname === here\.pathname[\s\S]*?url\.hash/);
  assert.doesNotMatch(navigation, /url\.search === here\.search/);
  assert.match(navigation, /document\.getElementById\(decodeURIComponent\(url\.hash\.slice\(1\)\)\)/);
  assert.match(navigation, /setMenuOpen\(false, \{ returnFocus: !destination \}\)/);
  assert.match(navigation, /if \(destination\) event\.preventDefault\(\)/);
  assert.match(navigation, /window\.history\.pushState\(\{\}, '', nextUrl\)/);
  assert.match(navigation, /destination\.scrollIntoView\(\{ block: 'start' \}\)/);
  assert.match(navigation, /element\.getClientRects\(\)\.length > 0/);
  assert.match(navigation, /root\.classList\.add\('navigation-enhanced'\)/);
  assert.match(navigation, /window\.addEventListener\('pageshow'/);
  assert.match(navigation, /root\.dataset\.navState = 'calm'/);
  assert.match(navigation, /prefers-reduced-motion: reduce/);
  assert.match(navigation, /new WeakMap\(\)/);
  assert.match(navigation, /document\.addEventListener\(['"]scroll['"],\s*\w+,\s*true\)/);
  assert.match(navigation, /document\.scrollingElement/);
  assert.match(navigation, /\.get\(\w+\)/);
  assert.match(navigation, /\.set\(\w+,\s*\w+\)/);
  assert.match(navigation, />\s*4/);
  assert.match(navigation, /<\s*-4/);
  assert.match(navigation, /<\s*24/);
  assert.doesNotMatch(navigation, /railLinks|railSections|syncScrollspy/);
  assert.match(styles, /\.menu-toggle\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s);
  assert.match(styles, /\.site-header\.is-calm\s*\{/);
  assert.match(styles, /html\.navigation-enhanced \.navigation-fallback\s*\{[^}]*display:\s*none;/s);
  assert.match(styles, /scroll-margin-top:\s*calc\(var\(--site-header-height-prominent\)/);
  assert.match(styles, /:root\[data-nav-state="calm"\]/);
  assert.match(styles, /--site-header-height-prominent:\s*76px;/);
  const calmHeight = Number(styles.match(/--site-header-height-calm:\s*(\d+(?:\.\d+)?)px;/)?.[1]);
  assert.ok(Number.isFinite(calmHeight) && calmHeight >= 44);
  assert.match(styles, /\.site-header\.is-calm\s*\{(?=[^}]*background:\s*color-mix\(in srgb,\s*var\(--surface-canvas\)\s*26%,\s*transparent\);)(?=[^}]*border-bottom(?:-color)?:\s*(?:1px solid )?color-mix\(in srgb,\s*var\(--border-hairline\)\s*20%,\s*transparent\);)[^}]*\}/s);
  assert.doesNotMatch(styles, /\.site-header\.is-calm\s+(?:\.header-inner|\.header-row|\.site-header__row)\s*\{[^}]*transform:\s*scale\((?:0?\.5)\)/s);
  for (const selector of ['.brand', '.header-link', '.header-cta']) {
    const escaped = selector.replace('.', '\\.');
    assert.match(styles, new RegExp(`${escaped}[^{}]*\\{(?=[^}]*min-height:\\s*44px;)[^}]*\\}`, 's'));
  }
  assert.match(styles, /\.brand img\s*\{[^}]*width:\s*clamp\(128px,/s);
  assert.match(styles, /\.header-link\s*\{[^}]*padding-inline:\s*13px;/s);
  assert.match(styles, /\.header-cta\s*\{[^}]*padding:\s*9px var\(--space-5\);/s);
  assert.match(styles, /\.site-menu-panel\s*\{[^}]*top:\s*(?:6px|calc\(var\(--site-header-height(?:-prominent)?\)\s*\+\s*6px\));[^}]*width:\s*(?:min\(340px,[^)]+\)|340px);[^}]*padding:\s*(?:8px|var\(--space-2\));[^}]*border:\s*1px solid var\(--border-default\);[^}]*border-radius:\s*var\(--radius-md\);[^}]*box-shadow:\s*var\(--elevation-sm\);/s);
  assert.match(styles, /@media \(max-width:\s*759px\)[\s\S]*?\.site-menu-panel\s*\{[^}]*top:\s*(?:0|var\(--site-header-height\));[^}]*width:\s*100%;[^}]*border-radius:\s*0 0 var\(--radius-md\) var\(--radius-md\);/s);
  assert.match(styles, /\.header-cta\s*\{(?=[^}]*position:\s*relative;)(?=[^}]*display:\s*inline-flex;)[^}]*\}/s);
  const ctaSweepRule = styles.match(/\.header-cta-sweep\s*\{[^}]*\}/s)?.[0] ?? '';
  const ctaActiveRule = styles.match(/\.header-cta\.is-cta-cue-active \.header-cta-sweep\s*\{[^}]*\}/s)?.[0] ?? '';
  const ctaCueRules = `${ctaSweepRule}\n${ctaActiveRule}`;
  assert.match(ctaSweepRule, /position:\s*absolute;/);
  assert.match(ctaSweepRule, /pointer-events:\s*none;/);
  assert.match(ctaSweepRule, /36%\s+64%/);
  assert.match(ctaSweepRule, /opacity:\s*1;/);
  assert.match(ctaCueRules, /540ms/);
  assert.match(ctaCueRules, /cubic-bezier\((?:0?\.)?16,\s*1,\s*(?:0?\.)?3,\s*1\)/);
  assert.match(styles, /@keyframes\s+lmCtaDiscovery[\s\S]*?-120%[\s\S]*?120%/s);
  assert.doesNotMatch(ctaCueRules, /\binfinite\b/);
  assert.doesNotMatch(styles, /@keyframes\s+lmFlick\b/);
  assert.doesNotMatch(styles, /\.bookmark-rail|Material Symbols Rounded Nav Filled|material-symbols-rounded-groups-filled-300/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?--site-header-height:\s*var\(--site-header-height-prominent\)/s);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.header-cta-sweep\s*\{[^}]*(?:display:\s*none\s*!important|clip-path:\s*inset\(0\s+98%\s+0\s+0\)\s*!important);/s);
  assert.equal((index.match(/\bdata-motion-toggle\b/g) ?? []).length, 1);
  assert.match(index, /<button\b(?=[^>]*id="motion-toggle")(?=[^>]*data-motion-toggle)(?=[^>]*aria-pressed="false")[^>]*>/s);
  const brandMotion = await readFile(new URL('../src/brand-motion.js', import.meta.url), 'utf8');
  assert.match(app, /import \{ initBrandMotion \} from "\.\/brand-motion\.js";/);
  assert.match(app, /brandMotionController\s*=\s*initBrandMotion\(/);
  assert.match(brandMotion, /data-motion-paused|dataset\.motionPaused/);
  assert.match(brandMotion, /const CUE_DURATION_MS = 540/);
  assert.match(brandMotion, /ctas\.find\(\(cta\) => isVisible\(cta, win\)\)/);
  assert.match(brandMotion, /cuePlayed = true/);
});

test('the persistent desktop filter does not steal focus or scroll past the Hero on load', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const syncSource = app.match(/function syncFilterDialogMode\b[\s\S]*?(?=\nfunction openFilters)/)?.[0] ?? '';
  const openSource = app.match(/function openFilters\b[\s\S]*?(?=\nfunction closeFilters)/)?.[0] ?? '';

  assert.match(syncSource, /filterDialog\.setAttribute\("open", ""\)/);
  assert.doesNotMatch(syncSource, /filterDialog\.show\(\)/);
  assert.match(openSource, /filterDialog\.showModal\(\)/);
  assert.match(openSource, /filterRole\.focus\(\{ preventScroll: true \}\)/);
});

test('the unified navigation icon subset is exact, self-hosted, licensed, and preloaded', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const font = await readFile(new URL('../public/assets/fonts/material-symbols-rounded-nav-300.woff2', import.meta.url));
  const fontManifest = JSON.parse(await readFile(new URL('../public/assets/fonts/font-assets.manifest.json', import.meta.url), 'utf8'));
  const fontRecord = fontManifest.faces.find((record) => record.file === 'material-symbols-rounded-nav-300.woff2');

  assert.match(index, /rel="preload" href="\.\/public\/assets\/fonts\/material-symbols-rounded-nav-300\.woff2" as="font" type="font\/woff2" crossorigin/);
  assert.match(styles, /@font-face\s*\{[^}]*font-family:\s*"Material Symbols Rounded Nav";[^}]*material-symbols-rounded-nav-300\.woff2[^}]*font-weight:\s*300;/s);
  assert.doesNotMatch(index, /material-symbols-rounded-groups-filled-300/);
  assert.doesNotMatch(styles, /Material Symbols Rounded Nav Filled|material-symbols-rounded-groups-filled-300/);
  assert.match(styles, /\.icon-symbol\s*\{[^}]*font-family:\s*"Material Symbols Rounded Nav";[^}]*font-variation-settings:\s*"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;/s);
  assert.equal(font.byteLength, 2500);
  assert.equal(createHash('sha256').update(font).digest('hex'), 'd7e283106ed2898726b24504c4e0f5ad524292984a90a4d29553c7dcf53b9657');
  assert.equal(fontRecord?.family, 'Material Symbols Rounded Nav');
  assert.equal(fontRecord?.subset, 'unified-nav-7');
  assert.equal(fontRecord?.axesLock, 'FILL 0, wght 300, GRAD 0, opsz 24');
  assert.deepEqual(fontRecord?.glyphs, ['open_in_new', 'menu', 'close', 'light_mode', 'dark_mode', 'contrast', 'groups']);
  assert.equal(fontRecord?.approvalAuthority, 'Landometer Design System 0.9.1');
  assert.equal(fontRecord?.designSystemStatus, 'Canonical outline interface-symbol subset');
  assert.equal(fontRecord?.license, 'Apache License 2.0');
  assert.match(fontManifest.authorityScope, /Design System authority covers[\s\S]*unified-nav-7 outline subset/i);
  assert.match(fontManifest.authorityScope, /rebuild02-footer-r10 remains an owner-approved Landom-local addition/i);
  assert.match(fontManifest.authorityScope, /does not alter the normative Design System package/i);
});

test('DS v0.9.1 colors and motif 1.2.1 use exact local bytes with source-visible fallbacks', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const assets = new Map([
    ['public/assets/design-system/color-srgb-05.production.css', '3bac2499df594bbf6b016b650ee7763f7ec093e33bc5f28239144e0677281d5c'],
    ['public/assets/landometer/landometer-motifs.css', '7cc2deb475a8d6e4af331407b2b4b741716c458a8ce885e2fb2859374b93912e'],
    ['public/assets/landometer/landometer-motifs.js', '3a5caef7918a85885b61dd53e049ea8bf2b0a3cea508f587bb14970bfe6deaf2'],
    ['public/assets/landometer/svg/logo-full.svg', '90e9543f2f86a18f891331c13be25038b4334ca7dbe55b194650bc441e3558e1'],
    ['public/assets/landometer/svg/dial-full.svg', '7ecfd1165a3e7ad25a0bb01b9680c35f71ff8a98edfd411dfe1b712cee12654d'],
    ['public/assets/landometer/svg/rings-full.svg', 'b50ec8fa3828ee5b3504ff05e0c47c1ae55f6b644225482454ec319809552286'],
    ['public/assets/landometer/svg/layers-quiet.svg', 'e3e2bf65bcd38d34d0a07910bef44917eab76fdaf097131ec133d163f6a65a03'],
    ['public/assets/landometer/svg/slice-quiet.svg', 'c72114d43b81584cbb46251a5519f768087259bf135216f6ea7933a83df4de6b'],
    ['public/assets/landometer/svg/cultivate-full.svg', 'ce494d792c12d73949a3dc8e6d18f6f93faa6aeab33d18b2de0889ab4af5af12']
  ]);
  const fallbacks = [
    ['logo', false, 'logo-full.svg'],
    ['dial', false, 'dial-full.svg'],
    ['rings', false, 'rings-full.svg'],
    ['layers', true, 'layers-quiet.svg'],
    ['slice', true, 'slice-quiet.svg'],
    ['cultivate', false, 'cultivate-full.svg']
  ];

  assert.match(index, /<html\b(?=[^>]*data-ds="landometer")(?=[^>]*data-ds-version="0\.9\.1")[^>]*>/s);
  assert.match(index, /<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="\.\/public\/assets\/design-system\/color-srgb-05\.production\.css(?:\?[^"']*)?")[^>]*>/s);
  assert.match(index, /<link\b(?=[^>]*rel="stylesheet")(?=[^>]*href="\.\/public\/assets\/landometer\/landometer-motifs\.css(?:\?[^"']*)?")[^>]*>/s);
  assert.match(index, /<script\b(?=[^>]*src="\.\/public\/assets\/landometer\/landometer-motifs\.js(?:\?[^"']*)?")(?=[^>]*\bdefer\b)[^>]*><\/script>/s);

  for (const [assetPath, expectedDigest] of assets) {
    const bytes = await readFile(new URL(`../${assetPath}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expectedDigest, assetPath);
  }

  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const motifMarkup = [...`${index}\n${app}`.matchAll(/<lm-motif\b([^>]*)>([\s\S]*?)<\/lm-motif>/g)];
  assert.equal(motifMarkup.length, fallbacks.length);
  for (const [kind, quiet, file] of fallbacks) {
    const matching = motifMarkup.filter(([, attributes, body]) => {
      const isKind = new RegExp(`\\bkind=["']${kind}["']`).test(attributes);
      const isQuiet = /(?:^|\s)quiet(?:\s|=|$)/.test(attributes);
      return isKind && isQuiet === quiet && body.includes(`./public/assets/landometer/svg/${file}`);
    });
    assert.equal(matching.length, 1, `${kind} must keep its exact ${file} source fallback`);
  }

  const header = index.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? '';
  const brand = header.match(/<a\b[^>]*class="[^"]*\bbrand\b[^"]*"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.match(brand, /<img\b/);
  assert.doesNotMatch(brand, /<lm-motif\b/);
});

test('the office map action matches the published rebuild02 capsule and icon contract', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const font = await readFile(new URL('../public/assets/fonts/material-symbols-rounded-footer-r10.ttf', import.meta.url));
  const fontManifest = JSON.parse(await readFile(new URL('../public/assets/fonts/font-assets.manifest.json', import.meta.url), 'utf8'));
  const fontRecord = fontManifest.faces.find((record) => record.file === 'material-symbols-rounded-footer-r10.ttf');

  assert.match(index, /rel="preload" href="\.\/public\/assets\/fonts\/material-symbols-rounded-footer-r10\.ttf" as="font" type="font\/ttf" crossorigin/);
  assert.match(index, /class="footer-map-link"[^>]*maps\.app\.goo\.gl\/8DQPVMtPdxWMBoZU9[^>]*>[\s\S]*?class="icon-symbol footer-map-icon"[^>]*>map<[\s\S]*?id="footer-map-label"[\s\S]*?class="text-link__cue"[^>]*>↗</s);
  assert.match(styles, /\.footer-map-link\s*\{(?=[^}]*min-height:\s*44px;)(?=[^}]*padding-inline:\s*var\(--space-3\);)(?=[^}]*border:\s*1px solid)(?=[^}]*border-radius:\s*var\(--radius-pill\);)(?=[^}]*text-decoration:\s*none;)[^}]*\}/s);
  assert.match(styles, /\.footer-map-icon\s*\{[^}]*font-family:\s*"Material Symbols Rounded Footer";[^}]*font-variation-settings:\s*"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;/s);
  assert.equal(font.byteLength, 9464);
  assert.equal(createHash('sha256').update(font).digest('hex'), 'bbcc034717d243cd5a3653dd1169cec00e8f11f289c20ef949078db24dc680f5');
  assert.equal(fontRecord?.subset, 'rebuild02-footer-r10');
  assert.ok(fontRecord?.glyphs.includes('map'));
  assert.equal(fontRecord?.license, 'Apache License 2.0');
});

test('Pages attestation binds cache-busted live bytes to this workflow build manifest', async () => {
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /outputs:\s*\n\s+manifest_sha256: \$\{\{ steps\.build_manifest\.outputs\.sha256 \}\}/);
  assert.match(workflow, /EXPECTED_MANIFEST_SHA256: \$\{\{ needs\.build\.outputs\.manifest_sha256 \}\}/);
  assert.match(workflow, /RELEASE_SHA: \$\{\{ github\.sha \}\}/);
  assert.match(workflow, /cache_bust="release=\$RELEASE_SHA"/);
  assert.match(workflow, /actual_manifest_sha256=.*sha256sum \/tmp\/landom-build-manifest\.json/);
  assert.match(workflow, /"\$actual_manifest_sha256" = "\$EXPECTED_MANIFEST_SHA256"/);
  assert.match(workflow, /src\/media-parallax\.js\?\$cache_bust/);
  assert.match(workflow, /media_parallax_script_type[\s\S]*?application\/javascript\*\|text\/javascript\*/);
  assert.match(workflow, /\["src\/media-parallax\.js", "\/tmp\/landom-media-parallax\.js"\]/);
  assert.match(workflow, /src\/brand-motion\.js\?\$cache_bust/);
  assert.match(workflow, /brand_motion_script_type[\s\S]*?application\/javascript\*\|text\/javascript\*/);
  assert.match(workflow, /\["src\/brand-motion\.js", "\/tmp\/landom-brand-motion\.js"\]/);
  assert.match(workflow, /public\/assets\/design-system\/color-srgb-05\.production\.css\?\$cache_bust/);
  assert.match(workflow, /public\/assets\/landometer\/landometer-motifs\.css\?\$cache_bust/);
  assert.match(workflow, /public\/assets\/landometer\/landometer-motifs\.js\?\$cache_bust/);
  for (const file of ['logo-full', 'dial-full', 'rings-full', 'layers-quiet', 'slice-quiet', 'cultivate-full']) {
    assert.match(workflow, new RegExp(`public/assets/landometer/svg/${file}\\.svg`));
  }
  for (const digest of [
    '3bac2499df594bbf6b016b650ee7763f7ec093e33bc5f28239144e0677281d5c',
    '7cc2deb475a8d6e4af331407b2b4b741716c458a8ce885e2fb2859374b93912e',
    '3a5caef7918a85885b61dd53e049ea8bf2b0a3cea508f587bb14970bfe6deaf2',
    '90e9543f2f86a18f891331c13be25038b4334ca7dbe55b194650bc441e3558e1'
  ]) {
    assert.ok(workflow.includes(digest), `workflow must pin ${digest}`);
  }
  assert.doesNotMatch(workflow, /material-symbols-rounded-groups-filled-300|filled_nav_icon_font/);
});

test('photo parallax is explicit, bounded, passive, lifecycle-safe, and excluded from evidence and brand media', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const parallax = await readFile(new URL('../src/media-parallax.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const staticImages = [...index.matchAll(/<img\b[^>]*\bdata-parallax-media\b[^>]*>/g)].map((match) => match[0]);
  const avatarRenderer = app.match(/function avatarMarkup\b[\s\S]*?(?=function hydrateImages\b)/)?.[0] ?? '';
  const certificateRenderer = app.match(/function certificatesMarkup\b[\s\S]*?(?=function personDetailMarkup\b)/)?.[0] ?? '';

  assert.equal(staticImages.length, 4);
  assert.equal((index.match(/\bdata-parallax-authority="owner-approved-site-override"/g) ?? []).length, 1);
  assert.deepEqual(staticImages.map((markup) => markup.match(/data-parallax-depth="(\d+)"/)?.[1]), ['32', '20', '18', '22']);
  assert.match(avatarRenderer, /class="avatar-image"[^>]*data-parallax-media[^>]*data-parallax-depth="14"/);
  assert.doesNotMatch(certificateRenderer, /data-parallax-media/);
  assert.doesNotMatch(index, /<img[^>]*(?:landometer-horizontal|landometer-symbol)[^>]*data-parallax-media/i);

  assert.match(app, /import \{ initMediaParallax \} from "\.\/media-parallax\.js";/);
  assert.match(app, /mediaParallaxController\s*=\s*initMediaParallax\(\)/);
  assert.match(app, /mediaParallaxController\?\.refresh\(elements\.board\)/);
  for (const token of [
    'const MEDIA_SELECTOR = "img[data-parallax-media]"',
    'const MAX_DEPTH = 36',
    'maxOffset: parallaxBleedLimit(frameRect.height, scale)',
    'image.parentElement?.getBoundingClientRect?.()',
    'new win.IntersectionObserver',
    'win.requestAnimationFrame',
    'win.cancelAnimationFrame',
    'addWindowListener("scroll", onScroll, { passive: true })',
    '"(prefers-reduced-motion: reduce)"',
    'win?.matchMedia?.("print")',
    'addWindowListener("beforeprint", onBeforePrint)',
    'addWindowListener("pagehide", onPageHide)',
    'destroy()'
  ]) {
    assert.ok(parallax.includes(token), `Missing media-parallax contract: ${token}`);
  }
  assert.match(parallax, /const requestedDepth = clamp\(metrics\.depth, 0, MAX_DEPTH\)/);
  assert.match(parallax, /Math\.min\(requestedDepth, Math\.max\(0, suppliedLimit\)\)/);
  assert.match(styles, /html\.media-parallax-enabled img\[data-parallax-media\]\.is-media-parallax-active\s*\{[^}]*will-change:\s*transform;/s);
  assert.match(styles, /@media print[\s\S]*?img\[data-parallax-media\]\s*\{[^}]*transform:\s*none !important;[^}]*will-change:\s*auto !important;/s);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?img\[data-parallax-media\]\s*\{[^}]*transform:\s*none !important;[^}]*will-change:\s*auto !important;/s);
});

test('approach motion is opt-in, once-only, fail-open, and safe across lifecycle edges', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const motion = await readFile(new URL('../src/approach-motion.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(index, /"IntersectionObserver" in window[\s\S]*?prefers-reduced-motion: reduce[\s\S]*?matchMedia\("print"\)[\s\S]*?root\.classList\.add\("lds-motion-pending"\)/);
  assert.match(index, /data-approach="approach\.soft"/);
  assert.equal((index.match(/data-approach="approach\.inline-(?:start|end)"/g) ?? []).length, 2);
  assert.match(index, /class="footer-main"[^>]*data-approach-sequence/);
  assert.doesNotMatch(index, /class="masonry-board"[^>]*data-approach(?:-sequence)?/);
  assert.match(app, /import \{ initApproachMotion \} from "\.\/approach-motion\.js";/);
  assert.match(app, /initApproachMotion\(\);/);
  assert.doesNotMatch(app, /shell\.dataset\.approach\s*=/);
  assert.doesNotMatch(app, /shell\.dataset\.approachKey\s*=/);
  assert.match(app, /approachMotionController\?\.refresh\(elements\.board\)/);
  assert.match(app.match(/function renderDirectory\(\)[\s\S]*?(?=\nfunction formatNumber)/)?.[0] ?? '', /layoutMasonry[\s\S]*?approachMotionController\?\.refresh\(elements\.board\)/);
  assert.match(app.match(/function initialize\(\)[\s\S]*?(?=\ninitialize\(\))/)?.[0] ?? '', /approachMotionController = initApproachMotion\(\)[\s\S]*?loadData\(\)/);
  const openPersonSource = app.match(/function openPerson\b[\s\S]*?(?=\nfunction closePerson)/)?.[0] ?? '';
  const closePersonSource = app.match(/function closePerson\b[\s\S]*?(?=\nfunction renderCertificateDialog)/)?.[0] ?? '';
  assert.match(openPersonSource, /if \(animate\) approachMotionController\?\.landSubtree\(elements\.board\);[\s\S]*?else approachMotionController\?\.land\(shell\);[\s\S]*?cardPositionSnapshot\(\)/);
  assert.match(closePersonSource, /if \(animate\) approachMotionController\?\.landSubtree\(elements\.board\);[\s\S]*?else approachMotionController\?\.land\(shell\);[\s\S]*?cardPositionSnapshot\(\)/);

  for (const contract of [
    'threshold: 0.14',
    'rootMargin: "0px 0px -12% 0px"',
    'const INIT_WATCHDOG_MS = 2400',
    'const STAGGER_STEP_MS = 150',
    'const STAGGER_CAP_MS = 450',
    'const TRANSFORM_SETTLE_MS = 920',
    'function armFreshTargets',
    'function failOpen',
    'function onFocusIn',
    'function onHashChange',
    'function onPageShow',
    'function onBeforePrint',
    'function onReducedMotionChange',
    'const atDocumentEnd = Math.ceil',
    '(atDocumentEnd && overlapsBlockViewport)',
    'hasAlreadyPainted'
  ]) {
    assert.ok(motion.includes(contract), `Missing hardened motion contract: ${contract}`);
  }
  for (const excludedTarget of ['"header"', '"nav"', '"h1"', '"[aria-live]"', '".hero"']) {
    assert.ok(motion.includes(excludedTarget), `Missing critical motion exclusion: ${excludedTarget}`);
  }
  assert.equal((motion.match(/new\s+win\.IntersectionObserver\b/g) ?? []).length, 1);
  assert.match(motion, /observer\?\.unobserve\(target\)/);
  assert.match(styles, /html\.lds-motion-ready \[data-approach\]\.is-lds-reveal-armed/);
  assert.doesNotMatch(styles, /html\.lds-motion-pending \[data-approach\]/);
  assert.match(index, /__LANDOM_MOTION_WATCHDOG__[\s\S]*?setTimeout[\s\S]*?2400/);
  assert.match(motion, /function clearBootstrapWatchdog\(\)/);
  assert.match(styles, /--motion-ease-settle:\s*cubic-bezier\(0\.2, 0\.9, 0\.25, 1\.08\)/);
  assert.match(styles, /--leading-display-th:\s*1\.25;/);
  assert.match(styles, /--motion-duration-reveal-opacity:\s*760ms/);
  assert.match(styles, /--motion-duration-reveal-transform:\s*920ms/);
  assert.match(styles, /--motion-duration-media-arrival:\s*900ms/);
  assert.match(styles, /--motion-delay-stagger:\s*150ms/);
  assert.match(styles, /--motion-delay-stagger-cap:\s*450ms/);
  assert.match(styles, /--motion-distance-reveal:\s*32px/);
  assert.match(styles, /--motion-distance-reveal-pair:\s*36px/);
  assert.match(styles, /--motion-scale-reveal:\s*0\.985/);
  assert.match(styles, /\.is-lds-reveal-armed\.is-lds-revealed\.is-lds-reveal-arriving\s*\{[\s\S]*?opacity var\(--motion-duration-reveal-opacity\) var\(--motion-ease-enter\)[\s\S]*?transform var\(--motion-duration-reveal-transform\) var\(--motion-ease-settle\)/s);
  assert.match(styles, /\.is-lds-reveal-armed\s*\{[^}]*transition:\s*none;/s);
  assert.match(styles, /translate3d\(0, var\(--motion-distance-reveal\), 0\)\s*scale\(var\(--motion-scale-reveal\)\)/);
  assert.match(styles, /data-approach="approach\.inline-start"[^}]*translate3d\([^)]*var\(--motion-distance-reveal-pair\)/s);
  assert.match(styles, /data-approach="approach\.inline-end"[^}]*translate3d\([^)]*var\(--motion-distance-reveal-pair\)/s);
  assert.match(styles, /\.site-footer\s*\{[^}]*overflow-x:\s*clip;/s);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?opacity:\s*1 !important;[\s\S]*?transform:\s*none !important;/s);
});

test('the social preview is the exact owner-approved privacy-normalized derivative', async () => {
  const image = await readFile(new URL('../public/assets/social/landom-people-og.jpg', import.meta.url));
  const digest = createHash('sha256').update(image).digest('hex');
  const manifest = JSON.parse(await readFile(new URL('../docs/assets-manifest.json', import.meta.url), 'utf8'));
  const identity = JSON.parse(await readFile(new URL('../docs/identity-discovery.json', import.meta.url), 'utf8'));
  const asset = manifest.assets.find((record) => record.assetId === 'social-landom-people-og');
  const identityAsset = identity.identityAssets.find((record) => record.role === 'social preview image');

  assert.equal(image.byteLength, 211478);
  assert.equal(digest, 'a7c46cf31e976e420f78eb324ed9c41cbbdb5b91be28849ec6e307cf4ca5865c');
  assert.equal(asset.width, 1200);
  assert.equal(asset.height, 630);
  assert.equal(asset.metadataStripped, true);
  assert.deepEqual(asset.approvedRoles, ['social-preview']);
  assert.equal(asset.publicationBasis, 'owner_authorized_social_preview_image');
  assert.deepEqual(asset.alt, {
    th: 'ชาว Landom ถ่ายภาพร่วมกันที่สำนักงาน Landometer',
    en: 'People of Landom together at the Landometer office'
  });
  assert.equal(identityAsset.deliveryUrl, 'https://montri-th.github.io/Landom/public/assets/social/landom-people-og.jpg?v=a7c46cf31e97');
  assert.deepEqual(identityAsset.localizedAlt, asset.alt);
  assert.equal(identityAsset.ownerApproval.scope, 'public_social_preview_only');
  for (const marker of ['Exif\0\0', 'http://ns.adobe.com/xap/1.0/', 'GPS', 'iPhone']) {
    assert.equal(image.includes(Buffer.from(marker, 'utf8')), false, `Unexpected source metadata marker: ${marker}`);
  }
});

test('the Hero uses the four governed community photographs from the selected constellation concept', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const manifest = JSON.parse(await readFile(new URL('../docs/assets-manifest.json', import.meta.url), 'utf8'));
  const expected = [
    ['hero-landom-community-anchor', 'public/assets/hero/landom-community-anchor.jpg'],
    ['hero-landom-community-dinner', 'public/assets/hero/landom-community-dinner.jpg'],
    ['hero-landom-community-citymeter', 'public/assets/hero/landom-community-citymeter.jpg'],
    ['hero-landom-community-gathering', 'public/assets/hero/landom-community-gathering.jpg']
  ];

  assert.match(source, /id="hero-image"[\s\S]*?landom-community-anchor\.jpg/);
  assert.match(source, /hero-moment--dinner[\s\S]*?landom-community-dinner\.jpg/);
  assert.match(source, /hero-moment--work[\s\S]*?landom-community-citymeter\.jpg/);
  assert.match(source, /hero-moment--gathering[\s\S]*?landom-community-gathering\.jpg/);
  assert.doesNotMatch(source, /landom-people-hero\.jpg/);
  assert.match(styles, /\.hero-moment\s*\{[\s\S]*?border-radius:\s*50%;/);
  assert.match(styles, /@media \(max-width: 759px\)[\s\S]*?\.hero-moment--gathering/);

  for (const [assetId, assetPath] of expected) {
    const record = manifest.assets.find((asset) => asset.assetId === assetId);
    assert.equal(record?.path, assetPath);
    assert.equal(record?.publicationBasis, 'owner_authorized_hero_image');
    assert.equal(record?.ownerApproval?.status, 'granted');
    assert.equal(record?.ownerApproval?.scope, 'public_hero_collage_image_only');
    assert.deepEqual(record?.approvedRoles, ['hero-image']);
    assert.ok(record?.prohibitedRoles?.includes('social-preview'));
  }
});

test('contribution destination actions use governed circle and capsule geometry', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const font = await readFile(new URL('../public/assets/fonts/material-symbols-rounded-open-in-new-300.woff2', import.meta.url));
  const fontManifest = JSON.parse(await readFile(new URL('../public/assets/fonts/font-assets.manifest.json', import.meta.url), 'utf8'));
  const renderer = app.match(/function contributionsMarkup\b[\s\S]*?(?=function achievementsMarkup\b)/)?.[0] ?? '';
  const iconRenderer = app.match(/function externalLinkIconMarkup\b[\s\S]*?(?=function educationLinkedInMarkup\b)/)?.[0] ?? '';
  const fontRecord = fontManifest.faces.find((record) => record.family === 'Material Symbols Rounded');

  assert.match(renderer, /class="contribution-heading-link"/);
  assert.match(renderer, /class="contribution-open-icon"/);
  assert.match(renderer, /externalLinkIconMarkup\(\)/);
  assert.doesNotMatch(renderer, /↗/);
  assert.match(iconRenderer, /material-symbols-rounded external-link-icon/);
  assert.match(iconRenderer, />open_in_new<\/span>/);
  assert.doesNotMatch(iconRenderer, /<svg\b/);
  assert.match(styles, /@font-face\s*\{[^}]*font-family:\s*"Material Symbols Rounded";[^}]*font-weight:\s*300;/s);
  assert.match(styles, /\.external-link-icon\s*\{[^}]*font-family:\s*"Material Symbols Rounded";[^}]*font-variation-settings:\s*"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 20;/s);
  assert.match(styles, /\.contribution-open-icon\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;[^}]*border-radius:\s*50%;/s);
  assert.match(styles, /\.contribution-evidence-link\s*\{[^}]*min-height:\s*44px;[^}]*padding:\s*10px\s+var\(--space-5\);[^}]*border-radius:\s*var\(--radius-pill\);/s);
  assert.match(styles, /\.timeline-item,[\s\S]*?\.contribution-item,[\s\S]*?\.achievement-item\s*\{[^}]*border-radius:\s*var\(--radius-md\);/s);
  assert.match(index, /rel="preload" href="\.\/public\/assets\/fonts\/material-symbols-rounded-nav-300\.woff2" as="font" type="font\/woff2" crossorigin/);
  assert.equal(font.byteLength, 1124);
  assert.equal(createHash('sha256').update(font).digest('hex'), '778b29f8befe5ba7a8f0f8188d4c12e3c53d00810dac10337609b04d8506d46e');
  assert.equal(fontRecord?.subset, 'open_in_new');
  assert.equal(fontRecord?.axesLock, 'FILL 0, wght 300, GRAD 0, opsz 20');
  assert.equal(fontRecord?.license, 'Apache License 2.0');
});

test('the Landom community work uses the approved Thai name in canonical and short forms', async () => {
  const works = JSON.parse(await readFile(new URL('../data/generated/works.json', import.meta.url), 'utf8'));
  const work = works.find((record) => record.workId === 'work-landom-community');
  assert.equal(work.names.th, 'Landom: ชาวด้อมผู้สร้าง Landometer');
  assert.equal(work.shortNames.th, 'Landom: ชาวด้อมผู้สร้าง Landometer');
});

test('profile cards use English role names, explicit status capsules, and restrained education detail type', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(app, /function engagementRoleName[\s\S]*?localizedField\([\s\S]*?, "en"\)/);
  assert.match(app, /function engagementChipName[\s\S]*?localizedField\([\s\S]*?, "en"\)/);
  assert.match(app, /function statusDisplay\(model\)[\s\S]*?"Alumni" : "Active"/);
  assert.match(app, /class="card-role-status"[\s\S]*?class="role-badge"[\s\S]*?class="status-badge"/);
  assert.doesNotMatch(app, /const standardized = \["fulltime", "parttime"\]/);
  assert.match(app, /registry: "ชาวด้อม Landom"/);
  assert.match(app, /educationImpvestConsultant: "ที่ปรึกษาธุรกิจ Impvest จาก"/);
  assert.match(app, /educationImpvestConsultant: "Impvest Consulting Partner from"/);
  assert.match(app, /education-context--literal-case/);
  assert.match(app, /String\(engagementProgramCode\)\.toUpperCase\(\) === "IMP"/);
  assert.match(styles, /\.card-role-status\s*\{[\s\S]*?flex-wrap: wrap;[\s\S]*?gap: var\(--space-2\);/);
  assert.match(styles, /\.status-badge\[data-status="active"\][\s\S]*?var\(--semantic-success-fill\)/);
  assert.match(styles, /\.education-program,[\s\S]*?\.education-institution\s*\{[\s\S]*?font-size: var\(--type-body-sm\);[\s\S]*?font-weight: 400;/);
});

test('directory ordering keeps Active first and ranks Alumni by their latest completed engagement', async () => {
  const compare = await personModelComparatorFromSource();
  const models = [
    {
      id: 'older-alumni',
      statusKey: 'alumni',
      engagements: [{ status: 'completed', end: '2025-12-31' }]
    },
    {
      id: 'active-first',
      statusKey: 'active',
      engagements: [{ status: 'ongoing', end: null }]
    },
    {
      id: 'I0043',
      statusKey: 'alumni',
      engagements: [{ status: 'completed', end: '2026-08-25' }]
    },
    {
      id: 'active-second',
      statusKey: 'active',
      engagements: [{ status: 'ongoing', end: null }]
    }
  ];

  assert.deepEqual(
    models.sort(compare).map((model) => model.id),
    ['active-first', 'active-second', 'I0043', 'older-alumni']
  );
});

test('directory ordering inspects every engagement and puts undated Alumni last', async () => {
  const compare = await personModelComparatorFromSource();
  const models = [
    { id: 'undated', statusKey: 'alumni', engagements: [{ status: 'completed', end: null }] },
    {
      id: 'multiple-engagements',
      statusKey: 'alumni',
      engagements: [
        { status: 'completed', end: '2024-05-31' },
        { status: 'completed', end: '2026-02-14' }
      ]
    },
    { id: 'single-engagement', statusKey: 'alumni', engagements: [{ status: 'completed', end: '2025-11-30' }] }
  ];

  assert.deepEqual(
    models.sort(compare).map((model) => model.id),
    ['multiple-engagements', 'single-engagement', 'undated']
  );
});

test('directory ordering preserves source order for equal status and end-date ties', async () => {
  const compare = await personModelComparatorFromSource();
  const models = [
    { id: 'tie-a', statusKey: 'alumni', engagements: [{ status: 'completed', end: '2025-07-31' }] },
    { id: 'tie-b', statusKey: 'alumni', engagements: [{ status: 'completed', end: '2025-07-31' }] },
    { id: 'undated-a', statusKey: 'alumni', engagements: [] },
    { id: 'undated-b', statusKey: 'alumni', engagements: [] }
  ];

  assert.deepEqual(
    models.sort(compare).map((model) => model.id),
    ['tie-a', 'tie-b', 'undated-a', 'undated-b']
  );
});

test('Draft is an Alumni record dated from the owner-confirmed last day', async () => {
  const data = JSON.parse(await readFile(new URL('../data/generated/site-data.json', import.meta.url), 'utf8'));
  const draft = data.people.find((person) => person.personId === 'I0043');
  const draftEngagements = data.engagements.filter((engagement) => engagement.personId === 'I0043');

  assert.equal(draft?.currentStatus, 'alumni');
  assert.ok(
    draftEngagements.some((engagement) => engagement.status === 'completed' && engagement.end === '2026-08-25'),
    'Draft must carry the explicit owner-confirmed last day used by Alumni ordering'
  );
});

test('education labels expose institution context and render program or Chula-aware student wording without duplication', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const educationFor = app.match(/function educationFor\b[\s\S]*?(?=function educationLabelText\b)/)?.[0] ?? '';
  const educationLabelSource = app.match(/function educationLabelText\b[\s\S]*?(?=function normalizedBoolean\b)/)?.[0] ?? '';
  const educationSummary = app.match(/function educationSummary\b[\s\S]*?(?=function programCode\b)/)?.[0] ?? '';
  const cardRenderer = app.match(/function renderCard\b[\s\S]*?(?=function filteredModels\b)/)?.[0] ?? '';
  const educationDetail = app.match(/function educationDetailMarkup\b[\s\S]*?(?=function roleHistoryMarkup\b)/)?.[0] ?? '';

  assert.match(educationFor, /institutionId:\s*recordId\(institution\s*\|\|\s*\{\},\s*"institution"\)/);
  assert.match(cardRenderer, /educationLabelText\(model\)/);
  assert.match(educationDetail, /educationLabelText\(model,\s*\{\s*detail:\s*true\s*\}\)/);
  assert.match(
    educationSummary,
    /labelKey\s*===\s*"educationProgram"[\s\S]*?return model\.education\.shortInstitution\s*\|\|\s*model\.education\.cardDisplay\s*\|\|\s*model\.education\.shortProgram/
  );
  assert.match(educationDetail, /const programIsContext\s*=\s*model\.education\.labelKey\s*===\s*"educationProgram"/);
  assert.match(educationDetail, /program\s*&&\s*!programIsContext\s*\?/);
  assert.match(app, /educationInternship:\s*"นักศึกษาฝึกงานจาก"/);
  assert.match(app, /educationCooperative:\s*"นักศึกษาสหกิจศึกษาจาก"/);

  assert.ok(educationLabelSource, 'educationLabelText must remain independently testable');
  const state = { language: 'th' };
  const translations = {
    educationInternship: 'นักศึกษาฝึกงานจาก',
    educationCooperative: 'นักศึกษาสหกิจศึกษาจาก'
  };
  const educationLabelText = Function(
    'state',
    'message',
    `${educationLabelSource}; return educationLabelText;`
  )(state, (key) => translations[key] ?? key);

  const programModel = {
    education: {
      labelKey: 'educationProgram',
      shortProgram: 'CEDT',
      fullProgram: 'วิศวกรรมคอมพิวเตอร์และเทคโนโลยีดิจิทัล',
      institutionId: 'inst-chula'
    }
  };
  assert.equal(educationLabelText(programModel), 'CEDT');
  assert.equal(
    educationLabelText(programModel, { detail: true }),
    'วิศวกรรมคอมพิวเตอร์และเทคโนโลยีดิจิทัล'
  );

  const chulaModel = {
    education: { labelKey: 'educationInternship', institutionId: 'inst-chula' }
  };
  const nonChulaModel = {
    education: { labelKey: 'educationInternship', institutionId: 'inst-kmitl' }
  };
  assert.equal(educationLabelText(chulaModel), 'นิสิตฝึกงานจาก');
  assert.equal(educationLabelText(nonChulaModel), 'นักศึกษาฝึกงานจาก');
  state.language = 'en';
  assert.equal(educationLabelText(chulaModel), 'นักศึกษาฝึกงานจาก');
});

test('Pond, Mos, and Faze use their academic placement for education context even when later part-time work exists', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const data = JSON.parse(await readFile(new URL('../data/generated/site-data.json', import.meta.url), 'utf8'));
  const modelBuilder = app.match(/function buildModels\b[\s\S]*?(?=function makeSearchText\b)/)?.[0] ?? '';

  assert.match(modelBuilder, /const primaryPlacementType = academicPlacementTypeFor\(primaryEngagement\)/);
  assert.match(modelBuilder, /const academicEngagement = String\(programCode\(primaryEngagement\)\)\.toUpperCase\(\) === "IMP" \|\|/);
  assert.match(modelBuilder, /\["internship", "cooperative_education"\]\.includes\(primaryPlacementType\)/);
  assert.match(modelBuilder, /: personEngagements\.find\(\(engagement\) =>/);
  assert.match(modelBuilder, /\["internship", "cooperative_education"\]\.includes\(academicPlacementTypeFor\(engagement\)\)/);
  assert.match(modelBuilder, /educationFor\(personRecord, academicEngagement,/);

  const placementTypesFor = (personId) => data.engagements
    .filter((engagement) => engagement.personId === personId)
    .map((engagement) => engagement.academicPlacementType)
    .sort();
  assert.deepEqual(placementTypesFor('I0013'), ['internship']);
  assert.deepEqual(placementTypesFor('I0014'), ['internship', 'not_applicable']);
  assert.deepEqual(placementTypesFor('I0015'), ['internship', 'not_applicable']);
  for (const personId of ['I0013', 'I0014', 'I0015']) {
    assert.ok(
      data.engagements.some((engagement) => engagement.personId === personId && engagement.academicPlacementType === 'internship'),
      `${personId} must retain an internship engagement for academic context`
    );
  }
});

test('the nine owner-requested blank-background portraits have governed gradients and edge-refined v2 hashes', async () => {
  const targetPersonIds = [
    'I0001',
    'I0008',
    'I0012',
    'I0018',
    'I0019',
    'I0021',
    'I0025',
    'I0033',
    'I0035'
  ];
  const ownerInstruction = 'owner_instruction_2026-08-25';
  const edgeFollowup = 'owner_followup_edge_refinement_2026-08-25';
  const priorHashes = new Map([
    ['I0001', 'd3afe92f666f5bc36d88bf66d16e83807199a77f00b9401ab77a029efeb3b823'],
    ['I0008', '5681cbc4c7d43f2f714077da68fe02fd7f742b711def940529b60d1e65f18c8a'],
    ['I0012', '7bfbc53e4c37b0150debcedd79ca91a955eba8560f30db9df168a1296d087746'],
    ['I0018', '1697ef4a5351458eb08644f887dcf693d0192486908e28e1ca6a1e9c64e66b5d'],
    ['I0019', '48588a875fb51c653b5405e9e0ecce01e34eb3bb1051c367c2242f564cdf9884'],
    ['I0021', '1185fbee98581eb482371858b3a5c248dc1a5c8a2bba4aec2da449b74e8234b9'],
    ['I0025', 'd88521ed84510c8cdda913e238ee41f803b1d2f61dccae5cc29b997b58909a63'],
    ['I0033', '6b7db934b93451bec835485d6e477027af0889cf5ff4c9f2edf5ae45505f0caa'],
    ['I0035', 'c67e8a36b8daf1b754d69977bd9e0e1cb97dc9604c4d6780099ec3dc4fae23a1']
  ]);
  const approvedGradients = new Map([
    [
      'atmosphere.gradient.measure.deep',
      'linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%)'
    ],
    [
      'atmosphere.gradient.measure.luminous',
      'linear-gradient(135deg, #89CEF6 0%, #5ECAD6 50%, #6CD5B3 100%)'
    ],
    [
      'atmosphere.gradient.ground.current',
      'linear-gradient(135deg, #0F5773 0%, #006A6A 50%, #1F744F 100%)'
    ],
    [
      'atmosphere.gradient.ground.mist',
      'linear-gradient(135deg, #C4E0EE 0%, #B2E2E2 50%, #CCE6D0 100%)'
    ],
    [
      'atmosphere.gradient.cultivate.glow',
      'linear-gradient(135deg, #EB8182 0%, #F5A06F 50%, #EBC573 100%)'
    ],
    [
      'atmosphere.gradient.cultivate.mist',
      'linear-gradient(135deg, #F7CBC7 0%, #FBD1B6 50%, #F1E0B4 100%)'
    ],
    [
      'atmosphere.gradient.diversity.spectrum',
      'linear-gradient(135deg, #89CEF6 0%, #6CD5B3 34%, #EBC573 67%, #EB8182 100%)'
    ]
  ]);
  const approvedPortraits = JSON.parse(
    await readFile(new URL('../data/approved/portrait-assets.json', import.meta.url), 'utf8')
  ).assets;
  const generatedAssets = JSON.parse(
    await readFile(new URL('../data/generated/assets.json', import.meta.url), 'utf8')
  );
  const assetManifest = JSON.parse(
    await readFile(new URL('../docs/assets-manifest.json', import.meta.url), 'utf8')
  ).assets;
  const personIdFromPath = (record) => String(record.publicPath ?? record.path ?? '')
    .match(/public\/assets\/people\/([SPI]\d{4})\.[a-z0-9]+$/i)?.[1] ?? '';
  const recordsForInstruction = (records) => records.filter((record) =>
    record.backgroundEdit?.sourceRef === ownerInstruction
  );
  const sortedPersonIds = (records) => records.map(personIdFromPath).sort();

  const approvedEdits = recordsForInstruction(approvedPortraits);
  const manifestEdits = recordsForInstruction(assetManifest);
  assert.deepEqual(sortedPersonIds(approvedEdits), targetPersonIds);
  assert.deepEqual(sortedPersonIds(manifestEdits), targetPersonIds);
  assert.deepEqual(
    approvedPortraits.filter((record) => record.backgroundEdit).map(personIdFromPath).sort(),
    targetPersonIds
  );
  assert.deepEqual(
    assetManifest.filter((record) => record.backgroundEdit).map(personIdFromPath).sort(),
    targetPersonIds
  );

  const approvedByPersonId = new Map(approvedPortraits.map((record) => [record.personId, record]));
  const generatedByPersonId = new Map(generatedAssets.map((record) => [record.personId, record]));
  const manifestByPersonId = new Map(assetManifest.map((record) => [personIdFromPath(record), record]));
  let diversityCount = 0;
  for (const personId of targetPersonIds) {
    const approved = approvedByPersonId.get(personId);
    const generated = generatedByPersonId.get(personId);
    const manifest = manifestByPersonId.get(personId);
    assert.ok(approved, `Missing approved portrait record for ${personId}`);
    assert.ok(generated, `Missing generated asset record for ${personId}`);
    assert.ok(manifest, `Missing asset-manifest record for ${personId}`);
    assert.deepEqual(manifest.backgroundEdit, approved.backgroundEdit);

    const edit = approved.backgroundEdit;
    assert.equal(edit.method, 'pixel_preserving_foreground_mask_composite');
    assert.equal(edit.requestedAt, '2026-08-25');
    assert.equal(edit.sourceRef, ownerInstruction);
    assert.equal(edit.scope, 'replace_blank_white_background_only');
    assert.equal(edit.foregroundPolicy, 'original_portrait_rgb_preserved_under_foreground_mask');
    assert.equal(edit.surfaceRole, 'product_identity');
    assert.equal(edit.deletionTest, 'improves');
    assert.equal(edit.assignmentPolicy, 'contrast_balanced_visual_variety_not_role_status_or_category_encoding');
    assert.equal(edit.contextPolicy, 'no_environmental_context_present_in_source');
    assert.ok(approvedGradients.has(edit.gradientToken), `Unapproved atmosphere token for ${personId}`);
    assert.equal(edit.gradientCss, approvedGradients.get(edit.gradientToken));
    const edge = edit.edgeRefinement;
    assert.equal(edge.version, 'v2');
    assert.equal(edge.requestedAt, '2026-08-25');
    assert.equal(edge.sourceRef, edgeFollowup);
    assert.equal(edge.scope, 'foreground_mask_boundary_only');
    assert.equal(
      edge.method,
      personId === 'I0018'
        ? 'background_color_fit_with_interior_color_propagation'
        : 'color_aware_soft_matte_projection'
    );
    assert.equal(edge.interiorPolicy, 'original_portrait_interior_preserved_before_jpeg_reencoding_boundary_transition_only');
    assert.equal(edge.gradientPolicy, 'existing_gradient_token_and_css_preserved');
    assert.equal(edge.encodingPolicy, 'existing_jpeg_quality_78_contract_preserved');
    assert.equal(edge.derivedFromSha256, priorHashes.get(personId));
    assert.equal(edge.rightsAndProvenancePolicy, 'unchanged');
    assert.match(manifest.variant, /-edge-refined-v2$/);
    if (edit.gradientToken === 'atmosphere.gradient.diversity.spectrum') diversityCount += 1;

    const image = await readFile(new URL(`../${approved.publicPath}`, import.meta.url));
    const digest = createHash('sha256').update(image).digest('hex');
    assert.equal(approved.bytes, image.byteLength);
    assert.equal(generated.bytes, image.byteLength);
    assert.equal(manifest.bytes, image.byteLength);
    assert.equal(approved.sha256, digest);
    assert.equal(generated.sha256, digest);
    assert.equal(manifest.sha256, digest);
  }
  assert.equal(diversityCount, 1, 'The Diversity atmosphere must appear on exactly one portrait in this edit set');
});

test('source satisfies the integrated data, privacy, asset, naming, and UI contract', async () => {
  assert.equal(REQUIRED_UI_IDS.length, 24);
  const errors = await validateSite();
  assert.deepEqual(errors, [], errors.join('\n'));
});
