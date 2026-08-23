import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
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
  const peopleTab = exported.tabs.people_registry;
  const personIdIndex = peopleTab.headers.indexOf('person_id');
  const sourceNoteIndex = peopleTab.headers.indexOf('source_note');
  assert.ok(personIdIndex >= 0 && sourceNoteIndex >= 0);
  assert.ok(peopleTab.rows.every((row) => /^[SPI]\d{4}$/.test(row[personIdIndex])));
  assert.ok(peopleTab.rows.every((row) => !String(row[sourceNoteIndex]).includes('LDM-P-')));
  const pattareeyaRow = peopleTab.rows.find((row) => row[personIdIndex] === 'I0041');
  assert.ok(pattareeyaRow, 'missing Pattareeya export row');
  assert.match(pattareeyaRow[sourceNoteIndex], /Pitcha \(I0016\)/);
  assert.doesNotMatch(pattareeyaRow[sourceNoteIndex], /Pitcha \(I0015\)/);
  const isPrimaryIndex = exported.tabs.education.headers.indexOf('is_primary');
  const qaExpectedIndex = exported.tabs.qa.headers.indexOf('expected');
  assert.equal(typeof exported.tabs.education.rows[0][isPrimaryIndex], 'boolean');
  assert.equal(typeof exported.tabs.qa.rows[0][qaExpectedIndex], 'number');
  assert.deepEqual(exported.tabs.social_profiles.validations.G, ['owner_review_required', 'verified', 'rejected', 'missing']);
  assert.deepEqual(exported.tabs.assets.validations.I, ['owner_review_required', 'verified', 'rejected', 'missing']);
  assert.deepEqual(exported.tabs.assets.validations.K, ['cleared', 'pending', 'denied', 'revoked']);
  assert.deepEqual(exported.tabs.assets.validations.L, ['individual_consent', 'owner_authorized_public_profile_portrait']);
  assert.deepEqual(exported.tabs.assets.validations.Q, ['publishable', 'withheld_pending_rights_consent_and_verification', 'withdrawn']);
  assert.deepEqual(exported.tabs.social_profiles.validations.I, ['individual_consent', 'owner_authorized_public_profile_link']);
  const qaMetricIndex = exported.tabs.qa.headers.indexOf('metric');
  const qaFormulaIndex = exported.tabs.qa.headers.indexOf('formula_value');
  const portraitQa = exported.tabs.qa.rows.find((row) => row[qaMetricIndex] === 'publishable_portraits');
  assert.match(portraitQa[qaFormulaIndex], /"publishable"/);
  const readmeTopicIndex = exported.tabs.README.headers.indexOf('topic');
  const readmeDetailIndex = exported.tabs.README.headers.indexOf('detail');
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
    const socialPublication = social.headers.indexOf('publication_status');
    const socialSourceNote = social.headers.indexOf('source_note');
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

    const snapshotPath = path.join(tempRoot, 'normalized-snapshot.json');
    const outputDir = path.join(tempRoot, 'generated');
    fs.writeFileSync(snapshotPath, JSON.stringify(workbook));
    execFileSync(process.execPath, [path.join(root, 'tools/normalize-data.mjs'), '--input', snapshotPath, '--output-dir', outputDir], { cwd: root });
    const imported = JSON.parse(fs.readFileSync(path.join(outputDir, 'site-data.json'), 'utf8'));
    const baseline = loadGenerated();
    for (const dimension of ['people', 'engagements', 'institutions', 'programs', 'educationRecords', 'works', 'contributions', 'achievements', 'socialProfiles', 'assets']) {
      assert.equal(imported[dimension].length, baseline[dimension].length, 'roundtrip changed ' + dimension + ' row count');
    }
    const importedInstagram = imported.socialProfiles.find((row) => row.socialProfileId === 'SOC-I0001-INSTAGRAM');
    const importedPortrait = imported.assets.find((row) => row.assetId === 'PORTRAIT-I0001');
    assert.equal(importedInstagram.candidateStatus, 'candidate_present');
    assert.equal(imported.socialProfiles.filter((row) => row.platform === 'instagram' && row.candidateStatus === 'candidate_present').length, 12);
    assert.equal(importedInstagram.publicUrl, null);
    assert.equal(importedPortrait.candidateStatus, 'candidate_present');
    assert.equal(importedPortrait.publicPath, null);
    assert.equal(importedPortrait.sourceUrl, null);
    assert.equal(imported.socialProfiles.filter((row) => row.platform === 'linkedin' && row.publicUrl).length, 45);
    assert.equal(imported.socialProfiles.filter((row) => row.platform === 'github' && row.publicUrl).length, 12);
    assert.ok(imported.socialProfiles.filter((row) => row.publicUrl).every((row) =>
      row.publicationBasis === 'owner_authorized_public_profile_link' && row.ownerApproval?.status === 'granted'
    ));
    assert.equal(imported.assets.filter((row) => row.publicPath).length, 35);
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
  for (const fileName of fs.readdirSync(path.join(root, 'data/generated')).filter((name) => name.endsWith('.json'))) {
    assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'data/generated', fileName), 'utf8')), fileName);
  }
});

