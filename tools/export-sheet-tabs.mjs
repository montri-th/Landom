import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNormalizedSheetSnapshot, sheetRows } from './normalized-sheet-roundtrip.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1]) throw new Error(name + ' requires a path.');
  return path.resolve(root, args[index + 1]);
}
const optionValueIndexes = new Set();
for (const name of ['--snapshot', '--site-data', '--output']) {
  const index = args.indexOf(name);
  if (index >= 0) optionValueIndexes.add(index + 1);
}
const requestedTab = args.find((arg, index) => !arg.startsWith('--') && !optionValueIndexes.has(index));
const sitePath = option('--site-data', path.join(root, 'data/generated/site-data.json'));
const snapshotPath = option('--snapshot', path.join(root, 'data/raw/google-sheet-snapshot.json'));
const outputPath = option('--output', null);
const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
const normalizedInput = isNormalizedSheetSnapshot(snapshot);

function objects(rows) {
  const [headers, ...body] = rows;
  return body.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
}

function text(value) {
  return value == null ? '' : String(value);
}

function locale(value, locale = 'th') {
  return text(value?.[locale] ?? value?.en ?? value?.th);
}

function joined(values) {
  return (values ?? []).filter(Boolean).join(' | ');
}

function tab(headers, rows, options = {}) {
  return {
    headers,
    rows: rows.map((row) => headers.map((header) => rewriteLegacyPersonIds(row[header] ?? ''))),
    frozenRows: 1,
    filter: options.filter !== false,
    columnWidths: options.columnWidths ?? {},
    validations: options.validations ?? {}
  };
}

const rawPeople = sheetRows(snapshot, 'people_registry');
const rawContacts = sheetRows(snapshot, 'contacts_internal');
const rawSocial = sheetRows(snapshot, 'social_profiles');
const rawAssets = sheetRows(snapshot, 'assets');
const rawPeopleByOldId = new Map(rawPeople.map((person) => [person.person_id, person]));
const rawContactsByOldId = new Map(rawContacts.map((contact) => [contact.person_id, contact]));
const rawSocialByKey = new Map(rawSocial.map((social) => [social.person_id + '|' + String(social.platform).toLowerCase(), social]));
const rawAssetsById = new Map(rawAssets.map((asset) => [asset.asset_id, asset]));

const fullTimeIds = new Set(['LDM-P-001', 'LDM-P-005', 'LDM-P-007', 'LDM-P-034']);
const partTimeIds = new Set(['LDM-P-004']);
const sourceIdToCanonical = new Map();
let staffNumber = 0;
let partTimeNumber = 0;
let internNumber = 0;

for (const person of rawPeople) {
  if (normalizedInput) {
    if (!/^[SPI]\d{4}$/.test(person.person_id)) throw new Error('Invalid canonical person_id in normalized snapshot: ' + person.person_id);
    sourceIdToCanonical.set(person.person_id, person.person_id);
  } else {
    const next = fullTimeIds.has(person.person_id)
      ? 'S' + String(++staffNumber).padStart(4, '0')
      : partTimeIds.has(person.person_id)
        ? 'P' + String(++partTimeNumber).padStart(4, '0')
        : 'I' + String(++internNumber).padStart(4, '0');
    sourceIdToCanonical.set(person.person_id, next);
  }
}

// Prose in source_note predates the current source IDs and refers to person_id_v1.
// Keep this map separate so a recycled numeric source ID cannot resolve to the wrong person.
const oldToCanonical = new Map();
for (const person of rawPeople) {
  const legacyId = text(person.person_id_v1);
  const canonicalId = sourceIdToCanonical.get(person.person_id);
  if (!legacyId || !canonicalId) continue;
  const existing = oldToCanonical.get(legacyId);
  if (existing && existing !== canonicalId) throw new Error('Ambiguous person_id_v1 mapping for ' + legacyId);
  oldToCanonical.set(legacyId, canonicalId);
}

function rewriteLegacyPersonIds(value) {
  if (value == null) return '';
  if (typeof value !== 'string') return value;
  return value.replace(/LDM-P-\d+/g, (legacyId) => {
    const canonicalId = oldToCanonical.get(legacyId);
    if (!canonicalId) throw new Error('Unknown legacy person ID in exporter-facing content: ' + legacyId);
    return canonicalId;
  });
}

const canonicalToOld = new Map([...sourceIdToCanonical].map(([sourceId, canonicalId]) => [canonicalId, sourceId]));
const educationByPerson = new Map(site.educationRecords.map((record) => [record.personId, record]));
const worksById = new Map(site.works.map((work) => [work.workId, work]));
const statementIdFor = (person) => person.bio?.th && person.bio?.en ? 'STAT-' + person.personId + '-001' : '';

