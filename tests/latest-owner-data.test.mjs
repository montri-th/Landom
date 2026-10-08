import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/generated/site-data.json'), 'utf8'));
const rawAvailable = fs.existsSync(path.join(root, 'data/raw/google-sheet-snapshot.json'));

function exportedRows(tab) {
  return tab.rows.map((row) => Object.fromEntries(tab.headers.map((header, index) => [header, row[index]])));
}

test('latest owner-confirmed identity, education and DWR telemetry records stay exact', () => {
  const people = new Map(data.people.map((person) => [person.personId, person]));
  const primaryEducation = new Map(data.educationRecords.filter((record) => record.isPrimary).map((record) => [record.personId, record]));
  const social = new Map(data.socialProfiles.map((profile) => [profile.personId + '|' + profile.platform, profile]));
  const dwrTelemetry = data.works.find((work) => work.workId === 'work-dwr-telemetry');

  assert.equal(people.get('S0007').names.full.th, 'กนกศิลป์ จินดาดวงรัตน์');
  assert.equal(people.get('I0037').names.full.en, 'Nathanicha Sornbundit');
  assert.deepEqual(people.get('I0044').names.full, { th: 'วิชานาถ คงเกลี้ยง', en: 'Wichanat Khongkliang' });

  assert.deepEqual(primaryEducation.get('S0006').degree.abbreviation, { th: 'วศ.บ.', en: 'B.Eng.' });
  assert.deepEqual(primaryEducation.get('S0006').degree.field, { th: 'วิศวกรรมคอมพิวเตอร์', en: 'Computer Engineering' });
  assert.equal(primaryEducation.get('S0006').institutionId, 'inst-chula');

  assert.deepEqual(primaryEducation.get('S0007').degree.abbreviation, { th: 'วท.บ. (เกียรตินิยม)', en: 'B.Sc. (Hons.)' });
  assert.deepEqual(primaryEducation.get('S0007').degree.field, { th: 'วิทยาการคอมพิวเตอร์', en: 'Computer Science' });
  assert.equal(primaryEducation.get('S0007').institutionId, 'inst-chula');

  assert.equal(primaryEducation.get('P0001').degree.title.th, 'เศรษฐศาสตรบัณฑิต');
  assert.equal(primaryEducation.get('P0001').degree.title.en, 'Bachelor of Economics');
  assert.equal(primaryEducation.get('P0001').institutionId, 'inst-psu');
  assert.equal(people.get('P0001').educationDisplayMode, 'qualification');
  assert.deepEqual(people.get('P0001').educationDisplay.card, {
    th: 'ศ.บ. เศรษฐศาสตร์ · ม.อ.',
    en: 'B.Econ., Economics · PSU'
  });
  assert.deepEqual(people.get('P0001').educationDisplay.detail, {
    th: 'เศรษฐศาสตรบัณฑิต (เศรษฐศาสตร์) — มหาวิทยาลัยสงขลานครินทร์',
    en: 'Bachelor of Economics (Economics) — Prince of Songkla University'
  });

  assert.deepEqual(dwrTelemetry.names, { th: 'โทรมาตร กรมทรัพยากรน้ำ', en: 'DWR Water Monitoring Telemetry' });
  assert.equal(dwrTelemetry.destinationUrl, 'https://telemetry.dwr.go.th/');
  assert.equal(dwrTelemetry.scopeLayer, 'partner_specific');

  assert.equal(social.get('S0006|github').publicUrl, 'https://github.com/otamnaz');
  assert.equal(social.get('I0037|linkedin').publicUrl, 'https://www.linkedin.com/in/nathanicha-sornbundit-840109431');
  assert.equal(primaryEducation.get('I0044').institutionId, 'inst-chula');
  assert.equal(primaryEducation.get('I0044').programId, 'program-cu-biochemistry');
  assert.equal(primaryEducation.get('I0044').degree.awardStatus, 'in_progress');
  assert.equal(primaryEducation.get('I0044').degree.personalAwardVerified, false);
  assert.equal(social.get('I0044|linkedin').publicUrl, 'https://www.linkedin.com/in/wichanat-khongkliang-ab050a229/');
  for (const profile of [social.get('S0006|github'), social.get('I0037|linkedin'), social.get('I0044|linkedin')]) {
    assert.equal(profile.publicationBasis, profile.personId === 'S0006' ? 'owner_authorized_public_profile_link' : 'individual_consent');
    assert.equal(profile.ownerApproval?.status, 'granted');
    assert.equal(profile.publicationStatus, 'publishable');
  }
});

