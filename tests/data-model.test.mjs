import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const generatedPath = path.join(root, 'data/generated/site-data.json');
const rawPath = path.join(root, 'data/raw/google-sheet-snapshot.json');
const schemaPath = path.join(root, 'data/schema/site-data.schema.json');
const profileDetailOverridePath = path.join(root, 'data/approved/profile-detail-overrides.json');
const profileDetailOverrideSchemaPath = path.join(root, 'data/schema/profile-detail-overrides.schema.json');
const personIdentityOverridePath = path.join(root, 'data/approved/person-identity-overrides.json');
const personIdentityOverrideSchemaPath = path.join(root, 'data/schema/person-identity-overrides.schema.json');
const certificateApprovalPath = path.join(root, 'data/approved/certificate-assets.json');
const rawAvailable = fs.existsSync(rawPath);

function loadGenerated() {
  return JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
}

function assertUnique(items, key) {
  const values = items.map((item) => item[key]);
  assert.equal(new Set(values).size, values.length, 'duplicate ' + key);
  assert.ok(values.every(Boolean), 'missing ' + key);
}

test('normalizer is deterministic', { skip: rawAvailable ? false : 'authorized private snapshot is not present' }, () => {
  const before = fs.readFileSync(generatedPath, 'utf8');
  execFileSync(process.execPath, [path.join(root, 'tools/normalize-data.mjs')], { cwd: root });
  const after = fs.readFileSync(generatedPath, 'utf8');
  assert.equal(after, before);
});

test('sheet exporter rewrites legacy person IDs in every exporter-facing cell', { skip: rawAvailable ? false : 'authorized private snapshot is not present' }, () => {
  const output = execFileSync(process.execPath, [path.join(root, 'tools/export-sheet-tabs.mjs')], { cwd: root, encoding: 'utf8' });
  assert.doesNotMatch(output, /LDM-P-/);
  const exported = JSON.parse(output);
  assert.equal(exported.schemaVersion, '3.4.0');
  const peopleTab = exported.tabs.people_registry;
  const personIdIndex = peopleTab.headers.indexOf('person_id');
  const sourceNoteIndex = peopleTab.headers.indexOf('source_note');
  assert.ok(personIdIndex >= 0 && sourceNoteIndex >= 0);
  assert.ok(peopleTab.rows.every((row) => /^[SPI]\d{4}$/.test(row[personIdIndex])));
  assert.ok(peopleTab.rows.every((row) => !String(row[sourceNoteIndex]).includes('LDM-P-')));
  const fullNameEnIndex = peopleTab.headers.indexOf('full_name_en');
  const fullNameThIndex = peopleTab.headers.indexOf('full_name_th');
  const nicknameThIndex = peopleTab.headers.indexOf('nickname_th');
  const identityRows = new Map(peopleTab.rows.map((row) => [row[personIdIndex], row]));
  assert.equal(identityRows.get('I0035')[fullNameEnIndex], 'Passapol Lukthongkum');
  assert.equal(identityRows.get('I0032')[fullNameThIndex], 'ธรรมธร ธนะสมานโชค');
  assert.equal(identityRows.get('I0014')[nicknameThIndex], 'มอส');
  assert.equal(identityRows.get('I0023')[nicknameThIndex], 'ทิม');
  const pattareeyaRow = peopleTab.rows.find((row) => row[personIdIndex] === 'I0041');
  assert.ok(pattareeyaRow, 'missing Pattareeya export row');
  assert.match(pattareeyaRow[sourceNoteIndex], /Pitcha \(I0016\)/);
  assert.doesNotMatch(pattareeyaRow[sourceNoteIndex], /Pitcha \(I0015\)/);
  const currentStatementIndex = peopleTab.headers.indexOf('current_statement_id');
  assert.ok(currentStatementIndex >= 0);
  assert.equal(peopleTab.rows.filter((row) => row[currentStatementIndex]).length, 51);
  const statements = exported.tabs.profile_statements;
  assert.equal(statements.rows.length, 51);
  const statementIdIndex = statements.headers.indexOf('statement_id');
  const statementPersonIndex = statements.headers.indexOf('person_id');
  assertUnique(statements.rows.map((row) => ({ statementId: row[statementIdIndex] })), 'statementId');
  assert.ok(statements.rows.every((row) => /^[SPI]\d{4}$/.test(row[statementPersonIndex])));
  const statementSourceTypeIndex = statements.headers.indexOf('source_type');
  assert.equal(statements.rows.filter((row) => row[statementSourceTypeIndex] === 'first_person_application').length, 25);
  assert.equal(statements.rows.filter((row) => row[statementSourceTypeIndex] === 'factual_fallback').length, 26);
  assert.deepEqual(peopleTab.validations.W, ['owner_authorized_paraphrase_from_first_person_application', 'owner_authorized_synthesis_from_roster_evidence']);
  assert.deepEqual(peopleTab.validations.X, ['first_person_application_exact_roster_match', 'factual_role_education_and_work_evidence']);
  assert.deepEqual(statements.validations.G, ['first_person_application', 'factual_fallback', 'candidate_video_transcript', 'owner_supplied_copy']);
  assert.deepEqual(exported.tabs.engagements.validations.Q, ['cooperative_education', 'internship', 'not_applicable']);
  const engagementHeaders = exported.tabs.engagements.headers;
  const engagementProgramCode = engagementHeaders.indexOf('program_code');
  const engagementContextTh = engagementHeaders.indexOf('education_context_label_th');
  const engagementContextEn = engagementHeaders.indexOf('education_context_label_en');
  assert.ok(engagementContextTh >= 0 && engagementContextEn >= 0);
  const impvestRows = exported.tabs.engagements.rows.filter((row) => row[engagementProgramCode] === 'IMP');
  assert.equal(impvestRows.length, 8);
  assert.ok(impvestRows.every((row) => row[engagementContextTh] === 'ที่ปรึกษาธุรกิจ Impvest จาก'));
  assert.ok(impvestRows.every((row) => row[engagementContextEn] === 'Impvest Consulting Partner from'));
  assert.ok(exported.tabs.engagements.rows.filter((row) => row[engagementProgramCode] !== 'IMP')
    .every((row) => row[engagementContextTh] === '' && row[engagementContextEn] === ''));
  assert.deepEqual(exported.tabs.education.validations.R, ['under_review', 'in_progress', 'completed']);
  for (const header of ['study_start', 'study_end', 'study_current', 'study_period_label_th', 'study_period_label_en']) {
    assert.ok(exported.tabs.education.headers.includes(header), `missing education export column ${header}`);
  }
  const educationPersonIndex = exported.tabs.education.headers.indexOf('person_id');
  const teamEducation = exported.tabs.education.rows.find((row) => row[educationPersonIndex] === 'I0033');
  assert.equal(teamEducation[exported.tabs.education.headers.indexOf('study_start')], '2022');
  assert.equal(teamEducation[exported.tabs.education.headers.indexOf('study_end')], '');
  assert.equal(teamEducation[exported.tabs.education.headers.indexOf('study_current')], true);
  assert.equal(teamEducation[exported.tabs.education.headers.indexOf('study_period_label_en')], '2022–Present');
  const isPrimaryIndex = exported.tabs.education.headers.indexOf('is_primary');
  const qaExpectedIndex = exported.tabs.qa.headers.indexOf('expected');
  assert.equal(typeof exported.tabs.education.rows[0][isPrimaryIndex], 'boolean');
  assert.equal(typeof exported.tabs.qa.rows[0][qaExpectedIndex], 'number');
  assert.deepEqual(exported.tabs.social_profiles.validations.G, ['owner_review_required', 'verified', 'rejected', 'missing']);
  assert.deepEqual(exported.tabs.institutions.validations.I, ['verified_official_page', 'not_found_exact_official_page']);
  assert.deepEqual(exported.tabs.programs.validations.J, ['verified_official_page', 'not_found_exact_official_page']);
  assert.deepEqual(exported.tabs.assets.validations.I, ['owner_review_required', 'verified', 'rejected', 'missing']);
  assert.deepEqual(exported.tabs.assets.validations.K, ['cleared', 'pending', 'denied', 'revoked']);
  assert.deepEqual(exported.tabs.assets.validations.L, ['individual_consent', 'owner_authorized_public_profile_portrait']);
  assert.deepEqual(exported.tabs.assets.validations.Q, ['publishable', 'withheld_pending_rights_consent_and_verification', 'withdrawn']);
  assert.deepEqual(exported.tabs.social_profiles.validations.I, ['individual_consent', 'owner_authorized_public_profile_link']);
  assert.deepEqual(exported.tabs.external_publications.validations.N, ['owner_supplied_with_bibliographic_match']);
  assert.deepEqual(exported.tabs.external_publications.validations.O, ['owner_authorized_external_publication_link']);
  const qaMetricIndex = exported.tabs.qa.headers.indexOf('metric');
  const qaFormulaIndex = exported.tabs.qa.headers.indexOf('formula_value');
  const portraitQa = exported.tabs.qa.rows.find((row) => row[qaMetricIndex] === 'publishable_portraits');
  assert.match(portraitQa[qaFormulaIndex], /"publishable"/);
  const readmeTopicIndex = exported.tabs.README.headers.indexOf('topic');
  const readmeDetailIndex = exported.tabs.README.headers.indexOf('detail');
  const datasetNameRow = exported.tabs.README.rows.find((row) => row[readmeTopicIndex] === 'ชื่อชุดข้อมูล');
  assert.match(datasetNameRow[readmeDetailIndex], /v3\.4 \(25 Aug 2026\)/);
  assert.doesNotMatch(datasetNameRow[readmeDetailIndex], /v3\.3/);
  const bioRow = exported.tabs.README.rows.find((row) => row[readmeTopicIndex] === 'bio');
  assert.match(bioRow[readmeDetailIndex], /private recruitment\/application Sheet ID\/range/);
  const backupRow = exported.tabs.README.rows.find((row) => row[readmeTopicIndex] === 'backup');
  assert.match(backupRow[readmeDetailIndex], /private operations artifact/);
  assert.doesNotMatch(backupRow[readmeDetailIndex], /Google Sheet ID/i);
});

