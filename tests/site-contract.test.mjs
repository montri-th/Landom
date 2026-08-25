import assert from 'node:assert/strict';
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
  assert.match(thai, /id="page-title">คนที่ร่วมสร้าง Landometer<\/h1>/);
  assert.match(thai, /id="footer-meta">ชาวด้อม Landom<\/p>/);
  assert.match(thai, /validLang\(langParam\) \|\| routeLang \|\| validLang\(storedLang\)/);
  assert.match(thai, /validLang\(root\.dataset\.localeRoute\) \|\| validLang\(root\.dataset\.defaultLanguage\) \|\| "th"/);
  assert.doesNotMatch(thai, /<base\b/);

  assert.match(english, /<html[\s\S]*?lang="en"/);
  assert.match(english, /data-locale-route="en"/);
  assert.match(english, /<link rel="canonical" href="https:\/\/montri-th\.github\.io\/Landom\/en\/">/);
  assert.match(english, /<title>Landom — meet the people shaping Landometer<\/title>/);
  assert.match(english, /id="page-title">Meet the people shaping Landometer<\/h1>/);
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

test('source satisfies the integrated data, privacy, asset, naming, and UI contract', async () => {
  assert.equal(REQUIRED_UI_IDS.length, 15);
  const errors = await validateSite();
  assert.deepEqual(errors, [], errors.join('\n'));
});