const peopleRows = site.people.map((person) => {
  const oldId = canonicalToOld.get(person.personId);
  const source = rawPeopleByOldId.get(oldId) ?? {};
  const education = educationByPerson.get(person.personId);
  return {
    person_id: person.personId,
    full_name_th: person.names.full.th,
    full_name_en: person.names.full.en,
    nickname_th: person.names.nickname.th,
    nickname_en: person.names.nickname.en,
    current_status: person.currentStatus,
    migration_classification: person.migrationClassification,
    first_joined: person.firstJoined,
    education_record_id: education?.educationRecordId,
    education_display_mode: person.educationDisplayMode,
    card_education_th: person.educationDisplay.card.th,
    card_education_en: person.educationDisplay.card.en,
    detail_education_th: person.educationDisplay.detail.th,
    detail_education_en: person.educationDisplay.detail.en,
    bio_th: person.bio.th,
    bio_en: person.bio.en,
    bio_status: person.bio.status,
    bio_verification_status: person.bio.verificationStatus,
    consent_public: person.publication.consentStatus,
    profile_status: person.publication.profileStatus,
    verification_status: person.dataQuality.profileVerificationStatus,
    source_note: rewriteLegacyPersonIds(source.source_note),
    bio_publication_basis: person.bio.publicationBasis,
    bio_source_basis: person.bio.sourceBasis,
    bio_review_status: person.bio.reviewStatus,
    bio_owner_approval_status: person.bio.ownerApproval?.status,
    bio_owner_approved_at: person.bio.ownerApproval?.approvedAt,
    bio_owner_approval_scope: person.bio.ownerApproval?.scope,
    bio_owner_approval_source_ref: person.bio.ownerApproval?.sourceRef,
    current_statement_id: statementIdFor(person),
    bio_source_type: person.bio.sourceType,
    bio_source_ref: person.bio.sourceRef,
    bio_author_role: person.bio.authorRole,
    bio_derivation_method: person.bio.derivationMethod,
    bio_evidence_scope: person.bio.evidenceScope,
    bio_evidence_confidence: person.bio.evidenceConfidence
  };
});

const profileStatementRows = site.people
  .filter((person) => statementIdFor(person))
  .map((person) => ({
    statement_id: statementIdFor(person),
    person_id: person.personId,
    statement_kind: 'personal_objective_and_work_style',
    text_th: person.bio.th,
    text_en: person.bio.en,
    source_language: person.bio.sourceType === 'first_person_application'
      ? 'preserved_in_private_source'
      : 'not_applicable_bilingual_factual_synthesis',
    source_type: person.bio.sourceType,
    source_ref: person.bio.sourceRef,
    author_role: person.bio.authorRole,
    derivation_method: person.bio.derivationMethod,
    evidence_scope: person.bio.evidenceScope,
    evidence_confidence: person.bio.evidenceConfidence,
    owner_approval_status: person.bio.ownerApproval?.status,
    owner_approval_source_ref: person.bio.ownerApproval?.sourceRef,
    person_review_status: person.bio.reviewStatus,
    consent_status: person.publication.consentStatus,
    publication_status: person.bio.status,
    supersedes_statement_id: '',
    effective_from: person.bio.ownerApproval?.approvedAt,
    reviewed_at: '',
    publication_basis: person.bio.publicationBasis,
    source_basis: person.bio.sourceBasis,
    owner_approval_scope: person.bio.ownerApproval?.scope
  }));

const engagementRows = site.engagements.map((engagement) => ({
  engagement_id: engagement.engagementId,
  person_id: engagement.personId,
  category: engagement.category,
  program_code: engagement.program.code,
  program_name_th: engagement.program.names.th,
  program_name_en: engagement.program.names.en,
  cohort: engagement.cohortLabel,
  role_th: engagement.roleTitle.th,
  role_en: engagement.roleTitle.en,
  responsibility_work_ids: joined(engagement.responsibilityWorkIds),
  start: engagement.start,
  end: engagement.end,
  status: engagement.status,
  evidence_status: engagement.evidenceStatus,
  verification_status: engagement.verificationStatus,
  sequence_hint: engagement.sequenceHint,
  academic_placement_type: engagement.academicPlacementType
}));

const institutionRows = site.institutions.map((institution) => ({
  institution_id: institution.institutionId,
  official_name_th: institution.names.th.formal,
  official_name_en: institution.names.en.formal,
  short_name_th: institution.names.th.short,
  short_name_en: institution.names.en.short,
  aliases: joined(institution.aliases),
  verification_status: institution.verificationStatus
}));

const institutionIdsByProgram = new Map();
for (const education of site.educationRecords) {
  if (!education.programId || !education.institutionId) continue;
  const ids = institutionIdsByProgram.get(education.programId) ?? new Set();
  ids.add(education.institutionId);
  institutionIdsByProgram.set(education.programId, ids);
}

const programRows = site.programs.map((program) => ({
  program_id: program.programId,
  institution_ids: joined([...(institutionIdsByProgram.get(program.programId) ?? [])]),
  official_name_th: program.names.th.formal,
  official_name_en: program.names.en.formal,
  short_name_th: program.names.th.short,
  short_name_en: program.names.en.short,
  qualification_level: program.qualificationLevel,
  verification_status: program.verificationStatus
}));

const educationRows = site.educationRecords.map((education) => ({
  education_record_id: education.educationRecordId,
  person_id: education.personId,
  institution_id: education.institutionId,
  program_id: education.programId,
  record_type: education.recordType,
  is_primary: education.isPrimary,
  qualification_th: education.qualification.th,
  qualification_en: education.qualification.en,
  source_label: education.sourceLabel,
  verification_status: education.verificationStatus,
  evidence_note: education.evidenceNote,
  degree_abbreviation_th: education.degree?.abbreviation?.th,
  degree_abbreviation_en: education.degree?.abbreviation?.en,
  degree_title_th: education.degree?.title?.th,
  degree_title_en: education.degree?.title?.en,
  degree_field_th: education.degree?.field?.th,
  degree_field_en: education.degree?.field?.en,
  degree_award_status: education.degree?.awardStatus,
  degree_personal_award_verified: education.degree?.personalAwardVerified,
  degree_program_evidence_url: education.degree?.programEvidenceUrl,
  degree_evidence_scope: education.degree?.evidenceScope
}));