test('normalized Sheet roundtrip preserves private social and asset candidates without public leakage', { skip: rawAvailable ? false : 'authorized private snapshot is not present' }, () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'landom-normalized-roundtrip-'));
  try {
    const workbook = JSON.parse(execFileSync(process.execPath, [path.join(root, 'tools/export-sheet-tabs.mjs')], { cwd: root, encoding: 'utf8' }));
    const social = workbook.tabs.social_profiles;
    const socialId = social.headers.indexOf('social_profile_id');
    const socialCandidate = social.headers.indexOf('candidate_url_or_handle');
    const socialCandidateStatus = social.headers.indexOf('candidate_status');
    const socialVerification = social.headers.indexOf('verification_status');
    const socialConsent = social.headers.indexOf('consent_status');
    const socialPublicUrl = social.headers.indexOf('public_url');
    const socialPublication = social.headers.indexOf('publication_status');
    const socialSourceNote = social.headers.indexOf('source_note');
    const retainedSheetFacebookIds = [
      'SOC-I0011-FACEBOOK',
      'SOC-S0004-FACEBOOK',
      'SOC-I0034-FACEBOOK',
      'SOC-S0005-FACEBOOK',
      'SOC-S0006-FACEBOOK',
      'SOC-S0007-FACEBOOK'
    ];
    const retainedSheetFacebookPrefix = 'https://sheet-only.invalid/facebook-profile-';
    for (const [index, socialProfileId] of retainedSheetFacebookIds.entries()) {
      const facebookRow = social.rows.find((row) => row[socialId] === socialProfileId);
      assert.ok(facebookRow, `missing normalized Sheet row ${socialProfileId}`);
      facebookRow[socialPublicUrl] = retainedSheetFacebookPrefix + String(index + 1).padStart(2, '0');
    }
    const allInstagramRows = social.rows.filter((row) => String(row[socialId]).endsWith('-INSTAGRAM'));
    const targetInstagram = allInstagramRows.find((row) => row[socialId] === 'SOC-I0001-INSTAGRAM');
    const instagramRows = [targetInstagram, ...allInstagramRows.filter((row) => row !== targetInstagram)].slice(0, 12);
    assert.equal(instagramRows.length, 12);
    instagramRows.forEach((instagram, index) => {
      instagram[socialCandidate] = 'private_ig_candidate_roundtrip_' + String(index + 1).padStart(2, '0');
      instagram[socialCandidateStatus] = 'candidate_present';
      instagram[socialVerification] = 'owner_review_required';
      instagram[socialConsent] = 'pending';
      instagram[socialPublication] = 'withheld_pending_consent';
      instagram[socialSourceNote] = 'Private identity evidence roundtrip ' + String(index + 1).padStart(2, '0');
    });

    const assets = workbook.tabs.assets;
    const assetId = assets.headers.indexOf('asset_id');
    const assetSource = assets.headers.indexOf('source_url');
    const assetCandidateStatus = assets.headers.indexOf('candidate_status');
    const assetVerification = assets.headers.indexOf('verification_status');
    const assetPermission = assets.headers.indexOf('permission_record_id');
    const portrait = assets.rows.find((row) => row[assetId] === 'PORTRAIT-I0001');
    portrait[assetSource] = 'https://private.example/portrait-candidate.jpg';
    portrait[assetCandidateStatus] = 'candidate_present';
    portrait[assetVerification] = 'owner_review_required';
    portrait[assetPermission] = 'PRIVATE-PERMISSION-PENDING';

    const statements = workbook.tabs.profile_statements;
    const statementId = statements.headers.indexOf('statement_id');
    const statementTh = statements.headers.indexOf('text_th');
    const fazeStatement = statements.rows.find((row) => row[statementId] === 'STAT-I0015-001');
    fazeStatement[statementTh] = 'ข้อความตั้งต้นที่แก้ผ่าน normalized Sheet roundtrip';

    const snapshotPath = path.join(tempRoot, 'normalized-snapshot.json');
    const outputDir = path.join(tempRoot, 'generated');
    fs.writeFileSync(snapshotPath, JSON.stringify(workbook));
    execFileSync(process.execPath, [path.join(root, 'tools/normalize-data.mjs'), '--input', snapshotPath, '--output-dir', outputDir], { cwd: root });
    const imported = JSON.parse(fs.readFileSync(path.join(outputDir, 'site-data.json'), 'utf8'));
    const baseline = loadGenerated();
    assert.equal(imported.meta.source.inputSchema, 'normalized_sheet_v3_4');
    for (const dimension of ['people', 'engagements', 'institutions', 'programs', 'educationRecords', 'works', 'contributions', 'achievements', 'publications', 'socialProfiles', 'assets', 'certificates']) {
      assert.equal(imported[dimension].length, baseline[dimension].length, 'roundtrip changed ' + dimension + ' row count');
    }
    const importedInstagram = imported.socialProfiles.find((row) => row.socialProfileId === 'SOC-I0001-INSTAGRAM');
    const importedPortrait = imported.assets.find((row) => row.assetId === 'PORTRAIT-I0001');
    assert.equal(imported.people.find((person) => person.personId === 'I0015').bio.th, 'ข้อความตั้งต้นที่แก้ผ่าน normalized Sheet roundtrip');
    assert.equal(imported.people.find((person) => person.personId === 'I0015').bio.sourceType, 'first_person_application');
    assert.equal(imported.people.find((person) => person.personId === 'I0001').bio.sourceType, 'factual_fallback');
    assert.equal(imported.people.find((person) => person.personId === 'I0001').bio.derivationMethod, 'bounded_inference');
    assert.equal(importedInstagram.candidateStatus, 'candidate_present');
    assert.equal(imported.socialProfiles.filter((row) => row.platform === 'instagram' && row.candidateStatus === 'candidate_present').length, 12);
    assert.equal(importedInstagram.publicUrl, null);
    assert.equal(importedPortrait.candidateStatus, 'candidate_present');
    assert.equal(importedPortrait.publicPath, null);
    assert.equal(importedPortrait.sourceUrl, null);
    assert.equal(imported.socialProfiles.filter((row) => row.platform === 'linkedin' && row.publicUrl).length, 49);
    assert.equal(imported.socialProfiles.filter((row) => row.platform === 'github' && row.publicUrl).length, 23);
    assert.equal(imported.socialProfiles.filter((row) => row.platform === 'facebook' && row.publicUrl).length, 0);
    assert.equal(imported.meta.counts.publishedPublicSocialProfiles, 72);
    assert.ok(imported.socialProfiles.filter((row) => row.publicUrl).every((row) =>
      ['linkedin', 'github'].includes(row.platform)
    ));
    assert.ok(imported.socialProfiles.filter((row) => row.publicUrl).every((row) =>
      row.publicationBasis === 'owner_authorized_public_profile_link' && row.ownerApproval?.status === 'granted'
    ));
    assert.equal(
      imported.assets.filter((row) => row.publicPath).length,
      baseline.assets.filter((row) => row.publicPath).length - 1,
      'withholding the I0001 portrait should remove exactly one public asset during roundtrip'
    );
    assert.ok(imported.assets.filter((row) => row.publicPath).every((row) =>
      row.publicationBasis === 'owner_authorized_public_profile_portrait' && row.ownerApproval?.status === 'granted'
    ));
    assert.doesNotMatch(JSON.stringify(imported), /private_ig_candidate_roundtrip|Private identity evidence roundtrip|private\.example|PRIVATE-PERMISSION-PENDING/);

    const socialRoundtrip = JSON.parse(execFileSync(process.execPath, [path.join(root, 'tools/export-sheet-tabs.mjs'), '--snapshot', snapshotPath, '--site-data', path.join(outputDir, 'site-data.json'), 'social_profiles'], { cwd: root, encoding: 'utf8' }));
    const socialRoundtripTab = socialRoundtrip.tabs.social_profiles;
    const roundtripInstagram = socialRoundtripTab.rows.find((row) => row[socialRoundtripTab.headers.indexOf('social_profile_id')] === 'SOC-I0001-INSTAGRAM');
    assert.equal(roundtripInstagram[socialRoundtripTab.headers.indexOf('candidate_url_or_handle')], 'private_ig_candidate_roundtrip_01');
    assert.equal(roundtripInstagram[socialRoundtripTab.headers.indexOf('source_note')], 'Private identity evidence roundtrip 01');
    assert.equal(socialRoundtripTab.rows.filter((row) => String(row[socialRoundtripTab.headers.indexOf('candidate_url_or_handle')]).startsWith('private_ig_candidate_roundtrip_')).length, 12);
    assert.equal(socialRoundtripTab.rows.filter((row) => String(row[socialRoundtripTab.headers.indexOf('source_note')]).startsWith('Private identity evidence roundtrip ')).length, 12);
    const roundtripFacebookUrls = retainedSheetFacebookIds.map((socialProfileId) => {
      const row = socialRoundtripTab.rows.find((candidate) => candidate[socialRoundtripTab.headers.indexOf('social_profile_id')] === socialProfileId);
      return row?.[socialRoundtripTab.headers.indexOf('public_url')];
    });
    assert.equal(roundtripFacebookUrls.length, 6);
    assert.ok(roundtripFacebookUrls.every((url) => String(url).startsWith(retainedSheetFacebookPrefix)));

    const assetRoundtrip = JSON.parse(execFileSync(process.execPath, [path.join(root, 'tools/export-sheet-tabs.mjs'), '--snapshot', snapshotPath, '--site-data', path.join(outputDir, 'site-data.json'), 'assets'], { cwd: root, encoding: 'utf8' }));
    const assetRoundtripTab = assetRoundtrip.tabs.assets;
    const roundtripPortrait = assetRoundtripTab.rows.find((row) => row[assetRoundtripTab.headers.indexOf('asset_id')] === 'PORTRAIT-I0001');
    assert.equal(roundtripPortrait[assetRoundtripTab.headers.indexOf('source_url')], 'https://private.example/portrait-candidate.jpg');
    assert.equal(roundtripPortrait[assetRoundtripTab.headers.indexOf('permission_record_id')], 'PRIVATE-PERMISSION-PENDING');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('schema and all generated dimensions are valid JSON', () => {
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(schemaPath, 'utf8')));
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(profileDetailOverrideSchemaPath, 'utf8')));
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(personIdentityOverrideSchemaPath, 'utf8')));
  const detailOverrides = JSON.parse(fs.readFileSync(profileDetailOverridePath, 'utf8'));
  const identityOverrides = JSON.parse(fs.readFileSync(personIdentityOverridePath, 'utf8'));
  assert.equal(identityOverrides.contractVersion, '1.0');
  assertUnique(identityOverrides.overrides.map((override) => ({ personId: override.personId })), 'personId');
  assert.equal(detailOverrides.contractVersion, '1.2');
  assert.ok(detailOverrides.addedEngagements.every((engagement) => /^[SPI]\d{4}$/.test(engagement.personId)));
  assert.ok(detailOverrides.addedEngagements.every((engagement) => /^E\d{4}$/.test(engagement.engagementId)));
  for (const fileName of fs.readdirSync(path.join(root, 'data/generated')).filter((name) => name.endsWith('.json'))) {
    assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'data/generated', fileName), 'utf8')), fileName);
  }
});