test('latest owner-confirmed internship periods and first-joined dates stay exact', () => {
  const people = new Map(data.people.map((person) => [person.personId, person]));
  const engagements = new Map(data.engagements.map((engagement) => [engagement.engagementId, engagement]));
  const period = (engagementId) => {
    const engagement = engagements.get(engagementId);
    return {
      personId: engagement?.personId,
      start: engagement?.start,
      end: engagement?.end,
      status: engagement?.status,
      evidenceStatus: engagement?.evidenceStatus,
      verificationStatus: engagement?.verificationStatus
    };
  };

  assert.deepEqual(period('E0045'), {
    personId: 'I0035', start: '2026-05-19', end: '2026-07-30', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_period'
  });
  assert.deepEqual(period('E0052'), {
    personId: 'I0042', start: null, end: '2026-08-27', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_period'
  });
  assert.deepEqual(period('E0030'), {
    personId: 'I0026', start: '2026-01-12', end: '2026-02-18', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_period'
  });
  assert.deepEqual(period('E0059'), {
    personId: 'I0018', start: '2026-01-12', end: '2026-03-27', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_period'
  });
  for (const [engagementId, personId] of [['E0034', 'I0027'], ['E0037', 'I0028']]) {
    assert.deepEqual(period(engagementId), {
      personId, start: '2026-01-12', end: '2026-03', status: 'completed',
      evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_mixed_precision_period'
    });
  }

  assert.deepEqual(
    Object.fromEntries(['I0026', 'I0027', 'I0028'].map((personId) => [personId, people.get(personId)?.firstJoined])),
    { I0026: '2026-01-12', I0027: '2026-01-12', I0028: '2026-01-12' }
  );
  for (const personId of ['I0018', 'I0026', 'I0027', 'I0028', 'I0035', 'I0042']) {
    assert.equal(people.get(personId)?.currentStatus, 'alumni', personId + ' must be Alumni after the confirmed period ended');
  }
  assert.equal(people.get('I0040')?.currentStatus, 'alumni', 'Dan is Alumni after the corrected 1 September end date');

  assert.deepEqual(period('E0022'), {
    personId: 'I0018', start: '2025-05-19', end: '2025-07-31', status: 'completed',
    evidenceStatus: 'sheet_recorded', verificationStatus: 'owner_source_reconciled'
  });

  assert.deepEqual(period('E0008'), {
    personId: 'I0004', start: '2025-08', end: '2026-03', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_month_period'
  });
  assert.deepEqual(period('E0047'), {
    personId: 'I0037', start: '2026-05-19', end: '2026-07-31', status: 'completed',
    evidenceStatus: 'sheet_recorded', verificationStatus: 'sheet_recorded'
  });
  assert.deepEqual(period('E0050'), {
    personId: 'I0040', start: '2026-05-16', end: '2026-09-01', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_period'
  });
  assert.deepEqual(period('E0051'), {
    personId: 'I0041', start: '2026-05-19', end: '2026-07-17', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_period'
  });
  assert.deepEqual(period('E0043'), {
    personId: 'I0033', start: '2026-04-28', end: '2026-07-10', status: 'completed',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_period'
  });
  assert.deepEqual(period('E0064'), {
    personId: 'I0044', start: '2026-08-18', end: null, status: 'ongoing',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_start_end_pending'
  });
  assert.equal(people.get('I0044')?.names.nickname.th, 'โซ่');
  assert.equal(people.get('I0044')?.names.nickname.en, 'Sorso');
  assert.equal(people.get('I0044')?.currentStatus, 'active');
  assert.equal(people.get('I0044')?.firstJoined, '2026-08-18');
  assert.deepEqual(
    Object.fromEntries(['I0004', 'I0037', 'I0040', 'I0041'].map((personId) => [personId, people.get(personId)?.firstJoined])),
    { I0004: '2025-08', I0037: '2026-05-19', I0040: '2026-05-16', I0041: '2026-05-19' }
  );
});