const workRows = site.works.map((work) => ({
  work_id: work.workId,
  parent_product: work.parentProduct,
  module_slug: work.moduleSlug,
  canonical_name_th: work.names.th,
  canonical_name_en: work.names.en,
  short_name_th: work.shortNames.th,
  short_name_en: work.shortNames.en,
  type: work.type,
  scope_layer: work.scopeLayer,
  authority_status: work.authorityStatus,
  source_aliases: joined(work.sourceAliases),
  evidence_note: work.evidenceNote,
  catalog_url_th: work.catalogUrl?.th,
  catalog_url_en: work.catalogUrl?.en,
  destination_url: work.destinationUrl,
  link_scope: work.linkEvidence?.linkScope,
  url_source_ref: work.linkEvidence?.sourceRef,
  link_evidence_url: work.linkEvidence?.evidenceUrl
}));

const contributionRows = site.contributions.map((contribution) => ({
  contribution_id: contribution.contributionId,
  person_id: contribution.personId,
  work_id: contribution.workId,
  engagement_id: contribution.engagementId,
  role_th: contribution.role.th,
  role_en: contribution.role.en,
  period_start: contribution.period.start,
  period_end: contribution.period.end,
  period_label: contribution.period.label,
  evidence_status: contribution.evidenceStatus,
  source_ref: contribution.sourceRef,
  evidence_note: contribution.evidenceNote
}));

const achievementRows = site.achievements.map((achievement) => ({
  achievement_id: achievement.achievementId,
  title_th: achievement.title.th,
  title_en: achievement.title.en,
  result_th: achievement.result.th,
  result_en: achievement.result.en,
  organizer_th: achievement.organizer.th,
  organizer_en: achievement.organizer.en,
  awarded_on: achievement.awardedOn,
  date_verification_status: achievement.dateVerificationStatus,
  work_id: achievement.workId,
  evidence_status: achievement.evidenceStatus,
  evidence_url: achievement.evidenceUrl,
  evidence_note: achievement.evidenceNote
}));

const personAchievementRows = site.achievements.flatMap((achievement) =>
  achievement.recipientPersonIds.map((personId, index) => ({
    person_achievement_id: achievement.achievementId + '-' + String(index + 1).padStart(2, '0'),
    achievement_id: achievement.achievementId,
    person_id: personId
  }))
);

function candidateFor(personId, platform) {
  if (normalizedInput) return rawSocialByKey.get(personId + '|' + platform)?.candidate_url_or_handle ?? '';
  const oldId = canonicalToOld.get(personId);
  const person = rawPeopleByOldId.get(oldId) ?? {};
  const contact = rawContactsByOldId.get(oldId) ?? {};
  if (platform === 'linkedin') return person.linkedin_url;
  if (platform === 'github') return person.github_url;
  if (platform === 'gitlab') return person.gitlab_url;
  if (platform === 'website') return person.website_url;
  if (platform === 'instagram') return contact.instagram;
  if (platform === 'facebook') return contact.facebook;
  if (platform === 'tiktok') return contact.tiktok;
  return '';
}

const socialRows = site.socialProfiles.map((social) => {
  const privateSource = rawSocialByKey.get(social.personId + '|' + social.platform) ?? {};
  return {
    social_profile_id: social.socialProfileId,
    person_id: social.personId,
    platform: social.platform,
    candidate_url_or_handle: candidateFor(social.personId, social.platform),
    public_url: social.publicUrl,
    candidate_status: social.candidateStatus,
    verification_status: social.verificationStatus,
    consent_status: social.consentStatus,
    publication_basis: social.publicationBasis,
    owner_approval_status: social.ownerApproval?.status,
    owner_approved_at: social.ownerApproval?.approvedAt,
    owner_approval_scope: social.ownerApproval?.scope,
    owner_approval_source_ref: social.ownerApproval?.sourceRef,
    publication_status: social.publicationStatus,
    source_note: privateSource.source_note ?? social.dataBoundary
  };
});

const assetRows = site.assets.map((asset) => {
  const privateSource = rawAssetsById.get(asset.assetId) ?? {};
  return {
    asset_id: asset.assetId,
    person_id: asset.personId,
    kind: asset.kind,
    public_path: asset.publicPath ?? privateSource.public_path ?? '',
    source_url: privateSource.source_url ?? asset.sourceUrl ?? '',
    alt_th: asset.alt.th,
    alt_en: asset.alt.en,
    candidate_status: asset.candidateStatus,
    verification_status: asset.verificationStatus,
    consent_status: asset.consentStatus,
    rights_status: asset.rightsStatus,
    publication_basis: asset.publicationBasis,
    owner_approval_status: asset.ownerApproval?.status,
    owner_approved_at: asset.ownerApproval?.approvedAt,
    owner_approval_scope: asset.ownerApproval?.scope,
    owner_approval_source_ref: asset.ownerApproval?.sourceRef,
    publication_status: asset.publicationStatus,
    sha256: privateSource.sha256 ?? asset.sha256 ?? '',
    media_type: asset.mediaType ?? '',
    bytes: asset.bytes ?? '',
    identity_verification_evidence: asset.identityVerificationEvidence ?? '',
    permission_record_id: privateSource.permission_record_id ?? '',
    crop_focal_point: privateSource.crop_focal_point ?? '',
    credit: privateSource.credit ?? ''
  };
});

const contactRows = rawContacts.map((contact) => ({
  ...contact,
  person_id: sourceIdToCanonical.get(contact.person_id) ?? contact.person_id
}));
const contactHeaders = contactRows.length
  ? Object.keys(contactRows[0])
  : ['person_id', 'name', 'email', 'phone', 'line_id', 'discord', 'instagram', 'facebook', 'tiktok', 'cv_file_ids', 'note'];