test('verified English full names and exact Thai nicknames override stale registry cells without guessing', () => {
  const data = loadGenerated();
  const peopleById = new Map(data.people.map((person) => [person.personId, person]));
  assert.equal(peopleById.get('I0035').names.full.en, 'Passapol Lukthongkum');
  assert.equal(peopleById.get('I0037').names.full.en, 'Nathanicha Sornbundit');
  assert.equal(peopleById.get('I0038').names.full.en, null);
  assert.equal(peopleById.get('I0032').names.full.th, 'ธรรมธร ธนะสมานโชค');
  assert.deepEqual(
    Object.fromEntries(['I0014', 'I0018', 'I0019', 'I0020', 'I0021', 'I0023', 'I0025'].map((personId) => [personId, peopleById.get(personId).names.nickname.th])),
    {
      I0014: 'มอส',
      I0018: 'เกรซ',
      I0019: 'เจมี่',
      I0020: 'เตี๊ยม',
      I0021: 'เพลง',
      I0023: 'ทิม',
      I0025: 'แป้ง'
    }
  );
  assert.ok(data.people.every((person) => person.names.card.th === person.names.nickname.th || !person.names.nickname.th));
});

test('person IDs have one frozen canonical version', () => {
  const data = loadGenerated();
  assert.equal(data.people.length, 51);
  assertUnique(data.people, 'personId');
  assert.deepEqual(data.people.filter((person) => person.migrationClassification === 'full_time').map((person) => person.personId), ['S0001', 'S0002', 'S0003', 'S0004', 'S0005', 'S0006', 'S0007']);
  assert.deepEqual(data.people.filter((person) => person.migrationClassification === 'part_time').map((person) => person.personId), ['P0001']);
  assert.equal(data.people.filter((person) => person.migrationClassification === 'intern_or_program_participant').length, 43);
  assert.ok(data.people.every((person) => /^[SPI]\d{4}$/.test(person.personId)));
  assert.ok(data.people.every((person) => person.canonicalIdPolicy.frozenAcrossFutureRoleChanges === true));
  const serialized = JSON.stringify(data);
  assert.doesNotMatch(serialized, /person_id_v1/i);
  assert.doesNotMatch(serialized, /LDM-P-/);
});

test('current staff, completed Team internship and owner-supplied work updates remain exact', () => {
  const data = loadGenerated();
  const people = new Map(data.people.map((person) => [person.personId, person]));
  const engagements = new Map(data.engagements.map((engagement) => [engagement.engagementId, engagement]));
  const contributionWorkIds = (personId) => data.contributions
    .filter((contribution) => contribution.personId === personId)
    .map((contribution) => contribution.workId)
    .sort();

  assert.deepEqual(
    ['S0005', 'S0006', 'S0007'].map((personId) => ({
      personId,
      fullTh: people.get(personId).names.full.th,
      fullEn: people.get(personId).names.full.en,
      nicknameTh: people.get(personId).names.nickname.th,
      nicknameEn: people.get(personId).names.nickname.en,
      firstJoined: people.get(personId).firstJoined,
      currentStatus: people.get(personId).currentStatus
    })),
    [
      { personId: 'S0005', fullTh: 'วชิรพงศ์ ลอยฟ้าขจร', fullEn: 'Wachirapong Loyfakajon', nicknameTh: 'บิว', nicknameEn: 'Biw', firstJoined: '2019', currentStatus: 'active' },
      { personId: 'S0006', fullTh: 'ณัฐ พิทักษ์อำนวย', fullEn: 'Nat Pitakamnuay', nicknameTh: 'นัท', nicknameEn: 'Nat', firstJoined: '2018', currentStatus: 'active' },
      { personId: 'S0007', fullTh: 'กนกศิลป์ จินดาดวงรัตน์', fullEn: 'Kanoksilp Jindadoungrut', nicknameTh: 'โปเต้', nicknameEn: 'Pote', firstJoined: '2018', currentStatus: 'active' }
    ]
  );

  assert.deepEqual(contributionWorkIds('S0005'), [
    'work-citymeter-buildings',
    'work-citymeter-factories',
    'work-citymeter-fire-monitoring',
    'work-citymeter-healthcare-unresolved',
    'work-citymeter-population',
    'work-department-water-resources',
    'work-dwr-telemetry',
    'work-land-portfolio'
  ]);
  assert.deepEqual(contributionWorkIds('S0006'), [
    'work-citymeter-buildings',
    'work-citymeter-population',
    'work-dwr-telemetry',
    'work-land-portfolio'
  ]);
  assert.deepEqual(contributionWorkIds('S0007'), ['work-citymeter-buildings', 'work-citymeter-population']);
  assert.deepEqual(engagements.get('E0061').responsibilityWorkIds.sort(), contributionWorkIds('S0005'));
  assert.deepEqual(engagements.get('E0062').responsibilityWorkIds.sort(), contributionWorkIds('S0006'));
  assert.deepEqual(engagements.get('E0063').responsibilityWorkIds.sort(), contributionWorkIds('S0007'));
  assert.deepEqual(
    ['E0061', 'E0062', 'E0063'].map((engagementId) => engagements.get(engagementId).roleTitle),
    [
      { th: 'Software Programmer', en: 'Software Programmer' },
      { th: 'Assistant Manager', en: 'Assistant Manager' },
      { th: 'Software Developer', en: 'Software Developer' }
    ]
  );

  const team = engagements.get('E0043');
  assert.deepEqual({ personId: team.personId, end: team.end, status: team.status }, { personId: 'I0033', end: '2026-07-31', status: 'completed' });
  assert.equal(people.get('I0033').currentStatus, 'alumni');

  const hasContribution = (personId, workId, roleEn = null) => data.contributions.some((contribution) =>
    contribution.personId === personId && contribution.workId === workId && (!roleEn || contribution.role.en === roleEn)
  );
  assert.ok(hasContribution('I0034', 'work-citymeter-flood-forecasting-unresolved', 'Software development'));
  assert.ok(hasContribution('I0034', 'work-citymeter-housing-estates', 'Software development'));
  for (const workId of ['work-citymeter-condo-appraisal', 'work-citymeter-business-dynamics', 'work-citymeter-restaurants']) {
    assert.ok(hasContribution('S0001', workId));
  }
  assert.ok(hasContribution('I0032', 'work-dwr-flood-map', 'Software development'));
  assert.ok(hasContribution('S0003', 'work-citymeter-rugon', 'Product management'));
  assert.ok(hasContribution('I0030', 'work-citymeter-disaster-historical-impacts', 'Software development'));
  assert.ok(hasContribution('I0003', 'work-citymeter-hat-yai-flood-2025-11', 'Software development'));
  assert.ok(hasContribution('S0002', 'work-citymeter-quakesafe-unresolved', 'Product development'));
  assert.ok(hasContribution('S0001', 'work-citymeter-quakesafe-unresolved', 'Software development'));
});

