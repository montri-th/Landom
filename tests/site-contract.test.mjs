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
    publicUrl: 'https://www.linkedin.com/in/example/',
    publicationStatus: 'publishable',
    verificationStatus: 'verified',
    consentStatus: 'pending',
    publicationBasis: 'owner_authorized_public_profile_link',
    ownerApproval: { status: 'granted' }
  });
  assert.deepEqual(validateDataContract(data), []);
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
  assert.match(thai, /validLang\(langParam\) \|\| routeLang \|\| validLang\(storedLang\)/);
  assert.match(thai, /validLang\(root\.dataset\.localeRoute\) \|\| validLang\(root\.dataset\.defaultLanguage\) \|\| "th"/);
  assert.doesNotMatch(thai, /<base\b/);

  assert.match(english, /<html[\s\S]*?lang="en"/);
  assert.match(english, /data-locale-route="en"/);
  assert.match(english, /<link rel="canonical" href="https:\/\/montri-th\.github\.io\/Landom\/en\/">/);
  assert.match(english, /<title>Landom — meet the people shaping Landometer<\/title>/);
  assert.match(english, /id="page-title">Not the place,&#10;but the People<\/h1>/);
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
    assert.doesNotMatch(html, /apple-touch-icon|property="og:image"|name="twitter:image"/);
    assert.doesNotMatch(html, /montri-th\.github\.io\/Landom\/th\//);
  }
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

test('the nine owner-requested blank-background portrait edits have deterministic governed metadata and file hashes', async () => {
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