const aliasRows = [
  ...site.institutions.flatMap((institution) => (institution.aliases ?? []).map((alias) => ({
    alias_type: 'institution',
    canonical_id: institution.institutionId,
    alias,
    note: 'source label'
  }))),
  ...site.works.flatMap((work) => (work.sourceAliases ?? []).map((alias) => ({
    alias_type: 'work',
    canonical_id: work.workId,
    alias,
    note: work.authorityStatus
  })))
];

const enumRows = [
  ['person.current_status', 'active', 'กำลังร่วมงาน', 'Active'],
  ['person.current_status', 'alumni', 'ศิษย์เก่า/ผู้เคยร่วมงาน', 'Alumni'],
  ['person.migration_classification', 'full_time', 'พนักงานประจำ ณ วันย้ายระบบ', 'Full-time at migration'],
  ['person.migration_classification', 'part_time', 'พนักงานพาร์ตไทม์ ณ วันย้ายระบบ', 'Part-time at migration'],
  ['person.migration_classification', 'intern_or_program_participant', 'ผู้ฝึกงานหรือผู้ร่วมโปรแกรม ณ วันย้ายระบบ', 'Intern or program participant at migration'],
  ['engagement.status', 'ongoing', 'กำลังดำเนินอยู่', 'Ongoing'],
  ['engagement.status', 'completed', 'สิ้นสุดแล้ว', 'Completed'],
  ['engagement.academic_placement_type', 'cooperative_education', 'สหกิจศึกษา', 'Cooperative education'],
  ['engagement.academic_placement_type', 'internship', 'ฝึกงาน', 'Internship'],
  ['engagement.academic_placement_type', 'not_applicable', 'ไม่ใช่ช่วงฝึกงาน/สหกิจศึกษา', 'Not applicable'],
  ['consent', 'granted', 'ได้รับความยินยอม', 'Granted'],
  ['consent', 'pending', 'รอยืนยัน', 'Pending'],
  ['consent', 'denied', 'ไม่อนุญาต', 'Denied'],
  ['verification', 'owner_review_required', 'รอเจ้าของข้อมูลตรวจยืนยัน', 'Owner review required'],
  ['verification', 'verified', 'ยืนยันตัวบุคคลแล้ว', 'Verified'],
  ['verification', 'rejected', 'ตรวจแล้วไม่ใช่/ไม่ใช้รายการนี้', 'Rejected'],
  ['verification', 'missing', 'ยังไม่มี candidate', 'Missing'],
  ['rights', 'cleared', 'สิทธิการเผยแพร่ครบ', 'Cleared'],
  ['rights', 'pending', 'รอตรวจสิทธิ', 'Pending'],
  ['rights', 'denied', 'ไม่มีสิทธิใช้', 'Denied'],
  ['rights', 'revoked', 'ถอนสิทธิแล้ว', 'Revoked'],
  ['candidate.social', 'candidate_present', 'มี candidate ใน private source', 'Private candidate present'],
  ['candidate.social', 'candidate_missing', 'ยังไม่มี candidate', 'Candidate missing'],
  ['candidate.asset', 'candidate_present', 'มี asset candidate ใน private source', 'Private asset candidate present'],
  ['candidate.asset', 'source_needed', 'ต้องหา asset source', 'Asset source needed'],
  ['publication_basis.social', 'individual_consent', 'ได้รับความยินยอมจากเจ้าตัว', 'Individual consent'],
  ['publication_basis.social', 'owner_authorized_public_profile_link', 'เจ้าของ directory อนุมัติลิงก์ public profile', 'Owner-authorized public profile link'],
  ['publication_basis.asset', 'individual_consent', 'ได้รับความยินยอมจากเจ้าตัว', 'Individual consent'],
  ['publication_basis.asset', 'owner_authorized_public_profile_portrait', 'เจ้าของ directory อนุมัติ portrait จาก public profile', 'Owner-authorized public profile portrait'],
  ['owner_approval.status', 'granted', 'เจ้าของ directory อนุมัติขอบเขตนี้', 'Owner approval granted for this scope'],
  ['publication.social', 'publishable', 'ผ่าน gate และเผยแพร่ได้', 'Publishable'],
  ['publication.social', 'withheld_pending_candidate', 'ยังไม่มี candidate สำหรับเผยแพร่', 'Withheld pending candidate'],
  ['publication.social', 'withheld_pending_consent', 'รอความยินยอม', 'Withheld pending consent'],
  ['publication.social', 'withheld_pending_verification', 'รอการยืนยันตัวบุคคล', 'Withheld pending verification'],
  ['publication.social', 'withdrawn', 'ถอนออกจากการเผยแพร่', 'Withdrawn'],
  ['publication.asset', 'publishable', 'ผ่านทุก gate และเผยแพร่ได้', 'Publishable'],
  ['publication.asset', 'withheld_pending_rights_consent_and_verification', 'รอสิทธิ ความยินยอม หรือการยืนยัน', 'Withheld pending rights, consent, or verification'],
  ['publication.asset', 'withdrawn', 'ถอนออกจากการเผยแพร่', 'Withdrawn'],
  ['bio.status', 'owner_pending', 'เว้นว่างรอเจ้าตัวส่งหรือยืนยันข้อความ', 'Blank pending profile-owner copy'],
  ['bio.status', 'source_backed_placeholder', 'ข้อความตั้งต้นจากคำตอบของเจ้าตัว รอวิดีโอยืนยัน', 'Source-backed placeholder pending video review'],
  ['bio.status', 'owner_approved', 'เจ้าตัวยืนยันแล้ว', 'Owner approved'],
  ['bio.publication_basis', 'owner_authorized_paraphrase_from_first_person_application', 'เจ้าของ directory อนุมัติข้อความที่ถอดความจากคำตอบ first-person', 'Owner-authorized paraphrase from a first-person application'],
  ['bio.publication_basis', 'owner_authorized_synthesis_from_roster_evidence', 'เจ้าของ directory อนุมัติ factual fallback จากหลักฐาน roster', 'Owner-authorized factual fallback from roster evidence'],
  ['bio.source_basis', 'first_person_application_exact_roster_match', 'คำตอบ first-person จับคู่ core roster แบบ exact', 'First-person application with exact core-roster match'],
  ['bio.source_basis', 'factual_role_education_and_work_evidence', 'ข้อมูลบทบาท การศึกษา และผลงานที่ยืนยันแล้ว', 'Factual role, education, and verified-work evidence'],
  ['bio.review_status', 'pending_owner_copy', 'รอข้อความจากเจ้าตัว', 'Pending owner copy'],
  ['bio.review_status', 'pending_candidate_video_review', 'รอทบทวนจากวิดีโอของเจ้าตัว', 'Pending candidate video review'],
  ['bio.review_status', 'owner_approved', 'เจ้าตัวยืนยันแล้ว', 'Owner approved'],
  ['profile_statement.publication_status', 'source_backed_placeholder', 'เผยแพร่เป็นข้อความตั้งต้นที่มีหลักฐานและ owner authorization', 'Published as an evidenced, owner-authorized placeholder'],
  ['profile_statement.person_review_status', 'pending_candidate_video_review', 'รอทบทวนจากวิดีโอของเจ้าตัว', 'Pending candidate video review'],
  ['profile_statement.person_review_status', 'owner_approved', 'เจ้าตัวยืนยันแล้ว', 'Owner approved'],
  ['profile_statement.source_type', 'first_person_application', 'ถอดความจากคำตอบ first-person', 'First-person application paraphrase'],
  ['profile_statement.source_type', 'factual_fallback', 'ข้อความตั้งต้นจากหลักฐานข้อเท็จจริงที่กำกับขอบเขต', 'Bounded factual-evidence fallback'],
  ['profile_statement.author_role', 'profile_subject', 'เจ้าตัวเป็นผู้ให้ข้อมูลต้นทาง', 'Profile subject supplied the source information'],
  ['profile_statement.author_role', 'assistant_paraphrase_from_owner_and_sheet_records', 'ผู้ช่วยเรียบเรียงจากข้อมูลที่ owner อนุมัติและ roster', 'Assistant synthesis from owner-authorized roster evidence'],
  ['profile_statement.derivation_method', 'concise_paraphrase', 'ถอดความอย่างกระชับโดยไม่เติมข้ออ้าง', 'Concise paraphrase without added claims'],
  ['profile_statement.derivation_method', 'bounded_inference', 'สังเคราะห์เฉพาะขอบเขตที่หลักฐานบทบาท การศึกษา และผลงานรองรับ', 'Inference bounded to supported role, education, and work evidence'],
  ['profile_statement.evidence_confidence', 'exact_roster_match', 'จับคู่ชื่อเต็มกับ core roster ได้ exact', 'Exact full-name core-roster match'],
  ['profile_statement.evidence_confidence', 'medium_high', 'ข้อเท็จจริงหลายมิติที่ยืนยันแล้วสอดคล้องกัน', 'Multiple reconciled factual dimensions'],
  ['profile_statement.evidence_confidence', 'medium', 'ข้อเท็จจริงที่ยืนยันแล้วรองรับข้อความโดยตรง', 'Verified facts directly support the copy'],
  ['profile_statement.evidence_confidence', 'medium_low', 'หลักฐานจริงมีขอบเขตจำกัด จึงใช้ข้อความที่ระมัดระวัง', 'Limited factual scope with conservative wording'],
  ['education.degree_award_status', 'under_review', 'ชื่อหลักสูตรยืนยันแล้ว แต่สถานะการได้รับปริญญายังรอตรวจ', 'Degree program verified; personal award under review'],
  ['education.degree_award_status', 'in_progress', 'กำลังศึกษา', 'In progress'],
  ['education.degree_award_status', 'completed', 'สำเร็จการศึกษา', 'Completed']
].map(([enum_group, value, label_th, label_en]) => ({ enum_group, value, label_th, label_en }));