test('verified external publication evidence remains separate from Landometer works and contributions', () => {
  const data = loadGenerated();
  assert.deepEqual(data.publications, [{
    publicationId: 'PUB0001',
    personId: 'S0007',
    title: {
      th: 'Neural Learning With Recoil Behavior in Hyperellipsoidal Structure',
      en: 'Neural Learning With Recoil Behavior in Hyperellipsoidal Structure'
    },
    outlet: 'IEEE Access',
    volume: '8',
    year: 2020,
    doi: '10.1109/ACCESS.2020.3003531',
    publicUrl: 'https://doi.org/10.1109/ACCESS.2020.3003531',
    ownerEvidenceUrl: 'https://scispace.com/pdf/neural-learning-with-recoil-behavior-in-hyperellipsoidal-1iasnp6d0w.pdf',
    bibliographicUrl: 'https://dblp.org/rec/journals/access/JindadoungrutPL20',
    relationship: 'coauthor',
    scope: 'external_publication_not_landometer_contribution',
    verificationStatus: 'owner_supplied_with_bibliographic_match',
    publicationBasis: 'owner_authorized_external_publication_link',
    evidenceNote: data.publications[0].evidenceNote
  }]);
  assert.match(data.publications[0].evidenceNote, /never projected as a Landometer work or contribution/);
  assert.ok(data.works.every((work) => work.workId !== 'PUB0001'));
  assert.ok(data.contributions.every((contribution) => contribution.workId !== 'PUB0001'));
  assert.match(data.meta.evidenceBoundary.externalPublications, /separate evidence dimension/);
});

test('all dimension IDs are unique and foreign keys have no orphans', () => {
  const data = loadGenerated();
  for (const [dimension, key] of [
    ['institutions', 'institutionId'],
    ['programs', 'programId'],
    ['educationRecords', 'educationRecordId'],
    ['engagements', 'engagementId'],
    ['works', 'workId'],
    ['contributions', 'contributionId'],
    ['achievements', 'achievementId'],
    ['publications', 'publicationId'],
    ['socialProfiles', 'socialProfileId'],
    ['assets', 'assetId'],
    ['certificates', 'certificateId']
  ]) assertUnique(data[dimension], key);

  const personIds = new Set(data.people.map((item) => item.personId));
  const engagementIds = new Set(data.engagements.map((item) => item.engagementId));
  const workIds = new Set(data.works.map((item) => item.workId));
  const institutionIds = new Set(data.institutions.map((item) => item.institutionId));
  const programIds = new Set(data.programs.map((item) => item.programId));

  assert.ok(data.engagements.every((item) => personIds.has(item.personId)));
  assert.ok(data.engagements.flatMap((item) => item.responsibilityWorkIds).every((workId) => workIds.has(workId)));
  assert.ok(data.educationRecords.every((item) => personIds.has(item.personId) && institutionIds.has(item.institutionId) && (item.programId === null || programIds.has(item.programId))));
  assert.ok(data.contributions.every((item) => personIds.has(item.personId) && workIds.has(item.workId) && (item.engagementId === null || engagementIds.has(item.engagementId))));
  assert.ok(data.achievements.every((item) => item.recipientPersonIds.every((personId) => personIds.has(personId)) && (item.workId === null || workIds.has(item.workId))));
  assert.ok(data.publications.every((item) => personIds.has(item.personId)));
  assert.ok(data.socialProfiles.every((item) => personIds.has(item.personId)));
  assert.ok(data.assets.every((item) => personIds.has(item.personId)));
  assert.ok(data.certificates.every((item) => personIds.has(item.personId) && item.workIds.every((workId) => workIds.has(workId))));
});

test('every person has at least one contribution without invented fallback projects', () => {
  const data = loadGenerated();
  const counts = new Map(data.people.map((person) => [person.personId, 0]));
  for (const contribution of data.contributions) counts.set(contribution.personId, counts.get(contribution.personId) + 1);
  assert.ok([...counts.values()].every((count) => count >= 1));

  const placeholderWork = data.works.find((work) => work.workId === 'work-contribution-details-pending');
  assert.equal(placeholderWork.type, 'administrative_placeholder');
  const placeholders = data.contributions.filter((item) => item.workId === placeholderWork.workId);
  assert.ok(placeholders.every((item) => item.evidenceStatus === 'owner_detail_required'));
});

test('Oat has one person record and the required three-part role history', () => {
  const data = loadGenerated();
  const oatRecords = data.people.filter((person) => person.personId === 'S0001');
  assert.equal(oatRecords.length, 1);
  assert.equal(oatRecords[0].names.nickname.th, 'โอ๊ต');

  const history = data.engagements.filter((item) => item.personId === 'S0001');
  assert.deepEqual(history.map((item) => item.category), ['internship', 'part_time', 'full_time']);
  assert.deepEqual(history.map((item) => item.sequenceHint), [1, 2, 3]);

  const oatContributions = data.contributions.filter((item) => item.personId === 'S0001');
  const school = oatContributions.filter((item) => item.workId === 'work-citymeter-schools');
  const landPortfolio = oatContributions.filter((item) => item.workId === 'work-land-portfolio');
  const lead2Loan = oatContributions.filter((item) => item.workId === 'work-lead2loan');
  assert.equal(school.length, 1);
  assert.equal(landPortfolio.length, 2);
  assert.equal(new Set(landPortfolio.map((item) => item.engagementId)).size, 2);
  assert.equal(lead2Loan.length, 1);
  assert.notEqual(landPortfolio[0].workId, lead2Loan[0].workId);
});

test('repeat participants retain one complete record per join period for UI chips', () => {
  const data = loadGenerated();
  const histories = new Map();
  for (const engagement of data.engagements) {
    const records = histories.get(engagement.personId) || [];
    records.push(engagement);
    histories.set(engagement.personId, records);
  }
  const repeated = [...histories.entries()]
    .filter(([, records]) => records.length > 1)
    .sort(([a], [b]) => a.localeCompare(b, 'en'));
  assert.deepEqual(
    repeated.map(([personId, records]) => [personId, records.length]),
    [
      ['I0003', 2], ['I0014', 2], ['I0015', 2], ['I0018', 2], ['I0022', 2],
      ['I0024', 2], ['I0029', 2], ['S0001', 3], ['S0002', 2], ['S0003', 3]
    ]
  );
  for (const [personId, records] of repeated) {
    assert.equal(new Set(records.map((engagement) => engagement.engagementId)).size, records.length, `${personId} repeats an engagementId`);
    assert.ok(records.every((engagement) =>
      engagement.category && engagement.academicPlacementType &&
      engagement.program?.code && engagement.program?.names?.th && engagement.program?.names?.en
    ), `${personId} has an engagement that cannot produce a bilingual chip`);
    assert.ok(records.every((engagement) =>
      engagement.cohortLabel || engagement.start || engagement.end || engagement.status === 'ongoing' || engagement.sequenceHint
    ), `${personId} has an engagement without a period discriminator`);
  }
});

test('Grace MSI 2025 uses the reconciled cohort range before her PDI return', () => {
  const data = loadGenerated();
  const msi = data.engagements.find((item) => item.engagementId === 'E0022');
  assert.equal(msi.personId, 'I0018');
  assert.equal(msi.program.code, 'MSI');
  assert.equal(msi.start, '2025-05-19');
  assert.equal(msi.end, '2025-07-31');
  assert.ok(msi.start <= msi.end);
  assert.equal(msi.verificationStatus, 'owner_source_reconciled');
});

test('Hack Land Value achievement is separate from contribution records', () => {
  const data = loadGenerated();
  const achievement = data.achievements.find((item) => item.achievementId === 'A0001');
  assert.deepEqual(achievement.recipientPersonIds, ['S0001', 'P0001', 'I0016']);
  assert.equal(achievement.workId, 'work-citycell-model');
  assert.match(achievement.title.en, /Winner/);
});

