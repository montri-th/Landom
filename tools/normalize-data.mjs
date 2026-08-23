import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { importNormalizedSheetSnapshot, isNormalizedSheetSnapshot } from './normalized-sheet-roundtrip.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1]) throw new Error(name + ' requires a path.');
  return path.resolve(root, args[index + 1]);
}
const inputPath = option('--input', path.join(root, 'data/raw/google-sheet-snapshot.json'));
const outputDir = option('--output-dir', path.join(root, 'data/generated'));

const snapshot = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

function rowsToObjects(rows) {
  const [header, ...body] = rows;
  return body.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ''])));
}

function clean(value) {
  const textValue = String(value ?? '').trim();
  return textValue || null;
}

function parseDate(value) {
  const textValue = clean(value);
  return textValue && /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(textValue) ? textValue : null;
}

function parsePeriod(value) {
  const textValue = clean(value);
  if (!textValue) return { start: null, end: null, label: null };
  const match = textValue.match(/^(\d{4}-\d{2}-\d{2})\s*[–-]\s*(\d{4}-\d{2}-\d{2})$/);
  return match
    ? { start: match[1], end: match[2], label: textValue }
    : { start: null, end: null, label: textValue };
}

function normalizeConsent(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (['yes', 'approved', 'granted', 'true'].includes(normalized)) return 'granted';
  if (['no', 'denied', 'revoked', 'false'].includes(normalized)) return 'denied';
  return 'pending';
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(outputDir, name), JSON.stringify(value, null, 2) + '\n');
}

function writeSiteDataFiles(siteData) {
  fs.mkdirSync(outputDir, { recursive: true });
  writeJson('meta.json', siteData.meta);
  writeJson('copy.json', siteData.copy);
  writeJson('institutions.json', siteData.institutions);
  writeJson('programs.json', siteData.programs);
  writeJson('education-records.json', siteData.educationRecords);
  writeJson('people.json', siteData.people);
  writeJson('engagements.json', siteData.engagements);
  writeJson('works.json', siteData.works);
  writeJson('contributions.json', siteData.contributions);
  writeJson('achievements.json', siteData.achievements);
  writeJson('social-profiles.json', siteData.socialProfiles);
  writeJson('assets.json', siteData.assets);
  writeJson('site-data.json', siteData);
}

if (isNormalizedSheetSnapshot(snapshot)) {
  const baselinePath = path.join(root, 'data/generated/site-data.json');
  if (!fs.existsSync(baselinePath)) throw new Error('Normalized Sheet import requires the reviewed generated baseline at data/generated/site-data.json.');
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const imported = importNormalizedSheetSnapshot(snapshot, baseline);
  writeSiteDataFiles(imported);
  console.log('Imported normalized Sheet snapshot: ' + imported.people.length + ' people, ' + imported.socialProfiles.length + ' social rows, ' + imported.assets.length + ' assets.');
  process.exit(0);
}

const peopleRows = rowsToObjects(snapshot.sheets.people_registry);
const engagementRows = rowsToObjects(snapshot.sheets.engagements);
const contributionRows = rowsToObjects(snapshot.sheets.contributions);

const migrationDate = '2026-08-23';
const staffSourceIds = new Set(['LDM-P-001', 'LDM-P-005', 'LDM-P-007', 'LDM-P-034']);
const partTimeSourceIds = new Set(['LDM-P-004']);
const sourceIdToPersonId = new Map();
let staffCounter = 0;
let partTimeCounter = 0;
let internCounter = 0;

for (const row of peopleRows) {
  let personId;
  if (staffSourceIds.has(row.person_id)) personId = 'S' + String(++staffCounter).padStart(4, '0');
  else if (partTimeSourceIds.has(row.person_id)) personId = 'P' + String(++partTimeCounter).padStart(4, '0');
  else personId = 'I' + String(++internCounter).padStart(4, '0');
  sourceIdToPersonId.set(row.person_id, personId);
}