test('latest governed data additions do not change any approved profile biography', () => {
  const approvedCopy = JSON.parse(fs.readFileSync(path.join(root, 'data/approved/profile-copy.json'), 'utf8'));
  const generatedById = new Map(data.people.map((person) => [person.personId, person.bio]));
  for (const approved of approvedCopy.profiles) {
    assert.equal(generatedById.get(approved.personId).th, approved.th, approved.personId + ' Thai bio changed');
    assert.equal(generatedById.get(approved.personId).en, approved.en, approved.personId + ' English bio changed');
  }
});

test('Q keeps the canonical ID, verified CEDT placement and blank deferred statement without inferred English identity', () => {
  const q = data.people.find((person) => person.personId === 'I0045');
  assert.equal(q.names.full.th, 'ณัฐพัฒน์ แดงคงแก้ว');
  assert.equal(q.names.full.en, null);
  assert.deepEqual(q.names.nickname, { th: 'คิว', en: null });
  assert.equal(q.firstJoined, '2026-08-01');
  assert.equal(q.bio.status, 'owner_pending');
  assert.equal(q.bio.th, null);
  assert.equal(q.bio.en, null);
  const education = data.educationRecords.find((record) => record.personId === q.personId && record.isPrimary);
  assert.equal(education.educationRecordId, 'EDU0053');
  assert.equal(education.programId, 'program-cu-cedt');
  assert.equal(education.degree, null);
  const engagement = data.engagements.find((record) => record.personId === q.personId);
  assert.equal(engagement.engagementId, 'E0065');
  assert.equal(engagement.academicPlacementType, 'cooperative_education');
  assert.equal(engagement.program.code, null);
  assert.deepEqual(engagement.program.names, { th: 'Landometer Internship Program / CEDT', en: 'Landometer Internship Program / CEDT' });
  assert.equal(engagement.status, 'ongoing');
  assert.equal(engagement.end, null);
});

test('latest work credits preserve explicit scope, in-progress status and exact Non-bank destination', () => {
  assert.equal(data.people.length, 53);
  assert.equal(data.engagements.length, 65);
  assert.equal(data.contributions.length, 124);
  const added = data.contributions.filter((contribution) => ['C0121', 'C0122', 'C0123', 'C0124'].includes(contribution.contributionId));
  assert.deepEqual(added.map((item) => [item.personId, item.workId, item.role.en]), [
    ['I0044', 'work-ijji', 'Project support'],
    ['I0045', 'work-citymeter-religious-places-unresolved', 'Developing'],
    ['I0045', 'work-citymeter-fuel-stations', 'Improving'],
    ['I0030', 'work-citymeter-nonbank', 'Software development']
  ]);
  assert.ok(added.every((item) => item.sourceRef === 'owner_instruction_2026-09-29'));
  const nonbank = data.works.find((work) => work.workId === 'work-citymeter-nonbank');
  assert.equal(nonbank.destinationUrl, 'https://landometer.com/v3/citymeter?d=nonBank');
  assert.equal(nonbank.linkEvidence.linkScope, 'exact_module');
  assert.equal(nonbank.linkEvidence.sourceRef, 'owner_instruction_2026-09-29');
  assert.deepEqual(nonbank.catalogUrl, { th: null, en: null });
  const dada = data.engagements.find((engagement) => engagement.engagementId === 'E0038');
  assert.deepEqual([dada.start, dada.end, dada.status], ['2026-01-21', '2026-02-05', 'completed']);
  assert.equal(data.engagements.find((engagement) => engagement.engagementId === 'E0060').end, '2025-11-13');
});