test('education uses normalized dimensions, appropriate display modes and preserves unresolved conflicts', () => {
  const data = loadGenerated();
  assert.ok(data.institutions.every((item) => item.names.th.formal && item.names.th.short && item.names.en.formal && item.names.en.short));
  assert.ok(data.programs.every((item) => item.names.th.formal && item.names.th.short && item.names.en.formal && item.names.en.short));
  assert.ok(data.people.filter((person) => person.migrationClassification === 'full_time').every((person) => person.educationDisplayMode === 'qualification'));
  assert.ok(data.people.filter((person) => person.migrationClassification === 'intern_or_program_participant').every((person) => person.educationDisplayMode === 'program'));
  assert.equal(data.people.find((person) => person.personId === 'P0001').educationDisplayMode, 'qualification');
  for (const personId of ['I0037', 'I0038']) {
    const record = data.educationRecords.find((item) => item.personId === personId);
    assert.equal(record.institutionId, 'inst-chula');
    assert.equal(record.programId, 'program-cu-cedt');
    assert.equal(record.verificationStatus, 'source_conflict_unresolved');
  }
});

test('only exact official institution and program LinkedIn pages enter the public model', () => {
  const data = loadGenerated();
  const expectedInstitutionUrls = new Map([
    ['inst-kmitl', 'https://www.linkedin.com/school/king-mongkut%27s-institute-of-technology-ladkrabang/'],
    ['inst-chula', 'https://www.linkedin.com/school/chulalongkornuniversity/'],
    ['inst-thammasat', 'https://www.linkedin.com/school/thammasatuniversity/'],
    ['inst-kaist', 'https://www.linkedin.com/company/kaist/'],
    ['inst-uq', 'https://www.linkedin.com/school/university-of-queensland/'],
    ['inst-mahidol', 'https://www.linkedin.com/school/mahidoluniversity/'],
    ['inst-southampton', 'https://www.linkedin.com/school/university-of-southampton/'],
    ['inst-ucl', 'https://www.linkedin.com/school/university-college-london/']
  ]);
  for (const institution of data.institutions) {
    const expectedUrl = expectedInstitutionUrls.get(institution.institutionId) ?? null;
    assert.equal(institution.linkedinUrl, expectedUrl);
    assert.equal(
      institution.linkedinVerificationStatus,
      expectedUrl ? 'verified_official_page' : 'not_found_exact_official_page'
    );
  }
  assert.equal(data.institutions.find((item) => item.institutionId === 'inst-nmu').linkedinUrl, null);
  const expectedProgramUrls = new Map([
    ['program-mahidol-faculty-ict', 'https://www.linkedin.com/company/muict']
  ]);
  for (const program of data.programs) {
    const expectedUrl = expectedProgramUrls.get(program.programId) ?? null;
    assert.equal(program.linkedinUrl, expectedUrl);
    assert.equal(
      program.linkedinVerificationStatus,
      expectedUrl ? 'verified_official_page' : 'not_found_exact_official_page'
    );
  }
  assert.equal(data.meta.counts.verifiedInstitutionLinkedInProfiles, 8);
  assert.equal(data.meta.counts.verifiedProgramLinkedInProfiles, 1);
});

test('all core people receive provenance-distinct owner-authorized source-backed placeholder bios', () => {
  const data = loadGenerated();
  const firstPersonIds = [
    'I0003', 'I0004', 'I0013', 'I0014', 'I0015', 'I0016', 'I0017', 'I0018',
    'I0022', 'I0024', 'I0026', 'I0027', 'I0028', 'I0029', 'I0030', 'I0031',
    'I0032', 'I0033', 'I0040', 'I0041', 'I0042', 'I0043', 'S0002', 'S0003', 'S0004'
  ];
  const factualFallbackIds = [
    'I0001', 'I0002', 'I0005', 'I0006', 'I0007', 'I0008', 'I0009', 'I0010',
    'I0011', 'I0012', 'I0019', 'I0020', 'I0021', 'I0023', 'I0025', 'I0034',
    'I0035', 'I0036', 'I0037', 'I0038', 'I0039', 'P0001', 'S0001', 'S0005', 'S0006', 'S0007'
  ];
  const sourceBacked = data.people.filter((person) => person.bio.status === 'source_backed_placeholder');
  assert.equal(sourceBacked.length, 51);
  assert.ok(sourceBacked.every((person) => person.bio.th && person.bio.en));
  assert.ok(sourceBacked.every((person) =>
    person.bio.verificationStatus === 'owner_authorized_placeholder' &&
    person.bio.reviewStatus === 'pending_candidate_video_review' &&
    person.bio.ownerApproval?.status === 'granted' &&
    person.bio.ownerApproval?.scope === 'source_backed_placeholder_profile_copy'
  ));

  const firstPerson = sourceBacked.filter((person) => person.bio.sourceType === 'first_person_application');
  assert.deepEqual(firstPerson.map((person) => person.personId).sort(), firstPersonIds);
  assert.ok(firstPerson.every((person) =>
    person.bio.publicationBasis === 'owner_authorized_paraphrase_from_first_person_application' &&
    person.bio.sourceBasis === 'first_person_application_exact_roster_match' &&
    person.bio.sourceRef === 'authorized_application_roster_match_2025_2026' &&
    person.bio.authorRole === 'profile_subject' &&
    person.bio.derivationMethod === 'concise_paraphrase' &&
    person.bio.evidenceScope === 'personal_objective_and_self_described_work_style' &&
    person.bio.evidenceConfidence === 'exact_roster_match'
  ));

  const factualFallback = sourceBacked.filter((person) => person.bio.sourceType === 'factual_fallback');
  assert.deepEqual(factualFallback.map((person) => person.personId).sort(), factualFallbackIds);
  const existingFactualFallback = factualFallback.filter((person) => !['S0005', 'S0006', 'S0007'].includes(person.personId));
  assert.ok(existingFactualFallback.every((person) =>
    person.bio.publicationBasis === 'owner_authorized_synthesis_from_roster_evidence' &&
    person.bio.sourceBasis === 'factual_role_education_and_work_evidence' &&
    person.bio.sourceRef === 'alumni_sheet_and_registry_reconciliation_2026-08-23' &&
    person.bio.authorRole === 'assistant_paraphrase_from_owner_and_sheet_records' &&
    person.bio.derivationMethod === 'bounded_inference' &&
    person.bio.evidenceScope === 'interest_and_work_style_from_role_education_and_verified_work' &&
    ['medium_high', 'medium', 'medium_low'].includes(person.bio.evidenceConfidence)
  ));
  const newStaffFactualFallback = factualFallback.filter((person) => ['S0005', 'S0006', 'S0007'].includes(person.personId));
  assert.ok(newStaffFactualFallback.every((person) =>
    person.bio.publicationBasis === 'owner_authorized_synthesis_from_roster_evidence' &&
    person.bio.sourceBasis === 'factual_role_education_and_work_evidence' &&
    person.bio.sourceRef === 'owner_instruction_2026-08-24' &&
    person.bio.authorRole === 'assistant_paraphrase_from_owner_and_sheet_records' &&
    person.bio.derivationMethod === 'bounded_inference' &&
    person.bio.evidenceScope === 'owner_supplied_role_tenure_and_verified_work' &&
    person.bio.evidenceConfidence === 'medium_high'
  ));
  assert.match(data.people.find((person) => person.personId === 'I0015').bio.th, /ความคิดเห็นของผู้ใช้/);
  assert.doesNotMatch(data.people.find((person) => person.personId === 'I0028').bio.th, /พลังบวก/);
  assert.equal(data.meta.counts.sourceBackedProfilePlaceholders, 51);
  assert.equal(data.meta.counts.ownerPendingProfiles, 0);
  assert.equal(data.meta.counts.firstPersonProfilePlaceholders, 25);
  assert.equal(data.meta.counts.factualFallbackProfilePlaceholders, 26);
});

test('cooperative education is limited to the exact owner-confirmed public core set', () => {
  const data = loadGenerated();
  const cooperativeEducation = data.engagements.filter((engagement) => engagement.academicPlacementType === 'cooperative_education');
  assert.deepEqual(
    cooperativeEducation.map((engagement) => engagement.personId).sort(),
    ['I0003', 'I0030', 'I0031', 'I0034', 'I0036', 'I0039']
  );
  assert.ok(cooperativeEducation.every((engagement) => engagement.category === 'internship'));
  assert.ok(data.engagements.filter((engagement) => engagement.category === 'internship').every((engagement) =>
    ['cooperative_education', 'internship'].includes(engagement.academicPlacementType)
  ));
  assert.ok(data.engagements.filter((engagement) => engagement.category !== 'internship').every((engagement) =>
    engagement.academicPlacementType === 'not_applicable'
  ));
  const tan = data.engagements.find((engagement) => engagement.personId === 'I0035' && engagement.category === 'internship');
  assert.equal(tan.academicPlacementType, 'internship');
  assert.doesNotMatch(tan.cohortLabel, /co-?op|สหกิจ/i);
  assert.equal(data.meta.counts.cooperativeEducationPeople, 6);
  assert.equal(data.people.length, 51);
});

