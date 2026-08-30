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
  assert.match(english, /id="footer-meta"[^>]*>People of Landom<\/p>/);
  assert.match(english, /"inLanguage": "en"/);
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
  assert.equal(index.split(`href="${joinTeamUrl}"`).length - 1, 3);
  assert.match(index, /id="menu-toggle"[\s\S]*?aria-haspopup="dialog"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="site-menu"/);
  assert.match(index, /id="site-menu" role="dialog" aria-modal="true"[^>]*tabindex="-1"/);
  assert.match(index, /<a href="#people" data-menu-close>/);
  assert.match(index, /data-scrollspy-link="people"/);
  assert.doesNotMatch(index, /href="#certificates"/);

  assert.match(app, /import \{ initSiteNavigation \} from "\.\/navigation\.js";/);
  assert.match(app, /initSiteNavigation\(\);/);
  assert.match(navigation, /event\.key === 'Escape'/);
  assert.match(navigation, /event\.key !== 'Tab'/);
  assert.match(navigation, /toggle\.setAttribute\('aria-expanded'/);
  assert.match(navigation, /toggle\.focus\(\{ preventScroll: true \}\)/);
  assert.match(navigation, /url\.origin === here\.origin[\s\S]*?url\.pathname === here\.pathname[\s\S]*?url\.search === here\.search/);
  assert.match(navigation, /document\.getElementById\(decodeURIComponent\(url\.hash\.slice\(1\)\)\)/);
  assert.match(navigation, /setMenuOpen\(false, \{ returnFocus: !destination \}\)/);
  assert.match(navigation, /element\.getClientRects\(\)\.length > 0/);
  assert.match(navigation, /root\.classList\.add\('navigation-enhanced'\)/);
  assert.match(navigation, /window\.addEventListener\('pageshow'/);
  assert.match(navigation, /root\.dataset\.navState = 'calm'/);
  assert.match(navigation, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.menu-toggle\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s);
  assert.match(styles, /\.site-header\.is-calm\s*\{/);
  assert.match(styles, /html\.navigation-enhanced \.navigation-fallback\s*\{[^}]*display:\s*none;/s);
  assert.match(styles, /scroll-margin-top:\s*calc\(var\(--site-header-height-prominent\)/);
  assert.match(styles, /:root\[data-nav-state="calm"\]/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?--site-header-height:\s*var\(--site-header-height-prominent\)/s);
});

test('the unified navigation icon subset is exact, self-hosted, licensed, and preloaded', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const font = await readFile(new URL('../public/assets/fonts/material-symbols-rounded-nav-300.woff2', import.meta.url));
  const fontManifest = JSON.parse(await readFile(new URL('../public/assets/fonts/font-assets.manifest.json', import.meta.url), 'utf8'));
  const fontRecord = fontManifest.faces.find((record) => record.file === 'material-symbols-rounded-nav-300.woff2');

  assert.match(index, /rel="preload" href="\.\/public\/assets\/fonts\/material-symbols-rounded-nav-300\.woff2" as="font" type="font\/woff2" crossorigin/);
  assert.match(styles, /@font-face\s*\{[^}]*font-family:\s*"Material Symbols Rounded Nav";[^}]*material-symbols-rounded-nav-300\.woff2[^}]*font-weight:\s*300;/s);
  assert.match(styles, /\.icon-symbol\s*\{[^}]*font-family:\s*"Material Symbols Rounded Nav";[^}]*font-variation-settings:\s*"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;/s);
  assert.equal(font.byteLength, 2500);
  assert.equal(createHash('sha256').update(font).digest('hex'), 'd7e283106ed2898726b24504c4e0f5ad524292984a90a4d29553c7dcf53b9657');
  assert.equal(fontRecord?.family, 'Material Symbols Rounded Nav');
  assert.equal(fontRecord?.subset, 'unified-nav-7');
  assert.equal(fontRecord?.axesLock, 'FILL 0, wght 300, GRAD 0, opsz 24');
  assert.deepEqual(fontRecord?.glyphs, ['open_in_new', 'menu', 'close', 'light_mode', 'dark_mode', 'contrast', 'groups']);
  assert.equal(fontRecord?.approvalAuthority, 'Owner-approved Landom-local alignment');
  assert.equal(fontRecord?.designSystemStatus, 'Candidate local extension; not a normative Design System release');
  assert.equal(fontRecord?.license, 'Apache License 2.0');
  assert.match(fontManifest.authorityScope, /owner-approved Landom-local addition/i);
  assert.match(fontManifest.authorityScope, /does not publish or upgrade a normative Design System release/i);
  assert.doesNotMatch(styles, /font-variation-settings:\s*"FILL" 1/);
});