const qaRows = [
  { metric: 'people_count', expected: 48, formula_value: '=COUNTA(people_registry!A2:A)', review_rule: 'ต้องเท่ากับ expected' },
  { metric: 'duplicate_person_ids', expected: 0, formula_value: '=SUM(ARRAYFORMULA(N((people_registry!A2:A<>"")*(COUNTIF(people_registry!A2:A,people_registry!A2:A)>1))))', review_rule: 'ต้องเป็น 0' },
  { metric: 'people_without_contribution', expected: 0, formula_value: '=SUM(ARRAYFORMULA(N((people_registry!A2:A<>"")*(COUNTIF(contributions!B2:B,people_registry!A2:A)=0))))', review_rule: 'ต้องเป็น 0' },
  { metric: 'orphan_engagement_person_ids', expected: 0, formula_value: '=SUM(ARRAYFORMULA(N((engagements!B2:B<>"")*(COUNTIF(people_registry!A2:A,engagements!B2:B)=0))))', review_rule: 'ต้องเป็น 0' },
  { metric: 'invalid_person_id_format', expected: 0, formula_value: '=SUM(ARRAYFORMULA(N((people_registry!A2:A<>"")*(REGEXMATCH(people_registry!A2:A,"^[SPI][0-9]{4}$")=FALSE))))', review_rule: 'ต้องเป็น 0' },
  { metric: 'oat_land_portfolio_and_lead2loan', expected: 2, formula_value: '=COUNTUNIQUE(FILTER(contributions!C2:C,contributions!B2:B="S0001",REGEXMATCH(contributions!C2:C,"work-(land-portfolio|lead2loan)")))', review_rule: 'ต้องเป็น 2 work IDs แยกกัน' },
  { metric: 'pending_profile_consent', expected: 48, formula_value: '=COUNTIF(people_registry!S2:S,"pending")', review_rule: 'ค่าปัจจุบันที่ audit แล้ว; ลดลงเมื่อมี individual consent จริงเท่านั้น ไม่เปลี่ยนเพราะ owner authorization รายการย่อย' },
  { metric: 'publishable_portraits', expected: 41, formula_value: '=COUNTIF(assets!Q2:Q,"publishable")', review_rule: 'ค่าปัจจุบันที่ผ่าน gate; อีก 7 คนใช้ชื่อเล่นเต็มเป็น avatar fallback จนกว่าจะมีภาพที่ยืนยันได้' },
  { metric: 'core_cooperative_education_count', expected: 6, formula_value: '=COUNTIF(engagements!Q2:Q,"cooperative_education")', review_rule: 'เว็บหลักมี 6 คน: I0003, I0030, I0031, I0034, I0036, I0039; ผู้เข้าร่วมรายที่ 7 อยู่ Shortlisted recruitment จนกว่าจะมี contribution' },
  { metric: 'non_authorized_core_coop', expected: 0, formula_value: '=SUM(ARRAYFORMULA(N((engagements!Q2:Q="cooperative_education")*(REGEXMATCH(engagements!B2:B,"^(I0003|I0030|I0031|I0034|I0036|I0039)$")=FALSE))))', review_rule: 'ต้องเป็น 0' },
  { metric: 'profile_statements', expected: 48, formula_value: '=COUNTA(profile_statements!A2:A)', review_rule: 'ทุก core person ต้องมี current statement หนึ่งรายการ' },
  { metric: 'source_backed_profile_copy', expected: 48, formula_value: '=COUNTIF(people_registry!Q2:Q,"source_backed_placeholder")', review_rule: 'ครบ 48 คนและต้องมี provenance ที่แยก first-person ออกจาก factual fallback' },
  { metric: 'owner_pending_profile_copy', expected: 0, formula_value: '=COUNTIF(people_registry!Q2:Q,"owner_pending")', review_rule: 'release นี้ต้องเป็น 0' },
  { metric: 'first_person_profile_statements', expected: 25, formula_value: '=COUNTIF(profile_statements!G2:G,"first_person_application")', review_rule: 'จับคู่ core roster แบบ exact และรอ video review' },
  { metric: 'factual_fallback_profile_statements', expected: 23, formula_value: '=COUNTIF(profile_statements!G2:G,"factual_fallback")', review_rule: 'ใช้เฉพาะ role, education และ verified work; ห้ามใช้ reviewer inference' },
  { metric: 'staff_degree_programs', expected: 4, formula_value: '=COUNTIFS(education!B2:B,"S*",education!L2:L,"<>")', review_rule: 'ชื่อ degree program ครบ 4 staff' },
  { metric: 'verified_completed_staff_degrees', expected: 4, formula_value: '=COUNTIFS(education!B2:B,"S*",education!R2:R,"completed",education!S2:S,TRUE)', review_rule: 'owner ยืนยัน completed + personalAwardVerified ครบ 4 staff' }
];