test('late-evening replies preserve corrected names and dates while withholding withdrawn or unverified links', () => {
  const teema = data.people.find((person) => person.personId === 'I0033');
  const education = data.educationRecords.find((record) => record.personId === 'I0033' && record.isPrimary);
  const media = JSON.parse(fs.readFileSync(path.join(root, 'data/generated/people-media.json'), 'utf8'));
  assert.equal(teema.names.nickname.th, 'ธีม');
  assert.equal(teema.names.card.th, 'ธีม');
  assert.match(teema.bio.th, /^ธีมสนใจ/);
  assert.deepEqual(education.studyPeriod, {
    start: '2022', end: '2026', current: false,
    label: { th: '2022–2026', en: '2022–2026' }
  });
  assert.equal(education.degree.awardStatus, 'under_review');
  assert.equal(education.degree.personalAwardVerified, false);
  assert.equal(media.people.find((person) => person.personId === 'I0033').displayName.th, 'ธีม');
  assert.equal(data.assets.find((asset) => asset.personId === 'I0033').alt.th, 'ภาพโปรไฟล์ของธีม');
  for (const personId of ['I0009', 'I0033', 'I0043']) {
    assert.equal(data.people.find((person) => person.personId === personId).publication.consentStatus, 'granted');
    assert.equal(data.assets.find((asset) => asset.personId === personId).consentStatus, 'granted');
    assert.equal(data.socialProfiles.find((profile) => profile.personId === personId && profile.platform === 'linkedin').consentStatus, 'granted');
  }
  assert.equal(data.socialProfiles.find((profile) => profile.personId === 'I0033' && profile.platform === 'github').publicUrl, 'https://github.com/Tymcal');
  assert.equal(data.socialProfiles.find((profile) => profile.personId === 'I0043' && profile.platform === 'github'), undefined);
  const hamGithub = data.socialProfiles.find((profile) => profile.personId === 'I0009' && profile.platform === 'github');
  assert.equal(hamGithub.consentStatus, 'granted');
  assert.equal(hamGithub.publicUrl, null);
  assert.equal(hamGithub.candidateValueEmitted, false);
  assert.equal(hamGithub.verificationStatus, 'owner_review_required');
  assert.equal(hamGithub.publicationStatus, 'withheld_pending_verification');
  assert.equal(data.people.length, 53);
  assert.equal(data.engagements.length, 65);
  assert.equal(data.contributions.length, 124);
});

test('reviewed publication replies apply per scope while nonrespondents and Pote portrait refusal remain truthful', () => {
  const consent = JSON.parse(fs.readFileSync(path.join(root, 'data/approved/publication-consent.json'), 'utf8'));
  assert.equal(consent.records.length, 36);
  const respondents = new Set(consent.records.map((record) => record.personId));
  assert.equal(data.people.filter((person) => person.publication.consentStatus === 'granted').length, 36);
  for (const person of data.people) {
    assert.equal(person.publication.consentStatus, respondents.has(person.personId) ? 'granted' : 'pending');
  }
  for (const record of consent.records) {
    const portrait = data.assets.find((asset) => asset.personId === record.personId && asset.kind === 'profile_portrait');
    if (record.portrait) {
      assert.equal(portrait.consentStatus, record.portrait.consentStatus);
      if (record.portrait.consentStatus === 'granted') {
        assert.equal(portrait.sha256, record.portrait.sha256);
        assert.equal(portrait.publicationBasis, 'individual_consent');
        assert.equal(portrait.publicationStatus, 'publishable');
      } else {
        assert.equal(portrait.publicPath, null);
        assert.equal(portrait.sourceUrl, null);
        assert.notEqual(portrait.publicationStatus, 'publishable');
      }
    }
    for (const approved of record.socials) {
      const profile = data.socialProfiles.find((item) => item.personId === record.personId && item.platform === approved.platform);
      if (approved.consentStatus === 'denied') {
        assert.equal(profile, undefined, 'A denied social channel must be absent from public data.');
        assert.equal(approved.publicUrl, undefined, 'A denial contract must not republish the refused link.');
        continue;
      }
      assert.equal(profile.publicUrl, approved.publicUrl);
      assert.equal(profile.consentStatus, 'granted');
      assert.equal(profile.publicationBasis, 'individual_consent');
    }
  }
  assert.equal(data.assets.find((asset) => asset.personId === 'S0007').consentStatus, 'denied');
  assert.equal(fs.existsSync(path.join(root, 'public/assets/people/S0007.jpg')), false);
  for (const personId of ['S0003', 'I0015', 'I0023', 'I0021']) {
    assert.equal(data.assets.find((asset) => asset.personId === personId && asset.kind === 'profile_portrait').consentStatus, 'granted');
    assert.ok(data.socialProfiles.filter((profile) => profile.personId === personId && profile.publicUrl).every((profile) => profile.consentStatus === 'granted'));
  }
  assert.equal(data.socialProfiles.find((profile) => profile.personId === 'S0004' && profile.platform === 'linkedin').consentStatus, 'granted');
  assert.equal(data.meta.dataUpdatedAt, '2026-10-08');
  assert.equal(data.meta.reviewedAt, '2026-10-08');
  if (rawAvailable) {
    const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'data/raw/google-sheet-snapshot.json'), 'utf8'));
    assert.equal(data.meta.source.snapshotFetchedAt, snapshot.source.fetchedAt, 'review dates must not falsify the raw fetch date');
  }
});