test('Pages attestation binds cache-busted live bytes to this workflow build manifest', async () => {
  const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /outputs:\s*\n\s+manifest_sha256: \$\{\{ steps\.build_manifest\.outputs\.sha256 \}\}/);
  assert.match(workflow, /EXPECTED_MANIFEST_SHA256: \$\{\{ needs\.build\.outputs\.manifest_sha256 \}\}/);
  assert.match(workflow, /RELEASE_SHA: \$\{\{ github\.sha \}\}/);
  assert.match(workflow, /cache_bust="release=\$RELEASE_SHA"/);
  assert.match(workflow, /actual_manifest_sha256=.*sha256sum \/tmp\/landom-build-manifest\.json/);
  assert.match(workflow, /"\$actual_manifest_sha256" = "\$EXPECTED_MANIFEST_SHA256"/);
});

test('approach motion is opt-in, once-only, fail-open, and safe across lifecycle edges', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const motion = await readFile(new URL('../src/approach-motion.js', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(index, /"IntersectionObserver" in window[\s\S]*?prefers-reduced-motion: reduce[\s\S]*?matchMedia\("print"\)[\s\S]*?root\.classList\.add\("lds-motion-pending"\)/);
  assert.match(index, /data-approach="section_opener"/);
  assert.equal((index.match(/data-approach="paired_inline"/g) ?? []).length, 2);
  assert.match(index, /data-approach-sequence/);
  assert.match(app, /import \{ initApproachMotion \} from "\.\/approach-motion\.js";/);
  assert.match(app, /initApproachMotion\(\);/);

  for (const contract of [
    'threshold: 0.14',
    'rootMargin: "0px 0px -12% 0px"',
    'const INIT_WATCHDOG_MS = 2400',
    'const STAGGER_STEP_MS = 150',
    'const STAGGER_CAP_MS = 450',
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
  assert.match(styles, /html\.lds-motion-ready \[data-approach\]\.is-lds-reveal-armed/);
  assert.doesNotMatch(styles, /html\.lds-motion-pending \[data-approach\]/);
  assert.match(styles, /--motion-ease-settle:\s*cubic-bezier\(0\.2, 0\.9, 0\.25, 1\.08\)/);
  assert.match(styles, /\.is-lds-reveal-armed\.is-lds-revealed\.is-lds-reveal-arriving\s*\{[\s\S]*?opacity var\(--motion-duration-approach-opacity\)[\s\S]*?transform var\(--motion-duration-approach-transform\)/s);
  assert.match(styles, /\.is-lds-reveal-armed\s*\{[^}]*transition:\s*none;/s);
  assert.match(styles, /translate3d\(0, 32px, 0\) scale\(0\.985\)/);
  assert.match(styles, /data-approach-from="inline-start"[\s\S]*?translate3d\(-36px, 0, 0\)/);
  assert.match(styles, /data-approach-from="inline-end"[\s\S]*?translate3d\(36px, 0, 0\)/);
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
  assert.equal(REQUIRED_UI_IDS.length, 23);
  const errors = await validateSite();
  assert.deepEqual(errors, [], errors.join('\n'));
});