const readmeRows = [
  { topic: 'ชื่อชุดข้อมูล', detail: 'Landom — People, Roles & Contributions Registry v3.3 (23 Aug 2026)' },
  { topic: 'หลักการ', detail: 'หนึ่งคนหนึ่ง person_id; หลายช่วงบทบาทอยู่ใน engagements; หลายผลงานอยู่ใน contributions' },
  { topic: 'person_id', detail: 'รูปแบบ S0001 / P0001 / I0001 จัดตามประเภท ณ migration 2026-08-23 และ freeze หลังออกเลข' },
  { topic: 'หลายบทบาท', detail: 'โอ๊ตใช้ S0001 เดียวสำหรับ Intern → Part-time → Full-time' },
  { topic: 'การศึกษา', detail: 'Card ใช้ชื่อย่อ program + institution; detail ใช้ชื่อทางการ; staff ทั้ง 4 คนแสดง degree + field + institution โดย release นี้ owner ยืนยัน completed และ personalAwardVerified แล้ว' },
  { topic: 'ฝึกงาน/สหกิจศึกษา', detail: 'ใช้ academic_placement_type ต่อ engagement เท่านั้น; เว็บหลักมีสหกิจ 6 IDs ที่ owner ยืนยัน ส่วนผู้เข้าร่วมรายที่ 7 อยู่ Shortlisted recruitment รอยืนยันการเริ่มงานและ contribution' },
  { topic: 'ผลงาน', detail: 'Land Portfolio และ Lead2Loan เป็นคนละ work_id; ทุกคนมี contribution อย่างน้อย 1 รายการ' },
  { topic: 'รางวัล', detail: 'Hack Land Value / CityCell อยู่ใน achievements และเชื่อมผู้รับรางวัลผ่าน person_achievements' },
  { topic: 'bio', detail: 'ครบ 48 profiles: 25 ข้อความ paraphrase จาก first-person ที่จับคู่ roster ได้ exact และ 23 factual fallback ที่สังเคราะห์แบบ bounded จาก role, education และ verified work เท่านั้น ทุกข้อความเป็น source_backed_placeholder และรอ candidate/video review; ห้ามเผย raw application, source Sheet ID/range, contact หรือ reviewer data' },
  { topic: 'recruitment', detail: 'ผู้สมัครที่ไม่อยู่ใน Landom registry เก็บใน private Shortlisted recruitment เท่านั้น; ห้ามนำ contact, CV, video URL หรือ reviewer note เข้า public projection' },
  { topic: 'social', detail: 'ลิงก์ public profile ที่ตรวจ identity แล้วเผยแพร่ได้ด้วย individual_consent หรือ owner_authorized_public_profile_link; basis หลังไม่ใช่ consent ของเจ้าตัว' },
  { topic: 'photo', detail: 'portrait ต้องผ่าน identity verification + rights และมี individual consent หรือ owner_authorized_public_profile_portrait พร้อมไฟล์ local ที่อนุมัติแล้ว; ห้ามเผย CDN source URL' },
  { topic: 'CityMETER', detail: 'ชื่อ module อ้าง release ปัจจุบัน; CityScan, CityCell, GISTDA/DWR deliverables ไม่ถูกยกเป็น canonical module โดยไม่มีหลักฐาน' },
  { topic: 'Locale Insight', detail: 'shared methodology ใช้เอกพจน์ Locale Insight; module ชื่อ Locale Insights อยู่ใน product-specific CityMETER layer' },
  { topic: 'Landom', detail: 'Landometer คือแบรนด์ · Landom คือด้อม · สมาชิกเรียก ชาว Landom / ชาวแลนด้อม' },
  { topic: 'backup', detail: 'สำเนาก่อน migration เป็น private operations artifact; ไม่เผยแพร่ Spreadsheet ID ใน public export หรือ repository' }
];

