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
  for (const profile of [social.get('S0006|github'), social.get('I0037|linkedin')]) {
    assert.equal(profile.publicationBasis, 'owner_authorized_public_profile_link');
    assert.equal(profile.ownerApproval?.status, 'granted');
    assert.equal(profile.publicationStatus, 'publishable');
  }
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
  assert.equal(qa.get('verified_completed_staff_degrees').expected, 7);
});