test('latest owner-confirmed facts remain present in the governed Sheet export', { skip: rawAvailable ? false : 'authorized private snapshot is not present' }, () => {
  const workbook = JSON.parse(execFileSync(process.execPath, [path.join(root, 'tools/export-sheet-tabs.mjs')], { cwd: root, encoding: 'utf8' }));
  const people = new Map(exportedRows(workbook.tabs.people_registry).map((row) => [row.person_id, row]));
  const education = new Map(exportedRows(workbook.tabs.education).map((row) => [row.person_id, row]));
  const engagements = new Map(exportedRows(workbook.tabs.engagements).map((row) => [row.engagement_id, row]));
  const works = new Map(exportedRows(workbook.tabs.works).map((row) => [row.work_id, row]));
  const socials = new Map(exportedRows(workbook.tabs.social_profiles).map((row) => [row.person_id + '|' + row.platform, row]));
  const qa = new Map(exportedRows(workbook.tabs.qa).map((row) => [row.metric, row]));

  assert.equal(people.get('I0037').full_name_en, 'Nathanicha Sornbundit');
  assert.equal(people.get('P0001').education_display_mode, 'qualification');
  assert.equal(education.get('P0001').degree_title_en, 'Bachelor of Economics');
  assert.equal(education.get('S0006').degree_abbreviation_en, 'B.Eng.');
  assert.equal(education.get('S0007').degree_abbreviation_en, 'B.Sc. (Hons.)');
  assert.equal(works.get('work-dwr-telemetry').destination_url, 'https://telemetry.dwr.go.th/');
  assert.equal(socials.get('S0006|github').public_url, 'https://github.com/otamnaz');
  assert.equal(socials.get('I0037|linkedin').public_url, 'https://www.linkedin.com/in/nathanicha-sornbundit-840109431');
  assert.equal(socials.get('I0044|linkedin').public_url, 'https://www.linkedin.com/in/wichanat-khongkliang-ab050a229/');
  assert.equal(education.get('I0044').program_id, 'program-cu-biochemistry');
  assert.deepEqual(
    Object.fromEntries(['I0026', 'I0027', 'I0028'].map((personId) => [personId, people.get(personId).first_joined])),
    { I0026: '2026-01-12', I0027: '2026-01-12', I0028: '2026-01-12' }
  );
  assert.deepEqual(
    Object.fromEntries(['I0004', 'I0037', 'I0040', 'I0041'].map((personId) => [personId, people.get(personId).first_joined])),
    { I0004: '2025-08', I0037: '2026-05-19', I0040: '2026-05-16', I0041: '2026-05-19' }
  );
  assert.deepEqual(
    Object.fromEntries(['E0008', 'E0047', 'E0050', 'E0051'].map((engagementId) => {
      const engagement = engagements.get(engagementId);
      return [engagementId, [engagement.start, engagement.end, engagement.status]];
    })),
    {
      E0008: ['2025-08', '2026-03', 'completed'],
      E0047: ['2026-05-19', '2026-07-31', 'completed'],
      E0050: ['2026-05-16', '2026-09-01', 'completed'],
      E0051: ['2026-05-19', '2026-07-17', 'completed']
    }
  );
  assert.deepEqual(
    Object.fromEntries(['E0030', 'E0034', 'E0037', 'E0045', 'E0052', 'E0059', 'E0064'].map((engagementId) => {
      const engagement = engagements.get(engagementId);
      return [engagementId, [engagement.start, engagement.end, engagement.status]];
    })),
    {
      E0030: ['2026-01-12', '2026-02-18', 'completed'],
      E0034: ['2026-01-12', '2026-03', 'completed'],
      E0037: ['2026-01-12', '2026-03', 'completed'],
      E0045: ['2026-05-19', '2026-07-30', 'completed'],
      E0052: ['', '2026-08-27', 'completed'],
      E0059: ['2026-01-12', '2026-03-27', 'completed'],
      E0064: ['2026-08-18', '', 'ongoing']
    }
  );
  assert.equal(qa.get('verified_completed_staff_degrees').expected, 7);
});