const tabs = {
  README: tab(['topic', 'detail'], readmeRows, { filter: false, columnWidths: { A: 180, B: 720 } }),
  people_registry: tab(
    ['person_id', 'full_name_th', 'full_name_en', 'nickname_th', 'nickname_en', 'current_status', 'migration_classification', 'first_joined', 'education_record_id', 'education_display_mode', 'card_education_th', 'card_education_en', 'detail_education_th', 'detail_education_en', 'bio_th', 'bio_en', 'bio_status', 'bio_verification_status', 'consent_public', 'profile_status', 'verification_status', 'source_note', 'bio_publication_basis', 'bio_source_basis', 'bio_review_status', 'bio_owner_approval_status', 'bio_owner_approved_at', 'bio_owner_approval_scope', 'bio_owner_approval_source_ref', 'current_statement_id', 'bio_source_type', 'bio_source_ref', 'bio_author_role', 'bio_derivation_method', 'bio_evidence_scope', 'bio_evidence_confidence'],
    peopleRows,
    {
      columnWidths: { A: 88, B: 180, C: 240, D: 110, E: 110, O: 420, P: 420, V: 480, W: 260, X: 260, AC: 300, AD: 150, AE: 190, AF: 300, AG: 280, AH: 190, AI: 320, AJ: 150 },
      validations: {
        F: ['active', 'alumni'],
        G: ['full_time', 'part_time', 'intern_or_program_participant'],
        J: ['qualification', 'program', 'neutral'],
        Q: ['owner_pending', 'source_backed_placeholder', 'owner_approved'],
        R: ['owner_pending', 'owner_authorized_placeholder', 'owner_approved'],
        S: ['granted', 'pending', 'denied'],
        W: ['owner_authorized_paraphrase_from_first_person_application', 'owner_authorized_synthesis_from_roster_evidence'],
        X: ['first_person_application_exact_roster_match', 'factual_role_education_and_work_evidence'],
        Y: ['pending_owner_copy', 'pending_candidate_video_review', 'owner_approved'],
        Z: ['granted'],
        AE: ['first_person_application', 'factual_fallback', 'candidate_video_transcript', 'owner_supplied_copy'],
        AG: ['profile_subject', 'assistant_paraphrase_from_owner_and_sheet_records', 'directory_owner'],
        AH: ['concise_paraphrase', 'bounded_inference', 'video_transcript_synthesis', 'verbatim_owner_copy'],
        AJ: ['exact_roster_match', 'owner_confirmed', 'high', 'medium_high', 'medium', 'medium_low']
      }
    }
  ),
  profile_statements: tab(
    ['statement_id', 'person_id', 'statement_kind', 'text_th', 'text_en', 'source_language', 'source_type', 'source_ref', 'author_role', 'derivation_method', 'evidence_scope', 'evidence_confidence', 'owner_approval_status', 'owner_approval_source_ref', 'person_review_status', 'consent_status', 'publication_status', 'supersedes_statement_id', 'effective_from', 'reviewed_at', 'publication_basis', 'source_basis', 'owner_approval_scope'],
    profileStatementRows,
    {
      columnWidths: { A: 150, B: 88, C: 220, D: 560, E: 560, H: 300, K: 320, N: 260, U: 360, V: 320, W: 280 },
      validations: {
        G: ['first_person_application', 'factual_fallback', 'candidate_video_transcript', 'owner_supplied_copy'],
        I: ['profile_subject', 'assistant_paraphrase_from_owner_and_sheet_records', 'directory_owner'],
        J: ['concise_paraphrase', 'bounded_inference', 'video_transcript_synthesis', 'verbatim_owner_copy'],
        L: ['exact_roster_match', 'owner_confirmed', 'high', 'medium_high', 'medium', 'medium_low'],
        M: ['granted'],
        O: ['pending_candidate_video_review', 'owner_approved'],
        P: ['granted', 'pending', 'denied'],
        Q: ['source_backed_placeholder', 'owner_approved'],
        U: ['owner_authorized_paraphrase_from_first_person_application', 'owner_authorized_synthesis_from_roster_evidence'],
        V: ['first_person_application_exact_roster_match', 'factual_role_education_and_work_evidence'],
        W: ['source_backed_placeholder_profile_copy']
      }
    }
  ),
  engagements: tab(
    ['engagement_id', 'person_id', 'category', 'program_code', 'program_name_th', 'program_name_en', 'cohort', 'role_th', 'role_en', 'responsibility_work_ids', 'start', 'end', 'status', 'evidence_status', 'verification_status', 'sequence_hint', 'academic_placement_type'],
    engagementRows,
    { validations: { M: ['ongoing', 'completed'], Q: ['cooperative_education', 'internship', 'not_applicable'] } }
  ),
  institutions: tab(['institution_id', 'official_name_th', 'official_name_en', 'short_name_th', 'short_name_en', 'aliases', 'verification_status'], institutionRows),
  programs: tab(['program_id', 'institution_ids', 'official_name_th', 'official_name_en', 'short_name_th', 'short_name_en', 'qualification_level', 'verification_status'], programRows),
  education: tab(['education_record_id', 'person_id', 'institution_id', 'program_id', 'record_type', 'is_primary', 'qualification_th', 'qualification_en', 'source_label', 'verification_status', 'evidence_note', 'degree_abbreviation_th', 'degree_abbreviation_en', 'degree_title_th', 'degree_title_en', 'degree_field_th', 'degree_field_en', 'degree_award_status', 'degree_personal_award_verified', 'degree_program_evidence_url', 'degree_evidence_scope'], educationRows, {
    validations: { R: ['under_review', 'in_progress', 'completed'] }
  }),
  works: tab(['work_id', 'parent_product', 'module_slug', 'canonical_name_th', 'canonical_name_en', 'short_name_th', 'short_name_en', 'type', 'scope_layer', 'authority_status', 'source_aliases', 'evidence_note', 'catalog_url_th', 'catalog_url_en', 'destination_url', 'link_scope', 'url_source_ref', 'link_evidence_url'], workRows, {
    validations: { P: ['exact_module', 'exact_product', 'evidence_only', 'broader_catalog', 'unverified_no_link'] }
  }),
  contributions: tab(['contribution_id', 'person_id', 'work_id', 'engagement_id', 'role_th', 'role_en', 'period_start', 'period_end', 'period_label', 'evidence_status', 'source_ref', 'evidence_note'], contributionRows),
  achievements: tab(['achievement_id', 'title_th', 'title_en', 'result_th', 'result_en', 'organizer_th', 'organizer_en', 'awarded_on', 'date_verification_status', 'work_id', 'evidence_status', 'evidence_url', 'evidence_note'], achievementRows),
  person_achievements: tab(['person_achievement_id', 'achievement_id', 'person_id'], personAchievementRows),
  social_profiles: tab(['social_profile_id', 'person_id', 'platform', 'candidate_url_or_handle', 'public_url', 'candidate_status', 'verification_status', 'consent_status', 'publication_basis', 'owner_approval_status', 'owner_approved_at', 'owner_approval_scope', 'owner_approval_source_ref', 'publication_status', 'source_note'], socialRows, {
    validations: {
      F: ['candidate_present', 'candidate_missing'],
      G: ['owner_review_required', 'verified', 'rejected', 'missing'],
      H: ['granted', 'pending', 'denied'],
      I: ['individual_consent', 'owner_authorized_public_profile_link'],
      J: ['granted'],
      N: ['publishable', 'withheld_pending_candidate', 'withheld_pending_consent', 'withheld_pending_verification', 'withdrawn']
    }
  }),
  assets: tab(['asset_id', 'person_id', 'kind', 'public_path', 'source_url', 'alt_th', 'alt_en', 'candidate_status', 'verification_status', 'consent_status', 'rights_status', 'publication_basis', 'owner_approval_status', 'owner_approved_at', 'owner_approval_scope', 'owner_approval_source_ref', 'publication_status', 'sha256', 'media_type', 'bytes', 'identity_verification_evidence', 'permission_record_id', 'crop_focal_point', 'credit'], assetRows, {
    validations: {
      H: ['candidate_present', 'source_needed'],
      I: ['owner_review_required', 'verified', 'rejected', 'missing'],
      J: ['granted', 'pending', 'denied'],
      K: ['cleared', 'pending', 'denied', 'revoked'],
      L: ['individual_consent', 'owner_authorized_public_profile_portrait'],
      M: ['granted'],
      Q: ['publishable', 'withheld_pending_rights_consent_and_verification', 'withdrawn']
    }
  }),
  aliases: tab(['alias_type', 'canonical_id', 'alias', 'note'], aliasRows),
  enums: tab(['enum_group', 'value', 'label_th', 'label_en'], enumRows),
  qa: tab(['metric', 'expected', 'formula_value', 'review_rule'], qaRows, { filter: false }),
  contacts_internal: tab(contactHeaders, contactRows)
};

if (requestedTab && !Object.hasOwn(tabs, requestedTab)) {
  throw new Error('Unknown sheet tab: ' + requestedTab);
}

const selectedTabs = requestedTab ? { [requestedTab]: tabs[requestedTab] } : tabs;
const exportPayload = JSON.stringify({ schemaVersion: '3.3.0', spreadsheetId: site.meta.source.spreadsheetId, tabs: selectedTabs });
if (/LDM-P-\d+/.test(exportPayload)) throw new Error('Legacy person ID escaped the sheet exporter canonicalization boundary.');
if (outputPath) {
  fs.writeFileSync(outputPath, exportPayload, { encoding: 'utf8', mode: 0o600 });
  process.stdout.write('Wrote private Sheet payload to ' + outputPath + '\n');
} else {
  process.stdout.write(exportPayload);
}
