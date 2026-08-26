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
  assert.match(thai, /id="footer-meta">ชาวด้อม Landom<\/p>/);
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
  assert.match(english, /id="footer-meta">People of Landom<\/p>/);
  assert.match(english, /"inLanguage": "en"/);
  assert.match(english, /<base href="\.\.\/">/);
  assert.match(english, /href="https:\/\/montri-th\.github\.io\/Landom\/en\/#main-content"/);
  assert.match(english, /<a class="brand" href="https:\/\/montri-th\.github\.io\/Landom\/en\/"/);

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
  assert.match(index, /rel="preload" href="\.\/public\/assets\/fonts\/material-symbols-rounded-open-in-new-300\.woff2" as="font" type="font\/woff2" crossorigin/);
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
  assert.equal(REQUIRED_UI_IDS.length, 15);
  const errors = await validateSite();
  assert.deepEqual(errors, [], errors.join('\n'));
});
