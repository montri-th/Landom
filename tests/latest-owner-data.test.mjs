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
  assert.equal(social.get('I0044|linkedin').publicUrl, 'https://www.linkedin.com/in/wichanat-khongkliang-ab050a229');
  for (const profile of [social.get('S0006|github'), social.get('I0037|linkedin'), social.get('I0044|linkedin')]) {
    assert.equal(profile.publicationBasis, 'owner_authorized_public_profile_link');
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
  assert.equal(people.get('I0040')?.currentStatus, 'active', 'I0040 must remain Active through the confirmed 15 September end date');

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
    personId: 'I0040', start: '2026-05-19', end: '2026-09-15', status: 'ongoing',
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
    personId: 'I0044', start: '2026-08-24', end: null, status: 'ongoing',
    evidenceStatus: 'owner_supplied', verificationStatus: 'owner_confirmed_exact_start_end_pending'
  });
  assert.equal(people.get('I0044')?.names.nickname.th, 'โซ่');
  assert.equal(people.get('I0044')?.names.nickname.en, 'Sorso');
  assert.equal(people.get('I0044')?.currentStatus, 'active');
  assert.equal(people.get('I0044')?.firstJoined, '2026-08-24');
  assert.deepEqual(
    Object.fromEntries(['I0004', 'I0037', 'I0040', 'I0041'].map((personId) => [personId, people.get(personId)?.firstJoined])),
    { I0004: '2025-08', I0037: '2026-05-19', I0040: '2026-05-19', I0041: '2026-05-19' }
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
  assert.equal(socials.get('I0044|linkedin').public_url, 'https://www.linkedin.com/in/wichanat-khongkliang-ab050a229');
  assert.equal(education.get('I0044').program_id, 'program-cu-biochemistry');
  assert.deepEqual(
    Object.fromEntries(['I0026', 'I0027', 'I0028'].map((personId) => [personId, people.get(personId).first_joined])),
    { I0026: '2026-01-12', I0027: '2026-01-12', I0028: '2026-01-12' }
  );
  assert.deepEqual(
    Object.fromEntries(['I0004', 'I0037', 'I0040', 'I0041'].map((personId) => [personId, people.get(personId).first_joined])),
    { I0004: '2025-08', I0037: '2026-05-19', I0040: '2026-05-19', I0041: '2026-05-19' }
  );
  assert.deepEqual(
    Object.fromEntries(['E0008', 'E0047', 'E0050', 'E0051'].map((engagementId) => {
      const engagement = engagements.get(engagementId);
      return [engagementId, [engagement.start, engagement.end, engagement.status]];
    })),
    {
      E0008: ['2025-08', '2026-03', 'completed'],
      E0047: ['2026-05-19', '2026-07-31', 'completed'],
      E0050: ['2026-05-19', '2026-09-15', 'ongoing'],
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
      E0064: ['2026-08-24', '', 'ongoing']
    }
  );
  assert.equal(qa.get('verified_completed_staff_degrees').expected, 7);
});