const institutions = [
  {
    institutionId: 'inst-kmitl',
    names: {
      th: { formal: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', short: 'สจล.' },
      en: { formal: "King Mongkut's Institute of Technology Ladkrabang", short: 'KMITL' }
    },
    aliases: ['KMITL'],
    verificationStatus: 'canonical_name_reviewed'
  },
  {
    institutionId: 'inst-chula',
    names: {
      th: { formal: 'จุฬาลงกรณ์มหาวิทยาลัย', short: 'จุฬาฯ' },
      en: { formal: 'Chulalongkorn University', short: 'CU' }
    },
    aliases: ['Chulalongkorn', 'Chulalongkorn University'],
    verificationStatus: 'canonical_name_reviewed'
  },
  {
    institutionId: 'inst-thammasat',
    names: {
      th: { formal: 'มหาวิทยาลัยธรรมศาสตร์', short: 'มธ.' },
      en: { formal: 'Thammasat University', short: 'TU' }
    },
    aliases: ['Thammasat', 'Thammasat Business School'],
    verificationStatus: 'canonical_name_reviewed'
  },
  {
    institutionId: 'inst-kaist',
    names: {
      th: { formal: 'สถาบันวิทยาศาสตร์และเทคโนโลยีขั้นสูงแห่งเกาหลี', short: 'KAIST' },
      en: { formal: 'Korea Advanced Institute of Science and Technology', short: 'KAIST' }
    },
    aliases: ['KAIST'],
    verificationStatus: 'owner_review_required'
  },
  {
    institutionId: 'inst-uq',
    names: {
      th: { formal: 'มหาวิทยาลัยควีนส์แลนด์', short: 'UQ' },
      en: { formal: 'The University of Queensland', short: 'UQ' }
    },
    aliases: ['UQ'],
    verificationStatus: 'canonical_name_reviewed'
  },
  {
    institutionId: 'inst-nmu',
    names: {
      th: { formal: 'มหาวิทยาลัยนวมินทราธิราช', short: 'มว.' },
      en: { formal: 'Navamindradhiraj University', short: 'NMU' }
    },
    aliases: ['Navamindradhiraj'],
    verificationStatus: 'canonical_name_reviewed'
  },
  {
    institutionId: 'inst-mahidol',
    names: {
      th: { formal: 'มหาวิทยาลัยมหิดล', short: 'มหิดล' },
      en: { formal: 'Mahidol University', short: 'MU' }
    },
    aliases: ['Mahidol'],
    verificationStatus: 'canonical_name_reviewed'
  },
  {
    institutionId: 'inst-southampton',
    names: {
      th: { formal: 'มหาวิทยาลัยเซาแทมป์ตัน', short: 'Southampton' },
      en: { formal: 'University of Southampton', short: 'Southampton' }
    },
    aliases: ['University of Southampton'],
    verificationStatus: 'canonical_name_reviewed'
  },
  {
    institutionId: 'inst-ucl',
    names: {
      th: { formal: 'ยูนิเวอร์ซิตีคอลเลจลอนดอน', short: 'UCL' },
      en: { formal: 'University College London', short: 'UCL' }
    },
    aliases: ['UCL'],
    verificationStatus: 'canonical_name_reviewed'
  }
];

const programs = [
  ['program-kmitl-computer-engineering', 'วิศวกรรมคอมพิวเตอร์', 'วิศวกรรมคอมพิวเตอร์', 'Computer Engineering', 'CPE'],
  ['program-cu-cedt', 'วิศวกรรมคอมพิวเตอร์และเทคโนโลยีดิจิทัล', 'CEDT', 'Computer Engineering and Digital Technology', 'CEDT'],
  ['program-cu-computer-engineering', 'วิศวกรรมคอมพิวเตอร์', 'วิศวกรรมคอมพิวเตอร์', 'Computer Engineering', 'CPE'],
  ['program-cu-public-relations', 'การประชาสัมพันธ์', 'PR', 'Public Relations', 'PR'],
  ['program-cu-chinese', 'ภาษาจีน คณะอักษรศาสตร์', 'ภาษาจีน', 'Chinese, Faculty of Arts', 'Chinese'],
  ['program-tu-marketing', 'การตลาด', 'การตลาด', 'Marketing', 'Marketing'],
  ['program-cu-bascii', 'ศิลปศาสตรและวิทยาศาสตรบัณฑิต สาขานวัตกรรมบูรณาการ', 'BAScii', 'Bachelor of Arts and Science in Integrated Innovation', 'BAScii'],
  ['program-tu-dbtm', 'การจัดการการออกแบบ ธุรกิจ และเทคโนโลยี', 'DBTM', 'Design, Business & Technology Management', 'DBTM'],
  ['program-cu-economics', 'เศรษฐศาสตร์', 'เศรษฐศาสตร์', 'Economics', 'Economics'],
  ['program-cu-eba', 'เศรษฐศาสตร์ หลักสูตรนานาชาติ', 'EBA', 'Economics, International Program', 'EBA'],
  ['program-cu-finance', 'การเงิน', 'การเงิน', 'Finance', 'Finance'],
  ['program-kaist-aerospace-btm', 'วิศวกรรมการบินและอวกาศ และการจัดการเทคโนโลยีธุรกิจ', 'Aerospace & BTM', 'Aerospace Engineering & Business Technology Management', 'Aerospace & BTM'],
  ['program-tu-bba-marketing', 'บริหารธุรกิจ สาขาการตลาด', 'BBA Marketing', 'BBA in Marketing', 'BBA Marketing'],
  ['program-cu-politics-global-studies', 'การเมืองและโลกสัมพันธ์ศึกษา', 'PGS', 'Politics & Global Studies', 'PGS'],
  ['program-uq-social-science', 'สังคมศาสตร์', 'Social Science', 'Social Science', 'Social Science'],
  ['program-nmu-urban-administration', 'การบริหารและจัดการเมือง', 'Urban Administration', 'Urban Administration and Management', 'Urban Administration'],
  ['program-tu-ibmp', 'IBMP', 'IBMP', 'IBMP', 'IBMP'],
  ['program-ucl-mathematical-computation', 'คณิตศาสตร์เชิงคำนวณ', 'Mathematical Computation', 'Mathematical Computation', 'Mathematical Computation']
].map(([programId, thFormal, thShort, enFormal, enShort]) => ({
  programId,
  names: { th: { formal: thFormal, short: thShort }, en: { formal: enFormal, short: enShort } },
  qualificationLevel: null,
  verificationStatus: 'normalized_from_sheet_owner_review_required'
}));

const educationMap = {
  'KMITL, Computer Engineering': [['inst-kmitl', 'program-kmitl-computer-engineering']],
  'KMITL Computer Engineering': [['inst-kmitl', 'program-kmitl-computer-engineering']],
  'KMITL': [['inst-kmitl', null]],
  'CU CEDT': [['inst-chula', 'program-cu-cedt']],
  'Computer Engineering, Chulalongkorn': [['inst-chula', 'program-cu-computer-engineering']],
  'Public Relations, Chulalongkorn': [['inst-chula', 'program-cu-public-relations']],
  'Faculty of Arts (Chinese), Chulalongkorn': [['inst-chula', 'program-cu-chinese']],
  'Marketing, Thammasat': [['inst-thammasat', 'program-tu-marketing']],
  'BAScii, Chulalongkorn': [['inst-chula', 'program-cu-bascii']],
  'BAScii (Integrated Innovation), Chulalongkorn': [['inst-chula', 'program-cu-bascii']],
  'Design, Business & Technology Management, Thammasat': [['inst-thammasat', 'program-tu-dbtm']],
  'Economics, Chulalongkorn': [['inst-chula', 'program-cu-economics']],
  'Economics (EBA), Faculty of Arts, Chulalongkorn': [['inst-chula', 'program-cu-eba']],
  'Finance, Chulalongkorn': [['inst-chula', 'program-cu-finance']],
  'Aerospace Engineering & Business Technology Management, KAIST': [['inst-kaist', 'program-kaist-aerospace-btm']],
  'BBA (Marketing), Thammasat': [['inst-thammasat', 'program-tu-bba-marketing']],
  'Politics & Global Studies, Chulalongkorn / Social Science, UQ': [
    ['inst-chula', 'program-cu-politics-global-studies'],
    ['inst-uq', 'program-uq-social-science']
  ],
  'Urban Administration and Management, Navamindradhiraj': [['inst-nmu', 'program-nmu-urban-administration']],
  'Mahidol': [['inst-mahidol', null]],
  'IBMP, Thammasat Business School': [['inst-thammasat', 'program-tu-ibmp']],
  'University of Southampton (study year abroad)': [['inst-southampton', null]],
  'Mathematical Computation, UCL': [['inst-ucl', 'program-ucl-mathematical-computation']],
  'Chulalongkorn': [['inst-chula', null]]
};

const latestEngagementNameByPerson = new Map();
for (const row of engagementRows) {
  if (/[฀-๿]/.test(row.name || '')) latestEngagementNameByPerson.set(row.person_id, row.name.trim());
}

const people = peopleRows.map((row) => {
  const personId = sourceIdToPersonId.get(row.person_id);
  const migrationClassification = staffSourceIds.has(row.person_id)
    ? 'full_time'
    : partTimeSourceIds.has(row.person_id)
      ? 'part_time'
      : 'intern_or_program_participant';
  const consentStatus = normalizeConsent(row.consent_public);
  return {
    personId,
    names: {
      full: {
        th: clean(row.full_name_th) || latestEngagementNameByPerson.get(row.person_id) || null,
        en: clean(row.full_name_en)
      },
      nickname: { th: clean(row.nickname), en: clean(row.nickname_en) },
      card: { th: clean(row.nickname) || clean(row.full_name_th), en: clean(row.nickname_en) || clean(row.full_name_en) }
    },
    currentStatus: String(row.current_status || '').toLowerCase() === 'active' ? 'active' : 'alumni',
    firstJoined: parseDate(row.first_joined),
    migrationClassification,
    canonicalIdPolicy: {
      assignedAtMigration: migrationDate,
      categoryAtMigration: migrationClassification,
      frozenAcrossFutureRoleChanges: true
    },
    educationDisplayMode: migrationClassification === 'full_time'
      ? 'qualification'
      : migrationClassification === 'part_time'
        ? 'neutral'
        : 'program',
    educationDisplay: null,
    bio: { th: null, en: null, status: 'owner_pending', verificationStatus: 'owner_pending' },
    publication: { consentStatus, profileStatus: consentStatus === 'granted' ? 'eligible' : 'withheld_pending_consent' },
    dataQuality: {
      profileVerificationStatus: 'owner_review_required',
      sourceNotePresent: Boolean(clean(row.source_note))
    }
  };
});

const educationRecords = [];
for (const row of peopleRows) {
  const mappings = educationMap[row.university] || [];
  mappings.forEach(([institutionId, programId], index) => {
    const sourceConflict = ['LDM-P-042', 'LDM-P-043'].includes(row.person_id);
    const studyAbroad = row.university === 'University of Southampton (study year abroad)';
    educationRecords.push({
      educationRecordId: 'EDU' + String(educationRecords.length + 1).padStart(4, '0'),
      personId: sourceIdToPersonId.get(row.person_id),
      institutionId,
      programId,
      recordType: studyAbroad ? 'study_abroad' : 'education',
      isPrimary: index === 0,
      sourceLabel: row.university,
      qualification: programId
        ? { th: programs.find((program) => program.programId === programId).names.th.formal, en: programs.find((program) => program.programId === programId).names.en.formal }
        : { th: null, en: null },
      verificationStatus: sourceConflict ? 'source_conflict_unresolved' : 'owner_review_required',
      evidenceNote: sourceConflict
        ? 'คงค่าจากชีตเป็น CU CEDT; รายชื่อรับเข้าศึกษาของ KMITL ไม่ยืนยันการเข้าเรียนหรือมหาวิทยาลัยปัจจุบัน จึงยังไม่แก้ทับ'
        : studyAbroad
          ? 'ชีตระบุเพียงปีแลกเปลี่ยน ไม่ระบุหลักสูตรหรือวุฒิ จึงไม่เติมข้อมูลที่อนุมานเอง'
          : null
    });
  });
}

const institutionById = new Map(institutions.map((item) => [item.institutionId, item]));
const programById = new Map(programs.map((item) => [item.programId, item]));
for (const person of people) {
  const record = educationRecords.find((item) => item.personId === person.personId && item.isPrimary);
  if (!record) {
    person.educationDisplay = {
      mode: person.educationDisplayMode,
      card: { th: null, en: null },
      detail: { th: null, en: null },
      verificationStatus: 'owner_detail_required'
    };
    continue;
  }
  const institution = institutionById.get(record.institutionId);
  const program = record.programId ? programById.get(record.programId) : null;
  const cardTh = [program?.names.th.short, institution.names.th.short].filter(Boolean).join(' · ');
  const cardEn = [program?.names.en.short, institution.names.en.short].filter(Boolean).join(' · ');
  const detailTh = [program?.names.th.formal, institution.names.th.formal].filter(Boolean).join(' — ');
  const detailEn = [program?.names.en.formal, institution.names.en.formal].filter(Boolean).join(' — ');
  person.educationDisplay = {
    mode: person.educationDisplayMode,
    card: { th: cardTh || null, en: cardEn || null },
    detail: { th: detailTh || null, en: detailEn || null },
    verificationStatus: record.verificationStatus
  };
}

const engagementProgramNames = {
  FDI: { th: 'Full-stack Developer Intern, FDI', en: 'Full-stack Developer Intern, FDI' },
  MSI: { th: 'โครงการฝึกงาน Marketing Strategy', en: 'Marketing Strategy Internship' },
  PDI: { th: 'โครงการฝึกงาน Product Developer', en: 'Product Developer Internship' },
  PMI: { th: 'โครงการฝึกงาน Partnership Maker', en: 'Partnership Maker Internship' },
  IMP: { th: 'Impvest', en: 'Impvest' },
  'Full-time': { th: 'พนักงานประจำ', en: 'Full-time staff' },
  'Part-time': { th: 'พนักงานพาร์ตไทม์', en: 'Part-time staff' }
};

const engagementRoleNames = {
  'Full-Stack Developer Intern': { th: 'นักพัฒนา Full-Stack ฝึกงาน', en: 'Full-Stack Developer Intern' },
  'Marketing Strategy Intern': { th: 'นักศึกษาฝึกงานด้านกลยุทธ์การตลาด', en: 'Marketing Strategy Intern' },
  'Product Developer Intern': { th: 'นักพัฒนาผลิตภัณฑ์ฝึกงาน', en: 'Product Developer Intern' },
  'Partnership Maker Intern': { th: 'นักศึกษาฝึกงานด้านการสร้างพันธมิตร', en: 'Partnership Maker Intern' },
  'Consulting Partner': { th: 'ที่ปรึกษาพันธมิตร', en: 'Consulting Partner' },
  'Full-Stack Developer': { th: 'นักพัฒนา Full-Stack', en: 'Full-Stack Developer' },
  'Marketing Strategy': { th: 'กลยุทธ์การตลาด', en: 'Marketing Strategy' },
  'Product manager': { th: 'ผู้จัดการผลิตภัณฑ์', en: 'Product Manager' },
  'Platform manager': { th: 'ผู้จัดการแพลตฟอร์ม', en: 'Platform Manager' }
};

const sourceEngagementIdToEngagementId = new Map();
const engagements = engagementRows.map((row, index) => {
  const engagementId = 'E' + String(index + 1).padStart(4, '0');
  sourceEngagementIdToEngagementId.set(row.engagement_id, engagementId);
  const category = row.program === 'Full-time'
    ? 'full_time'
    : row.program === 'Part-time'
      ? 'part_time'
      : /Intern/i.test(row.role)
        ? 'internship'
        : 'program_participant';
  const personId = sourceIdToPersonId.get(row.person_id);
  const responsibilityWorkIds = [];
  if (row.person_id === 'LDM-P-001' && row.program === 'FDI') responsibilityWorkIds.push('work-citymeter-schools');
  if (row.person_id === 'LDM-P-001' && row.program === 'Full-time') responsibilityWorkIds.push('work-land-portfolio', 'work-lead2loan', 'work-fdi-mentoring');
  return {
    engagementId,
    personId,
    category,
    program: { code: row.program, names: engagementProgramNames[row.program] || { th: row.program, en: row.program } },
    cohortLabel: clean(row.cohort),
    roleTitle: engagementRoleNames[row.role] || { th: clean(row.role), en: clean(row.role) },
    start: parseDate(row.start),
    end: parseDate(row.end),
    status: String(row.status || '').toLowerCase() === 'ongoing' ? 'ongoing' : 'completed',
    responsibilityWorkIds,
    evidenceStatus: 'sheet_recorded',
    verificationStatus: clean(row.note) ? 'owner_review_required' : 'sheet_recorded',
    sequenceHint: row.person_id === 'LDM-P-001' && row.program === 'FDI' ? 1 : row.person_id === 'LDM-P-001' && row.program === 'Full-time' ? 3 : null
  };
});

const oatPartTimeEngagementId = 'E' + String(engagements.length + 1).padStart(4, '0');
engagements.push({
  engagementId: oatPartTimeEngagementId,
  personId: 'S0001',
  category: 'part_time',
  program: { code: 'Part-time', names: engagementProgramNames['Part-time'] },
  cohortLabel: 'Part-time (ช่วงหลัง FDI และก่อน Full-time; วันเริ่ม–สิ้นสุดรอยืนยัน)',
  roleTitle: { th: 'ผู้ดูแล Land Portfolio', en: 'Land Portfolio contributor' },
  start: null,
  end: null,
  status: 'completed',
  responsibilityWorkIds: ['work-land-portfolio'],
  evidenceStatus: 'owner_supplied',
  verificationStatus: 'dates_owner_detail_required',
  sequenceHint: 2
});

const personSortIndex = new Map(people.map((person, index) => [person.personId, index]));
engagements.sort((left, right) => {
  const personOrder = personSortIndex.get(left.personId) - personSortIndex.get(right.personId);
  if (personOrder) return personOrder;
  const leftSequence = left.sequenceHint ?? 100;
  const rightSequence = right.sequenceHint ?? 100;
  if (leftSequence !== rightSequence) return leftSequence - rightSequence;
  return (left.start || '9999').localeCompare(right.start || '9999') || left.engagementId.localeCompare(right.engagementId);
});

const workMap = new Map();
const workAliasMap = new Map();

const citymeterCatalogSlugs = new Map([
  ['work-citymeter-companies', 'dataset-registered-companies-status-capital'],
  ['work-citymeter-hotels', 'dataset-hotel-market'],
  ['work-citymeter-factories', 'dataset-factories-workers-investment'],
  ['work-citymeter-schools', 'dataset-schools-students-teachers'],
  ['work-citymeter-registered-cars', 'dataset-registered-cars'],
  ['work-citymeter-flood-recurrent', 'dataset-flood-recurrent'],
  ['work-citymeter-land-appraisal', 'dataset-land-appraisal'],
  ['work-citymeter-crop-area-output', 'dataset-crop-area-output'],
  ['work-citymeter-eia', 'dataset-eia-projects'],
  ['work-citymeter-municipal-revenue', 'dataset-municipal-revenue'],
  ['work-citymeter-roaddna', 'dataset-road-network-archetypes'],
  ['work-citymeter-tourism', 'dataset-tourism-demand-spending'],
  ['work-citymeter-fuel-stations', 'dataset-fuel-stations'],
  ['work-citymeter-flood-latest', 'dataset-flood-latest-observed'],
  ['work-citymeter-shopping-centers', 'dataset-shopping-centers'],
  ['work-citymeter-locale-insights', 'dataset-locale-insights'],
  ['work-citymeter-government-workforce', 'dataset-government-agencies-workforce'],
  ['work-citymeter-buildings', 'dataset-buildings'],
  ['work-citymeter-apartment-unresolved', 'dataset-apartment-rent'],
  ['work-citymeter-condo-offer-unresolved', 'dataset-condo-listing-prices'],
  ['work-citymeter-condo-rental-unresolved', 'dataset-condo-rent-yield'],
  ['work-citymeter-detached-house-unresolved', 'dataset-detached-listing-prices'],
  ['work-citymeter-land-offer-unresolved', 'dataset-land-listing-prices'],
  ['work-citymeter-office-unresolved', 'dataset-office-buildings-rent'],
  ['work-citymeter-quakesafe-unresolved', 'dataset-events-quake-building-inspection'],
  ['work-citymeter-road-traffic-unresolved', 'dataset-traffic-congestion-speed'],
  ['work-citymeter-townhouse-unresolved', 'dataset-townhouse-listing-prices']
]);

const productCatalogLinks = new Map([
  ['work-ijji', ['https://ijji.landometer.com/', 'exact_product']],
  ['work-safestreet', ['https://landometer.com/citystory/safestreet', 'exact_product']],
  ['work-citychat', ['https://montri-th.github.io/CityChat/', 'exact_product']],
  ['work-citywiki', ['https://landometer.com/v3/citywiki', 'exact_product']],
  ['work-citymeter-product-stewardship', ['https://montri-th.github.io/CityMETER/', 'exact_product']],
  ['work-brand-visual-guidelines-2025', ['https://montri-th.github.io/Landometer/', 'broader_catalog']],
  ['work-vote69', ['https://landometer.com/v3/vote69', 'exact_product']],
  ['work-landom-community', ['https://montri-th.github.io/Landom/', 'exact_product']],
  ['work-citymeter-fdi-playbook', ['https://montri-th.github.io/CityMETER/', 'broader_catalog']],
  ['work-citymeter-flood-forecasting-unresolved', ['https://montri-th.github.io/CityMETER/', 'broader_catalog']],
  ['work-locale-insight-intelligence-layer', ['https://montri-th.github.io/Landometer/#align', 'exact_product']],
  ['work-land-portfolio', ['https://landometer.com/intro/products#product-portfolio', 'exact_product']],
  ['work-lead2loan', ['https://landometer.com/intro/products#product-l2l', 'exact_product']]
]);

function workLinkFields(workId) {
  const citymeterSlug = citymeterCatalogSlugs.get(workId);
  if (citymeterSlug) {
    return {
      catalogUrl: {
        th: 'https://montri-th.github.io/CityMETER/?lang=th#' + citymeterSlug,
        en: 'https://montri-th.github.io/CityMETER/en/?lang=en#' + citymeterSlug
      },
      destinationUrl: null,
      linkEvidence: {
        linkScope: 'exact_module',
        sourceRef: 'official_citymeter_catalog_2026-08-23',
        evidenceUrl: null
      }
    };
  }
  const productLink = productCatalogLinks.get(workId);
  if (productLink) {
    const [url, linkScope] = productLink;
    return {
      catalogUrl: { th: url, en: url },
      destinationUrl: null,
      linkEvidence: {
        linkScope,
        sourceRef: 'owner_official_product_routes_2026-08-23',
        evidenceUrl: null
      }
    };
  }
  if (workId === 'work-citycell-model') {
    return {
      catalogUrl: { th: null, en: null },
      destinationUrl: null,
      linkEvidence: {
        linkScope: 'evidence_only',
        sourceRef: 'owner_official_product_routes_2026-08-23',
        evidenceUrl: 'https://www.facebook.com/TREASURYTHAI/posts/1089323533318360/'
      }
    };
  }
  return {
    catalogUrl: { th: null, en: null },
    destinationUrl: null,
    linkEvidence: {
      linkScope: 'unverified_no_link',
      sourceRef: null,
      evidenceUrl: null
    }
  };
}

function addWork(definition) {
  const work = {
    workId: definition.workId,
    parentProduct: definition.parentProduct,
    moduleSlug: definition.moduleSlug ?? null,
    names: definition.names,
    shortNames: definition.shortNames || definition.names,
    type: definition.type,
    scopeLayer: definition.scopeLayer,
    authorityStatus: definition.authorityStatus,
    evidenceNote: definition.evidenceNote || null,
    sourceAliases: definition.aliases || [],
    ...workLinkFields(definition.workId)
  };
  workMap.set(work.workId, work);
  for (const alias of work.sourceAliases) workAliasMap.set(alias, work.workId);
  return work;
}

const citymeterModules = [
  ['work-citymeter-companies', 'dataset-registered-companies-status-capital', 'บริษัทจดทะเบียน: สถานะและทุน', 'Registered Companies: Status & Capital', ['CityMETER : Company', 'CityMETER: Company']],
  ['work-citymeter-hotels', 'dataset-hotel-market', 'โรงแรม: จำนวนห้องพัก ราคา และฤดูกาล', 'Hotel Supply, Rates & Seasonality', ['CityMETER: Hotel']],
  ['work-citymeter-factories', 'dataset-factories-workers-investment', 'โรงงาน แรงงาน และการลงทุน', 'Factories, Workers & Investment', ['CityMETER : Factory', 'CityMETER: Factory']],
  ['work-citymeter-schools', 'dataset-schools-students-teachers', 'โรงเรียน นักเรียน และครู', 'Schools, Students & Teachers', ['CityMETER : School', 'CityMETER: School']],
  ['work-citymeter-registered-cars', 'dataset-registered-cars', 'รถยนต์จดทะเบียน', 'Registered Cars', ['CityMETER: Cars']],
  ['work-citymeter-flood-recurrent', 'dataset-flood-recurrent', 'น้ำท่วมซ้ำซาก', 'Flood: Recurrent', ['CityMETER: พื้นที่น้ำท่วมซ้ำซาก']],
  ['work-citymeter-land-appraisal', 'dataset-land-appraisal', 'ราคาประเมินที่ดินและโฉนด', 'Land Appraisal & Title Deeds', ['CityMETER : Land Appraisal', 'CityMETER: Land Appraisal']],
  ['work-citymeter-crop-area-output', 'dataset-crop-area-output', 'เกษตรกรรม: พื้นที่เพาะปลูกและผลผลิต (หมื่นไร่)', 'Agriculture: Crop Area & Output (10,000 Rai)', ['CityMETER: หมื่นไร่']],
  ['work-citymeter-eia', 'dataset-eia-projects', 'โครงการและรายงาน EIA', 'EIA Projects & Reports', ['CityMETER: EIA']],
  ['work-citymeter-municipal-revenue', 'dataset-municipal-revenue', 'รายได้องค์กรปกครองส่วนท้องถิ่น', 'Municipal Revenue', ['CityMETER: Municipal revenue']],
  ['work-citymeter-roaddna', 'dataset-road-network-archetypes', 'รูปแบบโครงข่ายถนน', 'Road Network Archetypes', ['CityMETER: RoadDNA']],
  ['work-citymeter-tourism', 'dataset-tourism-demand-spending', 'ความต้องการท่องเที่ยว: จำนวนนักท่องเที่ยวและค่าใช้จ่าย', 'Tourism Demand: Visitors & Spending', ['CityMETER: Tourism']],
  ['work-citymeter-fuel-stations', 'dataset-fuel-stations', 'สถานีบริการเชื้อเพลิง: จำนวน ความหนาแน่น และประเภทเชื้อเพลิง', 'Fuel Stations: Count, Density & Fuel Types', ['CityMETER: Gas station']],
  ['work-citymeter-flood-latest', 'dataset-flood-latest-observed', 'น้ำท่วมที่ตรวจพบล่าสุด', 'Flood: Latest Observed', ['CityMETER: Flood Recent']],
  ['work-citymeter-shopping-centers', 'dataset-shopping-centers', 'ศูนย์การค้า: จำนวน พื้นที่เช่า และกลุ่มตลาด', 'Shopping Centers: Supply, GLA & Market Segment', ['CityMETER: Shopping centers']],
  ['work-citymeter-locale-insights', 'dataset-locale-insights', 'Locale Insights: บริบทย่าน', 'Locale Insights', ['CityMETER: Locale insights']],
  ['work-citymeter-government-workforce', 'dataset-government-agencies-workforce', 'หน่วยงานรัฐและบุคลากร', 'Government Agencies & Workforce', ['CityMETER: Government agencies and workforces']],
  ['work-citymeter-buildings', 'dataset-buildings', 'อาคาร: ขอบเขต พื้นที่อาคารรวม และความสูง', 'Buildings: Footprint, GFA & Height', ['CityMETER: 3D Buildings']]
];
for (const [workId, moduleSlug, th, en, aliases] of citymeterModules) {
  addWork({
    workId,
    parentProduct: 'CityMETER',
    moduleSlug,
    names: { th, en },
    shortNames: { th, en },
    type: 'canonical_module',
    scopeLayer: 'product_specific',
    authorityStatus: 'aligned_to_citymeter_current_release',
    aliases
  });
}

const unresolvedCitymeter = [
  ['work-citymeter-apartment-unresolved', 'CityMETER: Apartment', ['CityMETER : Apartment']],
  ['work-citymeter-condo-offer-unresolved', 'CityMETER: Condo Offer', ['CityMETER : Condo Offer']],
  ['work-citymeter-condo-rental-unresolved', 'CityMETER: Condo Rental', ['CityMETER : Condo Rental']],
  ['work-citymeter-detached-house-unresolved', 'CityMETER: Detached House', ['CityMETER : Detached House']],
  ['work-citymeter-land-offer-unresolved', 'CityMETER: Land Offer', ['CityMETER : Land Offer']],
  ['work-citymeter-office-unresolved', 'CityMETER: Office', ['CityMETER : Office']],
  ['work-citymeter-quakesafe-unresolved', 'CityMETER: QuakeSafe', ['CityMETER : QuakeSafe']],
  ['work-citymeter-road-traffic-unresolved', 'CityMETER: Road Traffic', ['CityMETER : Road Traffic']],
  ['work-citymeter-townhouse-unresolved', 'CityMETER: Townhouse', ['CityMETER : Townhouse']]
];
for (const [workId, name, aliases] of unresolvedCitymeter) {
  addWork({
    workId,
    parentProduct: 'CityMETER',
    names: { th: name, en: name },
    type: 'module_name_unreconciled',
    scopeLayer: 'product_specific',
    authorityStatus: 'sheet_recorded_not_current_release_authority',
    evidenceNote: 'คงเป็นชื่อผลงานเฉพาะจากชีต; ยังไม่ยกเป็น canonical CityMETER module จนกว่าจะเทียบ release/schema เดียวกัน',
    aliases
  });
}

const additionalWorks = [
  ['work-ijji', 'ijji', { th: 'ijji', en: 'ijji' }, 'product', 'product_specific', ['ijji']],
  ['work-content-compass', 'Landometer', { th: 'ContentCompass', en: 'ContentCompass' }, 'internal_project', 'product_specific', ['ContentCompass']],
  ['work-kinnow', 'Landometer', { th: 'KinNow', en: 'KinNow' }, 'internal_project', 'product_specific', ['KinNow']],
  ['work-safestreet', 'SafeStreet', { th: 'SafeStreet', en: 'SafeStreet' }, 'product', 'product_specific', ['SafeStreet']],
  ['work-walkidio', 'Landometer', { th: 'Walkidio', en: 'Walkidio' }, 'internal_project', 'product_specific', ['Walkidio']],
  ['work-citychat', 'CityChat', { th: 'CityChat', en: 'CityChat' }, 'product', 'product_specific', ['CityChat']],
  ['work-gistda-flood-near-me', 'GISTDA Urban Flood', { th: 'GISTDA Urban Flood: น้ำท่วมใกล้ฉัน', en: 'GISTDA Urban Flood: Flood Near Me' }, 'partner_deliverable', 'partner_specific', []],
  ['work-citywiki', 'CityWiki', { th: 'CityWiki', en: 'CityWiki' }, 'product', 'product_specific', []],
  ['work-citymeter-product-stewardship', 'CityMETER', { th: 'การดูแลผลิตภัณฑ์ CityMETER', en: 'CityMETER Product Stewardship' }, 'product_stewardship', 'product_specific', []],
  ['work-brand-visual-guidelines-2025', 'Landometer', { th: 'Landometer: Brand Visual Guidelines 2025', en: 'Landometer: Brand Visual Guidelines 2025' }, 'brand_system', 'shared_landometer', ['Landometer Visual Guidlines (2025)']],
  ['work-vote69', 'Vote69', { th: 'Vote69', en: 'Vote69' }, 'product', 'product_specific', []],
  ['work-landom-community', 'Landom', { th: 'Landom: ด้อมผู้สร้าง Landometer', en: 'Landom: the Landometer community' }, 'community', 'shared_landometer', []],
  ['work-dwr-flood-map', 'DWR', { th: 'แผนที่น้ำท่วม DWR', en: 'DWR Flood Map' }, 'partner_deliverable', 'partner_specific', []],
  ['work-population-forecasting-research', 'Research', { th: 'งานวิจัยแบบจำลองคาดการณ์ประชากร', en: 'Research: Population Forecasting Model' }, 'research', 'product_specific', []],
  ['work-dwr-runoff', 'DWR', { th: 'DWR Runoff', en: 'DWR Runoff' }, 'partner_deliverable', 'partner_specific', []],
  ['work-citycell-model', 'CityCell', { th: 'โมเดล CityCell', en: 'CityCell Model' }, 'hackathon_deliverable', 'product_specific', []],
  ['work-cityscan', 'CityScan', { th: 'CityScan', en: 'CityScan' }, 'product_specific_deliverable', 'product_specific', []],
  ['work-citymeter-fdi-playbook', 'CityMETER', { th: 'CityMETER Playbook สำหรับ FDI', en: 'CityMETER Playbook for FDI' }, 'product_specific_deliverable', 'product_specific', []],
  ['work-citymeter-flood-forecasting-unresolved', 'CityMETER', { th: 'CityMETER: การคาดการณ์น้ำท่วม (รอระบุโมดูล)', en: 'CityMETER: Flood Forecasting (Module Pending)' }, 'module_name_unreconciled', 'product_specific', []],
  ['work-locale-insight-intelligence-layer', 'Landometer', { th: 'Locale Insight Intelligence Layer', en: 'Locale Insight Intelligence Layer' }, 'shared_capability', 'shared_landometer', []],
  ['work-land-portfolio', 'Landometer', { th: 'Land Portfolio', en: 'Land Portfolio' }, 'product_specific_deliverable', 'product_specific', []],
  ['work-lead2loan', 'Landometer', { th: 'Lead2Loan', en: 'Lead2Loan' }, 'product_specific_deliverable', 'product_specific', []],
  ['work-fdi-mentoring', 'Landometer', { th: 'การดูแลทีม FDI', en: 'FDI Team Mentoring' }, 'staff_responsibility', 'shared_landometer', []],
  ['work-contribution-details-pending', 'Landometer', { th: 'มีส่วนร่วมกับทีม — รอระบุรายละเอียดผลงาน', en: 'Team contribution — project details pending' }, 'administrative_placeholder', 'shared_landometer', []]
];
for (const [workId, parentProduct, names, type, scopeLayer, aliases] of additionalWorks) {
  const authorityStatus = workId === 'work-citymeter-flood-forecasting-unresolved'
    ? 'unresolved_between_official_forecast_modules'
    : workId === 'work-locale-insight-intelligence-layer'
      ? 'owner_supplied_shared_layer_claim_product_implementations_not_implied'
      : workId === 'work-contribution-details-pending'
        ? 'owner_detail_required'
        : 'owner_or_sheet_supplied_product_specific';
  const evidenceNote = workId === 'work-citymeter-flood-forecasting-unresolved'
    ? 'ยังไม่ map ไป DWR forecast-depth หรือ Google flash-flood risk เพราะหลักฐานไม่พอระบุว่าเป็นโมดูลใด'
    : workId === 'work-locale-insight-intelligence-layer'
      ? 'เป็น capability ใน shared Landometer layer; attribution รายบุคคลนี้ไม่ทำให้สมมติฐานของผลิตภัณฑ์หนึ่งเป็นข้อเท็จจริงของทุกผลิตภัณฑ์'
      : workId === 'work-contribution-details-pending'
        ? 'ใช้เพื่อยืนยันว่าไม่มีบุคคลใดมีผลงานเป็นศูนย์ โดยไม่แต่งชื่อโครงการ; เจ้าของข้อมูลต้องเติมรายละเอียดภายหลัง'
        : null;
  addWork({ workId, parentProduct, names, type, scopeLayer, authorityStatus, evidenceNote, aliases });
}

for (const engagement of engagements) {
  if (engagement.personId === 'P0001') engagement.responsibilityWorkIds = ['work-citychat'];
  if (engagement.personId === 'S0002' && engagement.category === 'full_time') engagement.responsibilityWorkIds = ['work-ijji'];
  if (engagement.personId === 'S0003' && engagement.category === 'full_time') engagement.responsibilityWorkIds = ['work-citymeter-product-stewardship'];
  if (engagement.personId === 'S0004') engagement.responsibilityWorkIds = ['work-citychat'];
}

const contributions = [];
function addContribution(definition) {
  const duplicate = contributions.find((item) =>
    item.personId === definition.personId &&
    item.workId === definition.workId &&
    item.engagementId === (definition.engagementId ?? null)
  );
  if (duplicate) {
    if (definition.evidenceStatus === 'owner_supplied') {
      duplicate.evidenceStatus = duplicate.evidenceStatus === 'sheet_recorded' ? 'owner_and_sheet_confirmed' : 'owner_supplied';
      duplicate.sourceRef = duplicate.sourceRef === 'google_sheet_snapshot_2026-08-23'
        ? 'google_sheet_snapshot_2026-08-23+owner_instruction_2026-08-23'
        : duplicate.sourceRef;
      duplicate.evidenceNote = definition.evidenceNote || duplicate.evidenceNote;
    }
    return duplicate;
  }
  const contribution = {
    contributionId: 'C' + String(contributions.length + 1).padStart(4, '0'),
    personId: definition.personId,
    workId: definition.workId,
    engagementId: definition.engagementId ?? null,
    role: definition.role || { th: 'ผู้มีส่วนร่วม', en: 'Contributor' },
    period: definition.period || { start: null, end: null, label: null },
    evidenceStatus: definition.evidenceStatus,
    sourceRef: definition.sourceRef,
    evidenceNote: definition.evidenceNote || null
  };
  contributions.push(contribution);
  return contribution;
}

for (const row of contributionRows) {
  const workId = workAliasMap.get(row.work_name);
  if (!workId) throw new Error('Unmapped raw contribution work: ' + row.work_name);
  const sourceRole = clean(row.role_in_work) || 'Contributor';
  addContribution({
    personId: sourceIdToPersonId.get(row.person_id),
    workId,
    engagementId: sourceEngagementIdToEngagementId.get(row.engagement_id) || null,
    role: sourceRole.toLowerCase() === 'contributor'
      ? { th: 'ผู้มีส่วนร่วม', en: 'Contributor' }
      : { th: sourceRole, en: sourceRole },
    period: parsePeriod(row.period),
    evidenceStatus: 'sheet_recorded',
    sourceRef: 'google_sheet_snapshot_2026-08-23',
    evidenceNote: clean(row.note)
  });
}

function findEngagementId(sourcePersonId, year, strictYear = false) {
  const personId = sourceIdToPersonId.get(sourcePersonId);
  const matches = engagements.filter((engagement) => engagement.personId === personId && engagement.engagementId !== oatPartTimeEngagementId);
  if (year) {
    const yearMatch = [...matches].reverse().find((engagement) =>
      engagement.start?.startsWith(String(year)) || engagement.cohortLabel?.includes(String(year))
    );
    if (yearMatch) return yearMatch.engagementId;
    if (strictYear) return null;
  }
  return matches.at(-1)?.engagementId || null;
}

const ownerContributions = [
  ['LDM-P-040', 'work-citymeter-companies', 2026],
  ['LDM-P-036', 'work-citymeter-hotels', 2026],
  ['LDM-P-002', 'work-citymeter-hotels', 2024],
  ['LDM-P-003', 'work-citymeter-factories', 2024],
  ['LDM-P-002', 'work-citymeter-factories', 2024],
  ['LDM-P-013', 'work-citymeter-factories', 2025],
  ['LDM-P-010', 'work-citymeter-schools', 2025],
  ['LDM-P-019', 'work-citymeter-registered-cars', 2025],
  ['LDM-P-019', 'work-citychat', 2025],
  ['LDM-P-019', 'work-gistda-flood-near-me', 2025],
  ['LDM-P-019', 'work-citymeter-flood-recurrent', 2025],
  ['LDM-P-006', 'work-citymeter-land-appraisal', 2025],
  ['LDM-P-006', 'work-citymeter-crop-area-output', 2025],
  ['LDM-P-006', 'work-gistda-flood-near-me', 2025],
  ['LDM-P-006', 'work-citymeter-eia', 2025],
  ['LDM-P-012', 'work-citymeter-eia', 2025],
  ['LDM-P-041', 'work-citymeter-municipal-revenue', 2026],
  ['LDM-P-041', 'work-citychat', 2026],
  ['LDM-P-031', 'work-ijji', 2026, true],
  ['LDM-P-032', 'work-ijji', 2026, true],
  ['LDM-P-022', 'work-ijji', 2026, true],
  ['LDM-P-030', 'work-ijji', 2026, true],
  ['LDM-P-022', 'work-safestreet', 2025],
  ['LDM-P-044', 'work-citymeter-roaddna', 2026],
  ['LDM-P-007', 'work-citymeter-product-stewardship', 2026, true],
  ['LDM-P-007', 'work-citywiki', 2026, true],
  ['LDM-P-047', 'work-citywiki', 2026, true],
  ['LDM-P-044', 'work-citywiki', 2026, true],
  ['LDM-P-021', 'work-brand-visual-guidelines-2025', 2025],
  ['LDM-P-033', 'work-vote69', 2026, true],
  ['LDM-P-033', 'work-citychat', 2026, true],
  ['LDM-P-048', 'work-citymeter-tourism', 2026, true],
  ['LDM-P-048', 'work-citymeter-fuel-stations', 2026, true],
  ['LDM-P-048', 'work-landom-community', 2026, true],
  ['LDM-P-037', 'work-citymeter-flood-latest', 2026, true],
  ['LDM-P-037', 'work-dwr-flood-map', 2026, true],
  ['LDM-P-030', 'work-population-forecasting-research', 2026, true],
  ['LDM-P-042', 'work-citymeter-shopping-centers', 2026, true],
  ['LDM-P-015', 'work-ijji', 2026, true],
  ['LDM-P-015', 'work-citymeter-locale-insights', 2025],
  ['LDM-P-043', 'work-citymeter-government-workforce', 2026, true],
  ['LDM-P-043', 'work-dwr-runoff', 2026, true],
  ['LDM-P-001', 'work-citycell-model', null],
  ['LDM-P-004', 'work-citycell-model', null],
  ['LDM-P-020', 'work-citycell-model', null],
  ['LDM-P-015', 'work-ijji', 2026, true],
  ['LDM-P-008', 'work-ijji', 2026, true],
  ['LDM-P-038', 'work-ijji', 2026, true],
  ['LDM-P-046', 'work-ijji', 2026, true],
  ['LDM-P-045', 'work-ijji', 2026, true],
  ['LDM-P-036', 'work-citychat', 2026, true],
  ['LDM-P-041', 'work-cityscan', 2026, true],
  ['LDM-P-035', 'work-citymeter-buildings', 2026, true],
  ['LDM-P-035', 'work-citymeter-fdi-playbook', 2026, true],
  ['LDM-P-039', 'work-citymeter-flood-forecasting-unresolved', 2026, true],
  ['LDM-P-039', 'work-locale-insight-intelligence-layer', 2026, true],
  ['LDM-P-039', 'work-ijji', 2026, true],
  ['LDM-P-004', 'work-citychat', null],
  ['LDM-P-005', 'work-ijji', null],
  ['LDM-P-034', 'work-citychat', 2026, true]
];

for (const [sourcePersonId, workId, year, strictYear = false] of ownerContributions) {
  addContribution({
    personId: sourceIdToPersonId.get(sourcePersonId),
    workId,
    engagementId: findEngagementId(sourcePersonId, year, strictYear),
    period: { start: null, end: null, label: year ? String(year) : null },
    evidenceStatus: 'owner_supplied',
    sourceRef: 'owner_instruction_2026-08-23',
    evidenceNote: workId === 'work-citymeter-shopping-centers'
      ? 'คำสั่งต้นทางรวม “shopping centers and venues”; canonical authority รองรับเฉพาะ Shopping Centers จึงไม่รวม venues และรอแยกขอบเขตภายหลัง'
      : null
  });
}

addContribution({
  personId: 'S0001',
  workId: 'work-citymeter-schools',
  engagementId: sourceEngagementIdToEngagementId.get('LDM-E-001'),
  period: { start: null, end: null, label: 'FDI 2024' },
  evidenceStatus: 'owner_supplied',
  sourceRef: 'owner_instruction_2026-08-23'
});
addContribution({
  personId: 'S0001',
  workId: 'work-land-portfolio',
  engagementId: oatPartTimeEngagementId,
  period: { start: null, end: null, label: 'Part-time; dates pending' },
  evidenceStatus: 'owner_supplied',
  sourceRef: 'owner_instruction_2026-08-23'
});
addContribution({
  personId: 'S0001',
  workId: 'work-land-portfolio',
  engagementId: sourceEngagementIdToEngagementId.get('LDM-E-031'),
  period: { start: null, end: null, label: 'Full-time; dates pending' },
  evidenceStatus: 'owner_supplied',
  sourceRef: 'owner_instruction_2026-08-23'
});
addContribution({
  personId: 'S0001',
  workId: 'work-lead2loan',
  engagementId: sourceEngagementIdToEngagementId.get('LDM-E-031'),
  period: { start: null, end: null, label: 'Full-time; dates pending' },
  evidenceStatus: 'owner_supplied',
  sourceRef: 'owner_instruction_2026-08-23'
});
addContribution({
  personId: 'S0001',
  workId: 'work-fdi-mentoring',
  engagementId: sourceEngagementIdToEngagementId.get('LDM-E-031'),
  period: { start: null, end: null, label: 'Full-time; dates pending' },
  evidenceStatus: 'owner_supplied',
  sourceRef: 'owner_instruction_2026-08-23'
});

for (const person of people) {
  if (contributions.some((item) => item.personId === person.personId)) continue;
  const latestEngagement = engagements.filter((item) => item.personId === person.personId).at(-1);
  addContribution({
    personId: person.personId,
    workId: 'work-contribution-details-pending',
    engagementId: latestEngagement?.engagementId || null,
    period: { start: null, end: null, label: null },
    evidenceStatus: 'owner_detail_required',
    sourceRef: 'owner_instruction_2026-08-23',
    evidenceNote: 'เจ้าของข้อมูลยืนยันว่าทุกคนมีอย่างน้อยหนึ่งผลงาน แต่ยังไม่มีหลักฐานพอระบุชื่อโครงการของบุคคลนี้'
  });
}

const works = [...workMap.values()];
// Recruitment messages in the supplied evidence only establish application intent.
// They are not public bios and do not support personality claims. Keep the public
// bio blank until the profile owner supplies or approves exact copy.
for (const person of people) {
  person.bio = { th: null, en: null, status: 'owner_pending', verificationStatus: 'owner_pending' };
}

const socialPlatforms = ['linkedin', 'github', 'gitlab', 'website', 'facebook', 'instagram', 'tiktok'];
const ownerAuthorizedSocialPlatforms = new Set(['linkedin', 'github']);
const socialOwnerApproval = {
  status: 'granted',
  approvedAt: '2026-08-23',
  scope: 'public_profile_link_only',
  sourceRef: 'owner_instruction_2026-08-23'
};
const socialProfiles = [];
for (const row of peopleRows) {
  const personId = sourceIdToPersonId.get(row.person_id);
  const person = people.find((item) => item.personId === personId);
  const publicCandidates = {
    linkedin: clean(row.linkedin_url),
    github: clean(row.github_url),
    gitlab: clean(row.gitlab_url),
    website: clean(row.website_url),
    facebook: null,
    instagram: null,
    tiktok: null
  };
  for (const platform of socialPlatforms) {
    const candidate = publicCandidates[platform];
    const ownerAuthorized = Boolean(candidate) && ownerAuthorizedSocialPlatforms.has(platform);
    const verificationStatus = ownerAuthorized ? 'verified' : candidate ? 'owner_review_required' : 'missing';
    const consentStatus = person.publication.consentStatus;
    const publicationBasis = ownerAuthorized ? 'owner_authorized_public_profile_link' : null;
    const ownerApproval = ownerAuthorized ? socialOwnerApproval : null;
    const publishable = Boolean(candidate) && verificationStatus === 'verified' && (
      consentStatus === 'granted' || publicationBasis === 'owner_authorized_public_profile_link'
    );
    socialProfiles.push({
      socialProfileId: 'SOC-' + personId + '-' + platform.toUpperCase(),
      personId,
      platform,
      publicUrl: publishable ? candidate : null,
      candidateStatus: candidate ? 'candidate_present' : 'candidate_missing',
      candidateValueEmitted: false,
      verificationStatus,
      consentStatus,
      publicationBasis,
      ownerApproval,
      publicationStatus: publishable
        ? 'publishable'
        : !candidate
          ? 'withheld_pending_candidate'
          : consentStatus !== 'granted' && publicationBasis !== 'owner_authorized_public_profile_link'
            ? 'withheld_pending_consent'
            : 'withheld_pending_verification',
      dataBoundary: 'private_candidates_not_emitted'
    });
  }
}

const portraitInventoryPath = path.join(root, 'data/approved/portrait-assets.json');
const portraitInventory = fs.existsSync(portraitInventoryPath)
  ? JSON.parse(fs.readFileSync(portraitInventoryPath, 'utf8'))
  : { assets: [] };
const portraitByPersonId = new Map();
for (const portrait of portraitInventory.assets ?? []) {
  if (!people.some((person) => person.personId === portrait.personId)) {
    throw new Error('Approved portrait references unknown person: ' + portrait.personId);
  }
  if (portraitByPersonId.has(portrait.personId)) throw new Error('Duplicate approved portrait for ' + portrait.personId);
  if (!/^public\/assets\/people\/[SPI]\d{4}\.(?:jpe?g|png|webp)$/i.test(portrait.publicPath)) {
    throw new Error('Approved portrait path is outside the governed people asset directory: ' + portrait.publicPath);
  }
  const portraitPath = path.join(root, portrait.publicPath);
  if (!fs.existsSync(portraitPath)) throw new Error('Approved portrait file is missing: ' + portrait.publicPath);
  const digest = createHash('sha256').update(fs.readFileSync(portraitPath)).digest('hex');
  if (digest !== portrait.sha256) throw new Error('Approved portrait hash mismatch: ' + portrait.publicPath);
  portraitByPersonId.set(portrait.personId, portrait);
}

const assets = people.map((person) => {
  const approved = portraitByPersonId.get(person.personId);
  return {
    assetId: 'PORTRAIT-' + person.personId,
    personId: person.personId,
    kind: 'profile_portrait',
    publicPath: approved?.publicPath ?? null,
    sourceUrl: null,
    alt: {
      th: 'ภาพโปรไฟล์ของ' + (person.names.card.th || person.personId),
      en: 'Profile portrait of ' + (person.names.card.en || person.personId)
    },
    candidateStatus: approved ? 'candidate_present' : 'source_needed',
    verificationStatus: approved ? 'verified' : 'missing',
    consentStatus: person.publication.consentStatus,
    rightsStatus: approved ? 'cleared' : 'pending',
    publicationBasis: approved?.publicationBasis ?? null,
    ownerApproval: approved?.ownerApproval ?? null,
    publicationStatus: approved ? 'publishable' : 'withheld_pending_rights_consent_and_verification',
    sha256: approved?.sha256 ?? null,
    mediaType: approved?.mime ?? null,
    bytes: approved?.bytes ?? null,
    identityVerificationEvidence: approved?.identityVerification ?? null
  };
});

const achievements = [
  {
    achievementId: 'A0001',
    title: {
      th: 'รางวัลชนะเลิศ Hack Land Value Hackathon ด้วยโมเดล CityCell',
      en: 'Winner, Hack Land Value Hackathon, with the CityCell model'
    },
    result: { th: 'ชนะเลิศ', en: 'Winner' },
    organizer: { th: 'กรมธนารักษ์', en: 'The Treasury Department, Thailand' },
    awardedOn: null,
    dateVerificationStatus: 'owner_detail_required',
    recipientPersonIds: ['S0001', 'P0001', 'I0016'],
    workId: 'work-citycell-model',
    evidenceStatus: 'owner_supplied_with_public_source',
    evidenceUrl: 'https://www.facebook.com/TREASURYTHAI/posts/1089323533318360/',
    evidenceNote: 'คำสั่งเจ้าของข้อมูลระบุผู้รับรางวัล โอ๊ต เสก และมุก (Pitcha); วันมอบรางวัลยังไม่ยืนยันในชุดข้อมูลนี้'
  }
];

const copy = {
  brand: {
    brandName: 'Landometer',
    communityName: 'Landom',
    communityMemberNames: { th: ['ชาว Landom', 'ชาวแลนด้อม'], en: ['Landom community members'] },
    tagline: {
      th: 'แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น',
      en: 'A community for people who want to understand cities and help make them better.'
    },
    status: 'owner_approved_current_truth'
  }
};

const meta = {
  schemaVersion: '1.1.0',
  generatedAt: '2026-08-23T00:00:00+07:00',
  source: {
    spreadsheetId: snapshot.source.spreadsheetId,
    snapshotFetchedAt: snapshot.source.fetchedAt,
    publicSheetsUsed: ['people_registry', 'engagements', 'contributions'],
    privateContactSourcesExcluded: true,
    exclusionReason: 'Private contact input must never be ingested into or emitted by public builds.'
  },
  personIdPolicy: {
    version: '1.0',
    migrationDate,
    patterns: { fullTimeAtMigration: '^S\\d{4}$', partTimeAtMigration: '^P\\d{4}$', otherAtMigration: '^I\\d{4}$' },
    frozenAfterMigration: true,
    futureRoleChangesNeverChangePersonId: true
  },
  evidenceBoundary: {
    localeInsight: 'Portfolio methodology and shared product architecture may span Land, Location and Living, but a product-specific implementation is not evidence for every Landometer product.',
    crossProductComparison: 'Compare only records produced under the same schema/release, otherwise state incompatibility.',
    socialAndPortraits: 'A public profile link may be published after exact identity verification under either recorded individual consent or the owner-authorized public-link basis. A portrait may be published only after exact identity verification, cleared publication rights and either recorded individual consent or the owner-authorized public-portrait basis. Neither owner-authorized basis is individual consent.'
  },
  counts: {
    people: people.length,
    engagements: engagements.length,
    educationRecords: educationRecords.length,
    works: works.length,
    contributions: contributions.length,
    achievements: achievements.length
  }
};

const siteData = {
  meta,
  copy,
  institutions,
  programs,
  educationRecords,
  people,
  engagements,
  works,
  contributions,
  achievements,
  socialProfiles,
  assets
};

writeSiteDataFiles(siteData);

console.log('Normalized ' + people.length + ' people, ' + engagements.length + ' engagements, ' + contributions.length + ' contributions.');