test('FDI and computer-engineering display labels use the approved exact copy', () => {
  const data = loadGenerated();
  const fdi = data.engagements.filter((engagement) => engagement.program.code === 'FDI');
  assert.ok(fdi.length > 0);
  assert.ok(fdi.every((engagement) => engagement.program.names.th === 'Full-stack Developer Intern, FDI'));
  assert.ok(fdi.every((engagement) => engagement.program.names.en === 'Full-stack Developer Intern, FDI'));
  for (const programId of ['program-kmitl-computer-engineering', 'program-cu-computer-engineering']) {
    assert.equal(data.programs.find((program) => program.programId === programId).names.th.short, 'วิศวกรรมคอมพิวเตอร์');
    assert.equal(data.programs.find((program) => program.programId === programId).names.en.short, 'CP');
  }
  assert.doesNotMatch(JSON.stringify(data), /C[P]E/);
});

test('owner-approved detail refinements preserve identity while adding complete role histories', () => {
  const data = loadGenerated();
  const history = (personId) => data.engagements.filter((engagement) => engagement.personId === personId);
  assert.deepEqual(history('I0003').map((engagement) => engagement.category), ['internship', 'part_time']);
  assert.deepEqual(history('I0014').map((engagement) => engagement.category), ['internship', 'part_time']);
  assert.deepEqual(history('I0015').map((engagement) => engagement.category), ['internship', 'part_time']);
  assert.deepEqual(history('S0003').map((engagement) => engagement.category), ['internship', 'part_time', 'full_time']);
  assert.deepEqual(history('I0018').map((engagement) => engagement.program.code), ['MSI', 'PDI']);
  assert.deepEqual(history('I0029').map((engagement) => engagement.program.code), ['IMP', 'MSI']);
  assert.equal(history('I0029')[0].evidenceNote.includes('retain canonical registry spelling'), true);
  assert.equal(data.people.find((person) => person.personId === 'I0014').migrationClassification, 'intern_or_program_participant');
  assert.equal(data.people.find((person) => person.personId === 'S0003').personId, 'S0003');
});

test('education detail refinements distinguish BBA Finance, EBA and Ming card copy without flattening official detail', () => {
  const data = loadGenerated();
  for (const personId of ['I0022', 'I0025']) {
    const person = data.people.find((item) => item.personId === personId);
    assert.equal(person.educationDisplay.card.en, 'BBA Finance · CU');
    assert.match(person.educationDisplay.detail.en, /^Bachelor of Business Administration in Finance/);
  }
  for (const personId of ['I0020', 'I0021', 'I0023', 'I0024']) {
    const record = data.educationRecords.find((item) => item.personId === personId && item.isPrimary);
    assert.equal(record.programId, 'program-cu-eba');
    assert.equal(data.people.find((item) => item.personId === personId).educationDisplay.card.en, 'EBA · CU');
  }
  const ming = data.people.find((person) => person.personId === 'I0004');
  assert.deepEqual(ming.educationDisplay.card, { th: 'อักษร จุฬา', en: 'Arts · CU' });
  assert.equal(ming.educationDisplay.detail.en, 'Chinese, Faculty of Arts — Chulalongkorn University');
});

test('program-specific contribution roles and exact owner-supplied works replace generic contributor copy', () => {
  const data = loadGenerated();
  const engagementById = new Map(data.engagements.map((engagement) => [engagement.engagementId, engagement]));
  const expectedRoleByProgram = new Map([
    ['FDI', { th: 'Software development', en: 'Software development' }],
    ['PDI', { th: 'Product development', en: 'Product development' }],
    ['MSI', { th: 'Go-to-market', en: 'Go-to-market' }],
    ['IMP', { th: 'ที่ปรึกษาธุรกิจ', en: 'Consulting Partner' }]
  ]);
  const exactRoleOverrides = new Map([
    ['S0002|work-citymeter-quakesafe-unresolved', 'Product development'],
    ['S0001|work-citymeter-quakesafe-unresolved', 'Software development']
  ]);
  for (const contribution of data.contributions) {
    if (contribution.workId === 'work-citycell-model') continue;
    if (exactRoleOverrides.has(`${contribution.personId}|${contribution.workId}`)) {
      const role = exactRoleOverrides.get(`${contribution.personId}|${contribution.workId}`);
      assert.deepEqual(contribution.role, { th: role, en: role });
      continue;
    }
    const programCode = engagementById.get(contribution.engagementId)?.program.code;
    if (!expectedRoleByProgram.has(programCode)) continue;
    assert.deepEqual(contribution.role, expectedRoleByProgram.get(programCode));
  }

  const cityCell = data.works.find((work) => work.workId === 'work-citycell-model');
  assert.ok(data.contributions.every((item) => item.role.th !== 'ผู้มีส่วนร่วม' && item.role.en !== 'Contributor'));
  assert.equal(cityCell.names.en, 'CityCell: Machine learning model for nationwide land appraisal');
  assert.ok(data.contributions.filter((item) => item.workId === cityCell.workId).every((item) => item.role.en === 'Team member'));
  assert.ok(data.contributions.some((item) => item.personId === 'S0003' && item.workId === 'work-citymeter-rugon' && item.role.en === 'Product management'));
  assert.ok(data.contributions.some((item) => item.personId === 'I0014' && item.workId === 'work-ijji' && item.engagementId === 'E0057'));
  assert.ok(data.contributions.some((item) => item.personId === 'I0009' && item.workId === 'work-gistda-flood-near-me' && item.role.en === 'Software development'));
  assert.ok(data.contributions.some((item) => item.personId === 'I0029' && item.workId === 'work-ijji' && item.engagementId === 'E0060' && item.role.en === 'Consulting Partner'));
});

test('internship timeline copy is English in both locales and raw availability notes are not public', () => {
  const data = loadGenerated();
  const internshipCodes = new Set(['FDI', 'MSI', 'PDI', 'PMI']);
  const internshipEngagements = data.engagements.filter((engagement) => internshipCodes.has(engagement.program.code));
  assert.ok(internshipEngagements.every((engagement) => engagement.program.names.th === engagement.program.names.en));
  assert.ok(internshipEngagements.every((engagement) => engagement.roleTitle.th === engagement.roleTitle.en));
  assert.ok(data.engagements.every((engagement) => !/เริ่มได้|\bstart\b|\d{1,2}[A-Za-z]{3}\s*[-–]\s*\d{1,2}[A-Za-z]{3}/i.test(engagement.cohortLabel ?? '')));
});

test('the existing 48 bio objects remain byte-equivalent to the v3.3 approved release baseline', () => {
  const stableSort = (value) => Array.isArray(value)
    ? value.map(stableSort)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableSort(value[key])]))
      : value;
  const newPersonIds = new Set(['S0005', 'S0006', 'S0007']);
  const projection = loadGenerated().people
    .filter((person) => !newPersonIds.has(person.personId))
    .map((person) => ({ personId: person.personId, bio: person.bio }));
  const digest = createHash('sha256').update(JSON.stringify(stableSort(projection))).digest('hex');
  assert.equal(digest, 'bbed839fd986c9c0e28f7562fec707df0e1a3a1410b9248200c75c5fd0420f71');
});