test('person IDs have one frozen canonical version', () => {
  const data = loadGenerated();
  assert.equal(data.people.length, 48);
  assertUnique(data.people, 'personId');
  assert.deepEqual(data.people.filter((person) => person.migrationClassification === 'full_time').map((person) => person.personId), ['S0001', 'S0002', 'S0003', 'S0004']);
  assert.deepEqual(data.people.filter((person) => person.migrationClassification === 'part_time').map((person) => person.personId), ['P0001']);
  assert.equal(data.people.filter((person) => person.migrationClassification === 'intern_or_program_participant').length, 43);
  assert.ok(data.people.every((person) => /^[SPI]\d{4}$/.test(person.personId)));
  assert.ok(data.people.every((person) => person.canonicalIdPolicy.frozenAcrossFutureRoleChanges === true));
  const serialized = JSON.stringify(data);
  assert.doesNotMatch(serialized, /person_id_v1/i);
  assert.doesNotMatch(serialized, /LDM-P-/);
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
    ['socialProfiles', 'socialProfileId'],
    ['assets', 'assetId']
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
  assert.ok(data.socialProfiles.every((item) => personIds.has(item.personId)));
  assert.ok(data.assets.every((item) => personIds.has(item.personId)));
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
  assert.equal(data.people.find((person) => person.personId === 'P0001').educationDisplayMode, 'neutral');
  for (const personId of ['I0037', 'I0038']) {
    const record = data.educationRecords.find((item) => item.personId === personId);
    assert.equal(record.institutionId, 'inst-chula');
    assert.equal(record.programId, 'program-cu-cedt');
    assert.equal(record.verificationStatus, 'source_conflict_unresolved');
  }
});

test('bios remain blank and owner-pending without public first-person evidence', () => {
  const data = loadGenerated();
  assert.ok(data.people.every((person) => person.bio.th === null && person.bio.en === null));
  assert.ok(data.people.every((person) => person.bio.status === 'owner_pending' && person.bio.verificationStatus === 'owner_pending'));
  assert.doesNotMatch(JSON.stringify(data.people.map((person) => person.bio)), /placeholder|contributed to|มีส่วนร่วมกับ/i);
});

test('FDI and computer-engineering display labels use the approved exact copy', () => {
  const data = loadGenerated();
  const fdi = data.engagements.filter((engagement) => engagement.program.code === 'FDI');
  assert.ok(fdi.length > 0);
  assert.ok(fdi.every((engagement) => engagement.program.names.th === 'Full-stack Developer Intern, FDI'));
  assert.ok(fdi.every((engagement) => engagement.program.names.en === 'Full-stack Developer Intern, FDI'));
  for (const programId of ['program-kmitl-computer-engineering', 'program-cu-computer-engineering']) {
    assert.equal(data.programs.find((program) => program.programId === programId).names.th.short, 'วิศวกรรมคอมพิวเตอร์');
  }
});

test('CityMETER works use release-aligned canonical mappings without promoting unresolved names', () => {
  const data = loadGenerated();
  const expected = new Map([
    ['work-citymeter-companies', 'dataset-registered-companies-status-capital'],
    ['work-citymeter-hotels', 'dataset-hotel-market'],
    ['work-citymeter-factories', 'dataset-factories-workers-investment'],
    ['work-citymeter-schools', 'dataset-schools-students-teachers'],
    ['work-citymeter-crop-area-output', 'dataset-crop-area-output'],
    ['work-citymeter-buildings', 'dataset-buildings']
  ]);
  for (const [workId, slug] of expected) assert.equal(data.works.find((work) => work.workId === workId).moduleSlug, slug);
  const floodForecast = data.works.find((work) => work.workId === 'work-citymeter-flood-forecasting-unresolved');
  assert.equal(floodForecast.moduleSlug, null);
  assert.equal(floodForecast.authorityStatus, 'unresolved_between_official_forecast_modules');
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
    'A public profile link may be published after exact identity verification under either recorded individual consent or the owner-authorized public-link basis. A portrait may be published only after exact identity verification, cleared publication rights and either recorded individual consent or the owner-authorized public-portrait basis. Neither owner-authorized basis is individual consent.'
  );
  const linkedIn = data.socialProfiles.filter((profile) => profile.platform === 'linkedin' && profile.publicUrl);
  const github = data.socialProfiles.filter((profile) => profile.platform === 'github' && profile.publicUrl);
  assert.equal(linkedIn.length, 45);
  assert.equal(github.length, 12);
  for (const profile of [...linkedIn, ...github]) {
    assert.equal(profile.verificationStatus, 'verified');
    assert.equal(profile.consentStatus, 'pending');
    assert.equal(profile.publicationBasis, 'owner_authorized_public_profile_link');
    assert.equal(profile.ownerApproval.status, 'granted');
    assert.equal(profile.ownerApproval.scope, 'public_profile_link_only');
  }

  const portraits = data.assets.filter((asset) => asset.publicPath);
  assert.equal(portraits.length, 35);
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
});

test('brand and community copy uses the owner-approved distinction', () => {
  const data = loadGenerated();
  assert.equal(data.copy.brand.brandName, 'Landometer');
  assert.equal(data.copy.brand.communityName, 'Landom');
  assert.equal(data.copy.brand.tagline.th, 'แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น');
  assert.equal(data.copy.brand.status, 'owner_approved_current_truth');
});