test('degree programs separate completed staff awards from a current participant study record', () => {
  const data = loadGenerated();
  const primaryEducation = (personId) => data.educationRecords.find((record) => record.personId === personId && record.isPrimary);
  const oat = primaryEducation('S0001').degree;
  assert.equal(oat.abbreviation.en, 'B.Eng.');
  assert.equal(oat.field.en, 'Computer Engineering');
  assert.equal(oat.awardStatus, 'completed');
  assert.equal(oat.personalAwardVerified, true);

  const renee = primaryEducation('S0002').degree;
  assert.deepEqual(renee.abbreviation, { th: 'นศ.บ.', en: 'B.A.' });
  assert.equal(renee.title.en, 'Bachelor of Arts (Communication Arts)');
  assert.equal(renee.field.en, 'Public Relations');
  assert.equal(renee.awardStatus, 'completed');
  assert.equal(renee.personalAwardVerified, true);
  assert.match(renee.programEvidenceUrl, /^https:\/\/www\.commarts\.chula\.ac\.th\//);

  const pat = primaryEducation('S0003').degree;
  assert.deepEqual(pat.abbreviation, { th: 'วศ.บ.', en: 'B.Eng.' });
  assert.equal(pat.field.en, 'Computer Engineering');
  assert.equal(pat.awardStatus, 'completed');
  assert.equal(pat.personalAwardVerified, true);
  assert.match(pat.programEvidenceUrl, /^https:\/\/www\.ce\.kmitl\.ac\.th\//);

  const film = primaryEducation('S0004').degree;
  assert.deepEqual(film.abbreviation, { th: 'ศศ.บ.', en: 'B.A.' });
  assert.equal(film.field.en, 'Urban Administration and Management');
  assert.equal(film.awardStatus, 'completed');
  assert.equal(film.personalAwardVerified, true);
  assert.match(film.programEvidenceUrl, /^https:\/\/imd\.nmu\.ac\.th\//);

  const team = primaryEducation('I0033');
  assert.equal(team.programId, 'program-kmitl-iot-system-information-engineering');
  assert.equal(team.degree.abbreviation.en, 'B.Eng.');
  assert.equal(team.degree.field.en, 'IoT System and Information Engineering');
  assert.equal(team.degree.awardStatus, 'in_progress');
  assert.equal(team.degree.personalAwardVerified, false);
  assert.deepEqual(team.studyPeriod, {
    start: '2022',
    end: null,
    current: true,
    label: { th: '2022–ปัจจุบัน', en: '2022–Present' }
  });
  assert.equal(data.people.find((person) => person.personId === 'I0033').educationDisplay.card.en, 'IoT & IE · KMITL');
  assert.match(data.people.find((person) => person.personId === 'I0033').educationDisplay.detail.en, /^IoT System and Information Engineering/);

  assert.equal(data.educationRecords.filter((record) => record.degree !== null).length, 8);
  assert.equal(data.educationRecords.filter((record) => record.personId.startsWith('S') && record.degree?.awardStatus === 'completed' && record.degree?.personalAwardVerified).length, 6);
  assert.equal(data.educationRecords.filter((record) => ['S', 'P'].includes(record.personId.charAt(0)) && record.degree?.awardStatus === 'completed' && record.degree?.personalAwardVerified).length, 7);
  assert.equal(data.meta.counts.verifiedCompletedStaffDegrees, 7);
  assert.ok(['S0001', 'S0002', 'S0003', 'S0004', 'S0006'].every((personId) =>
    primaryEducation(personId).degree.evidenceScope === 'owner_confirmed_completed_degree_with_official_program_definition'
  ));
  assert.equal(primaryEducation('S0007').degree.evidenceScope, 'owner_confirmed_completed_degree_with_publication_author_biography');
  assert.match(data.people.find((person) => person.personId === 'S0003').educationDisplay.card.en, /B\.Eng\., Computer Engineering/);
  const biw = data.people.find((item) => item.personId === 'S0005');
  assert.equal(primaryEducation('S0005'), undefined);
  assert.equal(biw.educationDisplay.verificationStatus, 'owner_detail_required');
  assert.deepEqual(biw.educationDisplay.card, { th: null, en: null });
  assert.deepEqual(biw.educationDisplay.detail, { th: null, en: null });
});

test('CityMETER works use release-aligned canonical mappings without promoting unresolved names', () => {
  const data = loadGenerated();
  const expected = new Map([
    ['work-citymeter-companies', 'dataset-registered-companies-status-capital'],
    ['work-citymeter-hotels', 'dataset-hotel-market'],
    ['work-citymeter-factories', 'dataset-factories-workers-investment'],
    ['work-citymeter-schools', 'dataset-schools-students-teachers'],
    ['work-citymeter-crop-area-output', 'dataset-crop-area-output'],
    ['work-citymeter-buildings', 'dataset-buildings'],
    ['work-citymeter-population', 'dataset-population-age-sex'],
    ['work-citymeter-housing-estates', 'dataset-registered-housing-estates'],
    ['work-citymeter-condo-appraisal', 'dataset-condo-appraisal'],
    ['work-citymeter-business-dynamics', 'dataset-business-dynamics'],
    ['work-citymeter-restaurants', 'dataset-restaurants'],
    ['work-citymeter-fire-monitoring', 'dataset-fire-monitoring'],
    ['work-citymeter-flood-forecasting-unresolved', 'dataset-flood-forecast-flash-flood-risk'],
    ['work-dwr-flood-map', 'dataset-flood-forecast-depth'],
    ['work-citymeter-rugon', 'dataset-earthquake-sensors'],
    ['work-citymeter-disaster-historical-impacts', 'dataset-disaster-historical-impacts'],
    ['work-citymeter-hat-yai-flood-2025-11', 'dataset-events-hat-yai-flood-2025-11'],
    ['work-citymeter-quakesafe-unresolved', 'dataset-events-quake-building-inspection']
  ]);
  for (const [workId, slug] of expected) assert.equal(data.works.find((work) => work.workId === workId).moduleSlug, slug);
  for (const [, slug] of expected) {
    const matches = data.works.filter((work) => work.moduleSlug === slug);
    assert.equal(matches.length, 1, `expected one canonical work for ${slug}`);
    assert.equal(matches[0].authorityStatus, 'aligned_to_citymeter_current_release');
  }
  const shopping = data.works.find((work) => work.workId === 'work-citymeter-shopping-centers');
  assert.doesNotMatch(shopping.names.en, /venues/i);
  const companies = data.works.find((work) => work.workId === 'work-citymeter-companies');
  assert.equal(companies.catalogUrl.th, 'https://montri-th.github.io/CityMETER/?lang=th#dataset-registered-companies-status-capital');
  assert.equal(companies.catalogUrl.en, 'https://montri-th.github.io/CityMETER/en/?lang=en#dataset-registered-companies-status-capital');
  assert.equal(companies.destinationUrl, null);
  assert.equal(companies.linkEvidence.linkScope, 'exact_module');
  const cityCell = data.works.find((work) => work.workId === 'work-citycell-model');
  assert.equal(cityCell.catalogUrl.th, null);
  assert.equal(cityCell.linkEvidence.linkScope, 'evidence_only');
  assert.match(cityCell.linkEvidence.evidenceUrl, /TREASURYTHAI/);
  const contentCompass = data.works.find((work) => work.workId === 'work-content-compass');
  assert.deepEqual(contentCompass.catalogUrl, { th: null, en: null });
  assert.equal(contentCompass.linkEvidence.linkScope, 'unverified_no_link');
});

test('private contact values and unapproved social/portrait candidates do not leak', () => {
  const data = loadGenerated();
  const serialized = JSON.stringify(data);
  assert.doesNotMatch(serialized, /contacts_internal/);
  assert.doesNotMatch(serialized, /docs\.google\.com\/spreadsheets\/d\//);
  assert.doesNotMatch(serialized, /(?:2025|2026)![A-Z]+\d+(?::[A-Z]+\d+)?/);
  assert.ok(data.people.every((person) => !/https?:\/\/|@|(?:2025|2026)![A-Z]+\d+|[A-Z]+\d+:[A-Z]+\d+/i.test(person.bio.sourceRef ?? '')));
  const emittedKeys = new Set();
  const collectKeys = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      emittedKeys.add(key.toLowerCase());
      collectKeys(child);
    }
  };
  collectKeys(data);
  for (const forbiddenKey of ['email', 'phone', 'line_id', 'discord', 'cv_file_ids', 'reviewer_note', 'raw_answer']) {
    assert.ok(!emittedKeys.has(forbiddenKey), 'private field emitted: ' + forbiddenKey);
  }
  if (rawAvailable) {
    const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
    const contacts = raw.sheets.contacts_internal;
    const sensitiveIndexes = contacts[0]
      .map((name, index) => ({ name, index }))
      .filter(({ name }) => ['email', 'phone', 'line_id', 'discord', 'instagram', 'facebook', 'tiktok', 'cv_file_ids'].includes(name))
      .map(({ index }) => index);
    const sensitiveValues = contacts.slice(1)
      .flatMap((row) => sensitiveIndexes.map((index) => String(row[index] || '').trim()))
      .filter((value) => value.length >= 6);
    const authorizedPublicUrls = data.socialProfiles
      .filter((profile) => profile.publicationStatus === 'publishable')
      .map((profile) => profile.publicUrl)
      .filter(Boolean);
    for (const value of sensitiveValues) {
      const reusedByApprovedPublicProfile = authorizedPublicUrls.some((url) => url.includes(value));
      if (!reusedByApprovedPublicProfile) assert.ok(!serialized.includes(value), 'private value leaked');
    }
  }

  assert.ok(data.socialProfiles.every((profile) => profile.publicUrl === null || (
    profile.verificationStatus === 'verified' && profile.publicationStatus === 'publishable' && (
      profile.consentStatus === 'granted' || (
        profile.publicationBasis === 'owner_authorized_public_profile_link' && profile.ownerApproval?.status === 'granted'
      )
    )
  )));
  assert.ok(data.assets.every((asset) => asset.publicPath === null || (
    asset.verificationStatus === 'verified' && asset.rightsStatus === 'cleared' && asset.publicationStatus === 'publishable' && (
      asset.consentStatus === 'granted' || (
        asset.publicationBasis === 'owner_authorized_public_profile_portrait' && asset.ownerApproval?.status === 'granted'
      )
    )
  )));
});

test('only exact owner-authorized public profiles and governed local portraits are emitted', () => {
  const data = loadGenerated();
  assert.equal(
    data.meta.evidenceBoundary.socialAndPortraits,
    'Only LinkedIn and GitHub public profile links may enter the web projection after exact identity verification under either recorded individual consent or the owner-authorized public-link basis. Other platform candidates remain private and are not emitted to the web. A portrait may be published only after exact identity verification, cleared publication rights and either recorded individual consent or the owner-authorized public-portrait basis. Neither owner-authorized basis is individual consent.'
  );
  const linkedIn = data.socialProfiles.filter((profile) => profile.platform === 'linkedin' && profile.publicUrl);
  const github = data.socialProfiles.filter((profile) => profile.platform === 'github' && profile.publicUrl);
  const facebook = data.socialProfiles.filter((profile) => profile.platform === 'facebook' && profile.publicUrl);
  assert.equal(linkedIn.length, 49);
  assert.equal(github.length, 23);
  assert.equal(facebook.length, 0);
  assert.equal(data.meta.counts.publishedPublicSocialProfiles, 72);
  assert.ok(data.socialProfiles.filter((profile) => profile.publicUrl).every((profile) =>
    ['linkedin', 'github'].includes(profile.platform)
  ));
  assert.deepEqual(
    github
      .filter((profile) => ['S0003', 'I0011', 'I0015', 'I0035', 'I0036', 'I0037', 'I0038', 'I0043'].includes(profile.personId))
      .map((profile) => ({ personId: profile.personId, publicUrl: profile.publicUrl })),
    [
      { personId: 'S0003', publicUrl: 'https://github.com/24thofmayy' },
      { personId: 'I0011', publicUrl: 'https://github.com/kharutta' },
      { personId: 'I0015', publicUrl: 'https://github.com/PwFaze' },
      { personId: 'I0035', publicUrl: 'https://github.com/TanPassapol' },
      { personId: 'I0036', publicUrl: 'https://github.com/Poomrapee-chsk' },
      { personId: 'I0037', publicUrl: 'https://github.com/nicha-natthanicha' },
      { personId: 'I0038', publicUrl: 'https://github.com/NorraphatR' },
      { personId: 'I0043', publicUrl: 'https://github.com/Drf-Chsrphbl' }
    ]
  );
  assert.deepEqual(
    linkedIn
      .filter((profile) => ['S0005', 'S0006', 'S0007'].includes(profile.personId))
      .map((profile) => ({ personId: profile.personId, publicUrl: profile.publicUrl })),
    [
      { personId: 'S0005', publicUrl: 'https://www.linkedin.com/in/wachirapong-loyfakajon-1b260b221/' },
      { personId: 'S0006', publicUrl: 'https://www.linkedin.com/in/nat-pitakamnuay-43127080/' },
      { personId: 'S0007', publicUrl: 'https://www.linkedin.com/in/kanoksilp-jindadoungrut-841a67224/' }
    ]
  );
  for (const profile of [...linkedIn, ...github]) {
    assert.equal(profile.verificationStatus, 'verified');
    assert.equal(profile.consentStatus, 'pending');
    assert.equal(profile.publicationBasis, 'owner_authorized_public_profile_link');
    assert.equal(profile.ownerApproval.status, 'granted');
    assert.equal(profile.ownerApproval.scope, 'public_profile_link_only');
  }

  const portraits = data.assets.filter((asset) => asset.publicPath);
  assert.equal(portraits.length, 46);
  for (const portrait of portraits) {
    assert.match(portrait.publicPath, /^public\/assets\/people\/[SPI]\d{4}\.jpg$/);
    assert.equal(portrait.sourceUrl, null);
    assert.equal(portrait.consentStatus, 'pending');
    assert.equal(portrait.publicationBasis, 'owner_authorized_public_profile_portrait');
    assert.equal(portrait.ownerApproval.status, 'granted');
    assert.equal(portrait.rightsStatus, 'cleared');
    assert.match(portrait.sha256, /^[a-f0-9]{64}$/);
    assert.ok(fs.existsSync(path.join(root, portrait.publicPath)));
  }
  assert.deepEqual(
    portraits
      .filter((portrait) => ['I0032', 'I0034', 'I0039'].includes(portrait.personId))
      .sort((a, b) => a.personId.localeCompare(b.personId))
      .map((portrait) => ({ personId: portrait.personId, bytes: portrait.bytes, sha256: portrait.sha256 })),
    [
      { personId: 'I0032', bytes: 113777, sha256: 'ff9a8b34126e5bb8780bf0bdf67baac3cff39bda5d6765d8efbaa26a2780a180' },
      { personId: 'I0034', bytes: 131923, sha256: 'a6309a173e1daf119b4b83db7b6773639a3b6e8c2abcba97d9bf825996337746' },
      { personId: 'I0039', bytes: 90264, sha256: 'e4e163a8e3b9d833cd57c339f5117fa5dab9af965735b45fadd58c8672170506' }
    ]
  );
});

test('26 filled certificates are copied byte-for-byte and exposed only through the governed owner-authorized contract', () => {
  const data = loadGenerated();
  const inventory = JSON.parse(fs.readFileSync(certificateApprovalPath, 'utf8'));
  assert.equal(inventory.certificates.length, 26);
  assert.deepEqual(
    inventory.excludedSourceFiles,
    [{ sourceFile: 'Internship Certificate 250731 - FDI Template for Automate.PNG', reason: 'unfilled_automation_template' }]
  );
  assert.equal(data.certificates.length, 26);
  assert.equal(data.meta.counts.certificates, 26);
  assert.equal(fs.readdirSync(path.join(root, 'public/assets/certificates')).filter((name) => name.endsWith('.png')).length, 26);

  const roleByProgram = new Map([
    ['FDI', 'Software development'],
    ['PDI', 'Product development'],
    ['MSI', 'Go-to-market'],
    ['IMP', 'Consulting Partner']
  ]);
  assert.deepEqual(
    Object.fromEntries(['FDI', 'PDI', 'MSI', 'IMP'].map((code) => [code, data.certificates.filter((certificate) => certificate.programCode === code).length])),
    { FDI: 12, PDI: 1, MSI: 5, IMP: 8 }
  );
  for (const certificate of data.certificates) {
    assert.equal(certificate.verificationStatus, 'verified');
    assert.equal(certificate.publicationStatus, 'publishable');
    assert.equal(certificate.rightsStatus, 'cleared');
    assert.equal(certificate.consentStatus, 'pending');
    assert.equal(certificate.publicationBasis, 'owner_authorized_public_certificate');
    assert.deepEqual(certificate.ownerApproval, {
      status: 'granted',
      approvedAt: '2026-08-24',
      scope: 'public_certificate_image_and_printed_profile_facts',
      sourceRef: 'owner_instruction_2026-08-24'
    });
    assert.deepEqual(certificate.roleLabel, {
      th: roleByProgram.get(certificate.programCode),
      en: roleByProgram.get(certificate.programCode)
    });
    assert.match(certificate.publicPath, /^public\/assets\/certificates\/[SPI]\d{4}-[A-Z0-9]+\.png$/);
    assert.match(certificate.downloadFilename, /^landometer-certificate-[SPI]\d{4}-[A-Z0-9]+\.png$/);
    assert.equal(certificate.mimeType, 'image/png');
    assert.equal(certificate.evidenceBoundary, 'printed_certificate_facts_only_qr_destinations_excluded');
    const bytes = fs.readFileSync(path.join(root, certificate.publicPath));
    assert.equal(bytes.byteLength, certificate.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), certificate.sha256);
    assert.ok(
      certificate.workIds.every((workId) => data.contributions.some((contribution) =>
        contribution.personId === certificate.personId && contribution.workId === workId
      )),
      `${certificate.certificateId} must not introduce a work claim that is absent from the governed profile`
    );
  }

  const credentialCollisions = data.certificates.filter((certificate) => certificate.credentialId === 'IMP25007');
  assert.deepEqual(credentialCollisions.map((certificate) => certificate.personId).sort(), ['I0025', 'I0029']);
  assert.ok(credentialCollisions.every((certificate) => certificate.credentialIdCollisionStatus === 'duplicate_in_printed_source'));
  const dada = data.certificates.find((certificate) => certificate.personId === 'I0029');
  assert.equal(dada.nameSpellingStatus, 'owner_review_required');
  assert.equal(data.people.find((person) => person.personId === 'I0029').names.full.en, 'Panida Chantacharoonpong');
  const hana = data.certificates.find((certificate) => certificate.personId === 'I0026');
  assert.equal(hana.awardedOn, '2025-11-13');
  assert.equal(hana.dateEvidenceStatus, 'printed_date_conflicts_with_program_code');
  assert.match(hana.evidenceNotes.join(' '), /must not be used to infer a 2026 engagement timeline/);
  const grace = data.certificates.find((certificate) => certificate.personId === 'I0018');
  assert.equal(grace.programCode, 'MSI');
  assert.equal(grace.awardedOn, '2025-07-31');

  const serialized = JSON.stringify(data.certificates);
  assert.doesNotMatch(serialized, /sourceFile|sourcePath|sourceUrl|qrUrl|qrTargets|Try CityMETER|Try SafeStreet/i);
});

test('brand and community copy uses the owner-approved distinction', () => {
  const data = loadGenerated();
  assert.equal(data.copy.brand.brandName, 'Landometer');
  assert.equal(data.copy.brand.communityName, 'Landom');
  assert.equal(data.copy.brand.tagline.th, 'แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น');
  assert.equal(data.copy.brand.status, 'owner_approved_current_truth');
});
