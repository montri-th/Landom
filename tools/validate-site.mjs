import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PERSON_ID_PATTERN = /^[SPI][0-9]{4}$/;
const REQUIRED_DATASETS = [
  'institutions',
  'programs',
  'educationRecords',
  'people',
  'engagements',
  'works',
  'contributions',
  'achievements',
  'socialProfiles',
  'assets',
  'certificates'
];

export const PUBLIC_BUILD_INPUTS = Object.freeze([
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'src',
  'public',
  'data/generated'
]);

export const REQUIRED_UI_IDS = [
  'language-toggle',
  'theme-toggle',
  'search-input',
  'filter-open',
  'filter-dialog',
  'filter-form',
  'filter-role',
  'filter-cohort',
  'filter-status',
  'filter-work',
  'filter-clear',
  'people-board',
  'certificate-dialog',
  'certificate-close',
  'certificate-download'
];

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.mjs', '.svg', '.txt', '.webmanifest']);

function valueAt(record, candidates) {
  for (const candidate of candidates) {
    const segments = candidate.split('.');
    let value = record;
    for (const segment of segments) value = value?.[segment];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('en-US');
}

function recordLabel(record, fallback) {
  return String(
    valueAt(record, [
      'name.en',
      'name.th',
      'names.en',
      'names.th',
      'names.full.en',
      'names.full.th',
      'fullName.en',
      'fullName.th',
      'fullNameEn',
      'fullNameTh',
      'displayName.en',
      'displayName.th',
      'displayName',
      'workName.en',
      'workName.th',
      'workName',
      'title.en',
      'title.th',
      'title'
    ]) ?? fallback
  );
}

function getStatus(record, key) {
  return normalizeText(valueAt(record, [key, `approval.${key}`, `publication.${key}`]));
}

function isPublic(record) {
  return getStatus(record, 'publicationStatus') === 'publishable';
}

function isVerified(record) {
  return getStatus(record, 'verificationStatus') === 'verified';
}

function hasConsent(record) {
  return getStatus(record, 'consentStatus') === 'granted';
}

function hasRights(record) {
  return getStatus(record, 'rightsStatus') === 'cleared';
}

function hasOwnerAuthorizedBasis(record, basis) {
  return normalizeText(record?.publicationBasis) === normalizeText(basis) &&
    normalizeText(valueAt(record, ['ownerApproval.status', 'owner_approval.status'])) === 'granted';
}

function hasSocialPublicationAuthority(profile, person) {
  if (hasOwnerAuthorizedBasis(profile, 'owner_authorized_public_profile_link')) return true;
  return hasConsent(profile) && (!person || hasConsent(person.publication ?? person));
}

function hasAssetPublicationAuthority(asset) {
  return hasConsent(asset) || hasOwnerAuthorizedBasis(asset, 'owner_authorized_public_profile_portrait');
}

function hasCertificatePublicationAuthority(certificate) {
  return hasOwnerAuthorizedBasis(certificate, 'owner_authorized_public_certificate');
}

function hasPublicUrl(record) {
  return Boolean(valueAt(record, ['url', 'profileUrl', 'publicUrl', 'publicPath', 'src', 'path']));
}

function uniqueIds(records, key, label, errors, pattern) {
  const seen = new Map();
  for (const [index, record] of records.entries()) {
    const id = record?.[key];
    if (typeof id !== 'string' || id.length === 0) {
      errors.push(`${label}[${index}] is missing ${key}.`);
      continue;
    }
    if (pattern && !pattern.test(id)) errors.push(`${label} ${id} does not match ${pattern}.`);
    if (seen.has(id)) errors.push(`${label} ${id} is duplicated at rows ${seen.get(id)} and ${index}.`);
    else seen.set(id, index);
  }
  return new Set(seen.keys());
}

function requireFk(records, key, allowed, label, errors, { optional = false, many = false } = {}) {
  for (const [index, record] of records.entries()) {
    const raw = record?.[key];
    const values = many ? raw : [raw];
    if ((raw === undefined || raw === null || raw === '') && optional) continue;
    if (!Array.isArray(values) || values.length === 0) {
      errors.push(`${label}[${index}].${key} must contain at least one reference.`);
      continue;
    }
    for (const value of values) {
      if (!allowed.has(value)) errors.push(`${label}[${index}].${key} has orphan reference ${String(value)}.`);
    }
  }
}

function workName(work) {
  return recordLabel(work, work?.workId ?? 'unknown work');
}

function validateCanonicalNames(data, errors) {
  const publishedNames = data.works.map(workName);
  const rules = [
    [/LanDOM/, 'Use exact brand/community casing “Landom”, never “LanDOM”.'],
    [/CityMERE/i, 'Use “CityMETER”; “CityMERE” is a typo.'],
    [/CityMETER\s+:/i, 'Use “CityMETER: …” without a space before the colon.'],
    [/Citymeter/, 'Use exact product casing “CityMETER”.'],
    [/Visual Guidlines/i, 'Use “Visual Guidelines”.']
  ];
  for (const name of publishedNames) {
    for (const [pattern, message] of rules) {
      if (pattern.test(name)) errors.push(`Work name “${name}” is not canonical. ${message}`);
    }
  }
}

function validateOatSplit(data, peopleById, worksById, errors) {
  const oat = data.people.find((person) => /โอ๊ต|\boat\b/i.test(JSON.stringify(person)));
  if (!oat) {
    errors.push('Oat (โอ๊ต) is missing from the public people dataset.');
    return;
  }

  const oatWorks = data.contributions
    .filter((contribution) => contribution.personId === oat.personId)
    .map((contribution) => worksById.get(contribution.workId))
    .filter(Boolean);
  const landPortfolio = oatWorks.filter((work) => normalizeText(workName(work)).includes('land portfolio'));
  const lead2Loan = oatWorks.filter((work) => normalizeText(workName(work)).includes('lead2loan'));
  if (landPortfolio.length === 0) errors.push(`Oat (${oat.personId}) must have a Land Portfolio contribution.`);
  if (lead2Loan.length === 0) errors.push(`Oat (${oat.personId}) must have a Lead2Loan contribution.`);
  if (landPortfolio.some((work) => normalizeText(workName(work)).includes('lead2loan'))) {
    errors.push('Oat’s Land Portfolio and Lead2Loan must be separate work records, not one combined label.');
  }
  if (landPortfolio[0] && lead2Loan[0] && landPortfolio[0].workId === lead2Loan[0].workId) {
    errors.push('Oat’s Land Portfolio and Lead2Loan resolve to the same workId; they must be separate works.');
  }

  // Keep the argument intentionally used: an Oat contribution must resolve to the canonical person map.
  if (!peopleById.has(oat.personId)) errors.push(`Oat personId ${oat.personId} is not canonical.`);
}

export function validateDataContract(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['site-data.json must contain an object.'];

  for (const key of REQUIRED_DATASETS) {
    if (!Array.isArray(data[key])) errors.push(`site-data.json.${key} must be an array.`);
  }
  if (errors.length > 0) return errors;

  if (data.meta?.counts && typeof data.meta.counts === 'object') {
    for (const key of ['people', 'engagements', 'educationRecords', 'works', 'contributions', 'achievements', 'certificates']) {
      if (data.meta.counts[key] !== data[key].length) {
        errors.push(`meta.counts.${key} is ${String(data.meta.counts[key])}, but the dataset contains ${data[key].length}.`);
      }
    }
  }

  const personIds = uniqueIds(data.people, 'personId', 'Person', errors, PERSON_ID_PATTERN);
  const engagementIds = uniqueIds(data.engagements, 'engagementId', 'Engagement', errors);
  const workIds = uniqueIds(data.works, 'workId', 'Work', errors);
  const institutionIds = uniqueIds(data.institutions, 'institutionId', 'Institution', errors);
  const programIds = uniqueIds(data.programs, 'programId', 'Program', errors);
  uniqueIds(data.educationRecords, 'educationRecordId', 'Education record', errors);
  uniqueIds(data.contributions, 'contributionId', 'Contribution', errors);
  uniqueIds(data.achievements, 'achievementId', 'Achievement', errors);
  uniqueIds(data.socialProfiles, 'socialProfileId', 'Social profile', errors);
  const assetIds = uniqueIds(data.assets, 'assetId', 'Asset', errors);
  uniqueIds(data.certificates, 'certificateId', 'Certificate', errors);

  const peopleById = new Map(data.people.map((person) => [person.personId, person]));
  const engagementsById = new Map(data.engagements.map((engagement) => [engagement.engagementId, engagement]));
  const worksById = new Map(data.works.map((work) => [work.workId, work]));
  const assetsById = new Map(data.assets.map((asset) => [asset.assetId, asset]));

  const identityOwners = new Map();
  for (const person of data.people) {
    const legacyIdKeys = Object.keys(person).filter((key) => /^(person_id|personIdV\d+|legacyPersonIds?)$/i.test(key));
    if (legacyIdKeys.length > 0) {
      errors.push(`Person ${person.personId} exposes alternate ID field(s): ${legacyIdKeys.join(', ')}.`);
    }
    const identity = normalizeText(
      valueAt(person, ['names.full.en', 'fullName.en', 'fullNameEn', 'names.full.th', 'fullName.th', 'fullNameTh'])
    );
    if (identity) {
      if (identityOwners.has(identity) && identityOwners.get(identity) !== person.personId) {
        errors.push(`One person maps to multiple IDs: ${identityOwners.get(identity)} and ${person.personId} share “${identity}”.`);
      } else identityOwners.set(identity, person.personId);
    }

    const category = person.migrationClassification;
    const categoryContract = {
      full_time: { prefix: 'S', educationMode: 'qualification' },
      part_time: { prefix: 'P', educationMode: 'neutral' },
      intern_or_program_participant: { prefix: 'I', educationMode: 'program' }
    }[category];
    if (categoryContract) {
      if (!person.personId.startsWith(categoryContract.prefix)) {
        errors.push(`Person ${person.personId} has category ${category} but the wrong canonical ID prefix.`);
      }
      if (person.educationDisplayMode !== categoryContract.educationMode) {
        errors.push(
          `Person ${person.personId} has category ${category} but educationDisplayMode is ${String(person.educationDisplayMode)}.`
        );
      }
      if (person.canonicalIdPolicy && person.canonicalIdPolicy.frozenAcrossFutureRoleChanges !== true) {
        errors.push(`Person ${person.personId} canonical ID is not frozen across future role changes.`);
      }
      if (category !== 'part_time') {
        for (const field of ['card.th', 'card.en', 'detail.th', 'detail.en']) {
          if (!valueAt(person.educationDisplay ?? {}, [field])) {
            errors.push(`Person ${person.personId} is missing role-aware educationDisplay.${field}.`);
          }
        }
      }
    }
  }

  for (const [dimension, idKey, allowDuplicateLabels] of [
    [data.institutions, 'institutionId', false],
    [data.programs, 'programId', true]
  ]) {
    const labelOwners = new Map();
    for (const record of dimension) {
      for (const field of ['names.th.formal', 'names.th.short', 'names.en.formal', 'names.en.short']) {
        const label = normalizeText(valueAt(record, [field]));
        if (!label) {
          errors.push(`${record[idKey]} is missing canonical ${field}.`);
          continue;
        }
        const scopedLabel = `${field}:${label}`;
        if (!allowDuplicateLabels && labelOwners.has(scopedLabel) && labelOwners.get(scopedLabel) !== record[idKey]) {
          errors.push(`${record[idKey]} and ${labelOwners.get(scopedLabel)} duplicate canonical ${field} “${label}”.`);
        } else labelOwners.set(scopedLabel, record[idKey]);
      }
    }
  }

  requireFk(data.engagements, 'personId', personIds, 'Engagement', errors);
  requireFk(data.educationRecords, 'personId', personIds, 'Education record', errors);
  requireFk(data.educationRecords, 'institutionId', institutionIds, 'Education record', errors);
  requireFk(data.educationRecords, 'programId', programIds, 'Education record', errors, { optional: true });
  requireFk(data.contributions, 'personId', personIds, 'Contribution', errors);
  requireFk(data.contributions, 'workId', workIds, 'Contribution', errors);
  requireFk(data.contributions, 'engagementId', engagementIds, 'Contribution', errors, { optional: true });
  requireFk(data.achievements, 'recipientPersonIds', personIds, 'Achievement', errors, { many: true });
  requireFk(data.achievements, 'workId', workIds, 'Achievement', errors, { optional: true });
  requireFk(data.socialProfiles, 'personId', personIds, 'Social profile', errors);
  requireFk(data.assets, 'personId', personIds, 'Asset', errors, { optional: true });
  requireFk(data.certificates, 'personId', personIds, 'Certificate', errors);
  requireFk(data.certificates, 'workIds', workIds, 'Certificate', errors, { many: true });

  for (const program of data.programs) {
    if (program.institutionId !== undefined && !institutionIds.has(program.institutionId)) {
      errors.push(`Program ${program.programId} has orphan institutionId ${String(program.institutionId)}.`);
    }
  }

  const contributionCount = new Map(data.people.map((person) => [person.personId, 0]));
  for (const contribution of data.contributions) {
    contributionCount.set(contribution.personId, (contributionCount.get(contribution.personId) ?? 0) + 1);
    if (contribution.engagementId) {
      const engagement = engagementsById.get(contribution.engagementId);
      if (engagement && engagement.personId !== contribution.personId) {
        errors.push(
          `Contribution ${contribution.contributionId} belongs to ${contribution.personId} but engagement ${contribution.engagementId} belongs to ${engagement.personId}.`
        );
      }
    }
  }
  for (const [personId, count] of contributionCount) {
    if (count < 1) errors.push(`Person ${personId} has no contribution; every public person needs at least one.`);
  }

  for (const profile of data.socialProfiles) {
    const profileIsPublic = isPublic(profile);
    if (hasPublicUrl(profile) && !profileIsPublic) {
      errors.push(`Social profile ${profile.socialProfileId} exposes a URL without public publication status.`);
    }
    const person = peopleById.get(profile.personId);
    if (profileIsPublic && (!isVerified(profile) || !hasSocialPublicationAuthority(profile, person))) {
      errors.push(`Social profile ${profile.socialProfileId} is public without verified source and an approved publication basis.`);
    }
  }

  for (const asset of data.assets) {
    if (hasPublicUrl(asset) && !isPublic(asset)) {
      errors.push(`Asset ${asset.assetId} exposes a path or URL without public publication status.`);
    }
    if (isPublic(asset) && (!isVerified(asset) || !hasAssetPublicationAuthority(asset) || !hasRights(asset))) {
      errors.push(`Asset ${asset.assetId} is public without verification, an approved publication basis, and publication rights.`);
    }
  }

  const certificateRoleByProgram = new Map([
    ['FDI', 'software development'],
    ['PDI', 'product development'],
    ['MSI', 'go-to-market'],
    ['IMP', 'consulting partner']
  ]);
  const expectedCertificateCountByProgram = new Map([
    ['FDI', 12],
    ['MSI', 5],
    ['IMP', 8],
    ['PDI', 1]
  ]);
  if (data.certificates.length > 0) {
    for (const [programCode, expectedCount] of expectedCertificateCountByProgram) {
      const actualCount = data.certificates.filter((certificate) => certificate.programCode === programCode).length;
      if (actualCount !== expectedCount) {
        errors.push(`Governed certificate inventory must contain exactly ${expectedCount} ${programCode} record${expectedCount === 1 ? '' : 's'}; found ${actualCount}.`);
      }
    }
  }
  const credentialOwners = new Map();
  for (const certificate of data.certificates) {
    for (const privateKey of ['sourceFile', 'sourcePath', 'sourceUrl', 'qrUrl', 'qrUrls', 'qrTargets']) {
      if (certificate[privateKey] !== undefined) {
        errors.push(`Certificate ${certificate.certificateId} exposes forbidden source field ${privateKey}.`);
      }
    }
    if (hasPublicUrl(certificate) && !isPublic(certificate)) {
      errors.push(`Certificate ${certificate.certificateId} exposes a path without public publication status.`);
    }
    if (isPublic(certificate) && (!isVerified(certificate) || !hasCertificatePublicationAuthority(certificate) || !hasRights(certificate))) {
      errors.push(`Certificate ${certificate.certificateId} is public without verification, scoped owner authorization, and cleared rights.`);
    }
    if (certificate.consentStatus !== 'pending') {
      errors.push(`Certificate ${certificate.certificateId} must not represent owner authorization as individual consent.`);
    }
    if (certificate.ownerApproval?.scope !== 'public_certificate_image_and_printed_profile_facts') {
      errors.push(`Certificate ${certificate.certificateId} has an invalid owner-approval scope.`);
    }
    if (!/^public\/assets\/certificates\/[SPI]\d{4}-[A-Z0-9]+\.png$/.test(String(certificate.publicPath ?? ''))) {
      errors.push(`Certificate ${certificate.certificateId} has an unsafe governed publicPath.`);
    }
    const expectedRole = certificateRoleByProgram.get(certificate.programCode);
    if (!expectedRole || normalizeText(certificate.roleLabel?.th) !== expectedRole || normalizeText(certificate.roleLabel?.en) !== expectedRole) {
      errors.push(`Certificate ${certificate.certificateId} does not use the exact ${String(certificate.programCode)} certificate role label.`);
    }
    if (certificate.evidenceBoundary !== 'printed_certificate_facts_only_qr_destinations_excluded') {
      errors.push(`Certificate ${certificate.certificateId} does not preserve the QR/contribution evidence boundary.`);
    }
    const owners = credentialOwners.get(certificate.credentialId) ?? [];
    owners.push(certificate);
    credentialOwners.set(certificate.credentialId, owners);
  }
  for (const [credentialId, owners] of credentialOwners) {
    if (owners.length > 1 && owners.some((certificate) => certificate.credentialIdCollisionStatus !== 'duplicate_in_printed_source')) {
      errors.push(`Duplicate printed credentialId ${credentialId} is not explicitly represented as a source collision.`);
    }
  }

  for (const person of data.people) {
    for (const directKey of ['avatarUrl', 'imageUrl', 'photoUrl', 'profileImageUrl']) {
      if (person[directKey]) errors.push(`Person ${person.personId} uses direct ${directKey}; reference an approved assetId instead.`);
    }
    const imageAssetId = valueAt(person, ['profileImageAssetId', 'avatarAssetId', 'photoAssetId', 'imageAssetId']);
    if (imageAssetId) {
      if (!assetIds.has(imageAssetId)) errors.push(`Person ${person.personId} references missing image asset ${imageAssetId}.`);
      else {
        const asset = assetsById.get(imageAssetId);
        if (!isPublic(asset) || !isVerified(asset) || !hasAssetPublicationAuthority(asset) || !hasRights(asset)) {
          errors.push(`Person ${person.personId} references image asset ${imageAssetId} before all approvals pass.`);
        }
      }
    }
  }

  validateOatSplit(data, peopleById, worksById, errors);
  validateCanonicalNames(data, errors);
  return errors;
}

async function walkFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(entryPath)));
    else if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

async function readIfPresent(filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function validateUi(publishRoot, errors) {
  const indexPath = path.join(publishRoot, 'index.html');
  const index = await readIfPresent(indexPath);
  if (index === null) {
    errors.push('index.html is missing.');
    return;
  }
  const sourceFiles = await walkFiles(path.join(publishRoot, 'src'));
  const sourceText = (
    await Promise.all(
      sourceFiles
        .filter((file) => textExtensions.has(path.extname(file)))
        .map((file) => readFile(file, 'utf8'))
    )
  ).join('\n');
  const allUiText = `${index}\n${sourceText}`;
  const appPath = path.join(publishRoot, 'src', 'app.js');
  const appCheck = spawnSync(process.execPath, ['--check', appPath], { encoding: 'utf8' });
  if (appCheck.status !== 0) {
    errors.push(`src/app.js has a syntax error: ${(appCheck.stderr || appCheck.stdout).trim()}`);
  }

  for (const id of REQUIRED_UI_IDS) {
    if (!new RegExp(`id=["']${id}["']`).test(index)) errors.push(`Required UI control #${id} is missing from index.html.`);
  }
  if (!/\.\/src\/styles\.css/.test(index)) errors.push('index.html must load ./src/styles.css.');
  if (!/\.\/src\/app\.js/.test(index)) errors.push('index.html must load ./src/app.js.');
  if (!/<dialog[^>]*id=["']filter-dialog["']/s.test(index)) {
    errors.push('#filter-dialog must use the native dialog element.');
  }
  if (!/\.\/data\/generated\/site-data\.json/.test(sourceText)) {
    errors.push('The UI must load ./data/generated/site-data.json.');
  }
  if (!/person-card/.test(sourceText)) errors.push('The UI must render person-card buttons on the masonry board.');
  if (!/person-card-shell/.test(sourceText) || !/person-inline-detail/.test(sourceText) || !/aria-expanded/.test(sourceText)) {
    errors.push('Person details must expand accessibly inside each masonry card.');
  }
  if (/person-dialog/.test(allUiText)) errors.push('Person profiles must expand inline rather than opening in a dialog.');
  if (!/function animateCardReflow\b/.test(sourceText) || !/reducedMotionQuery/.test(sourceText)) {
    errors.push('Inline profile expansion must preserve orientation with reduced-motion-aware reflow behavior.');
  }
  if (!/owner_authorized_public_certificate/.test(sourceText) || !/safeCertificateUrl/.test(sourceText) || !/certificate-download/.test(allUiText)) {
    errors.push('Certificate previews must use the governed local-asset contract and offer a high-resolution download.');
  }
  if (!/avatar-name/.test(sourceText)) errors.push('The UI must include the full nickname fallback for unavailable or unapproved images.');
  if (/avatar(?:--|-)initials/.test(sourceText)) errors.push('Person-image fallback must use the full nickname, not initials.');
  if (!/\.card-avatar\s*\{[^}]*aspect-ratio:\s*1\s*;/s.test(sourceText) || !/\.detail-avatar\s*\{[^}]*aspect-ratio:\s*1\s*;/s.test(sourceText)) {
    errors.push('Person portraits must remain square in both collapsed and expanded cards.');
  }
  const engagementHistoryRenderer = sourceText.match(/function engagementCategoryForHistory\b[\s\S]*?(?=function renderCard\b)/)?.[0] ?? '';
  for (const field of ['model.engagements', 'recordId(engagement, "engagement")', 'program.names', 'cohortLabel', 'academicPlacementTypeFor']) {
    if (!engagementHistoryRenderer.includes(field)) {
      errors.push(`Repeat-engagement chips must consume ${field} from the complete engagement history.`);
    }
  }
  if (!/engagements\.length\s*<\s*2/.test(engagementHistoryRenderer)) {
    errors.push('Engagement-history chips must be reserved for people with more than one distinct engagement.');
  }
  if (!/data-engagement-id/.test(engagementHistoryRenderer)) {
    errors.push('Each engagement-history chip must retain its canonical engagementId.');
  }
  if (/role-badge/.test(engagementHistoryRenderer)) {
    errors.push('Engagement-history chips must stay flat and separate from the current-role badge.');
  }
  const cardRenderer = sourceText.match(/function renderCard\b[\s\S]*?(?=function filteredModels\b)/)?.[0] ?? '';
  if ((cardRenderer.match(/role-badge/g) ?? []).length !== 1 || !cardRenderer.includes('engagementHistoryMarkup(model)')) {
    errors.push('Each person card must keep one current-role badge and a separate repeat-engagement history row.');
  }
  const educationRenderer = sourceText.match(/function educationFor\b[\s\S]*?(?=function normalizedBoolean\b)/)?.[0] ?? '';
  const educationSummaryRenderer = sourceText.match(/function educationSummary\b[\s\S]*?(?=function programCode\b)/)?.[0] ?? '';
  if (!/shortProgram\s*=\s*degreeShort\s*\|\|\s*\(cardHasProgramAndInstitution\s*\?\s*cardParts\[0\]/s.test(educationRenderer) ||
      !/shortInstitution\s*=\s*\(cardHasProgramAndInstitution\s*\?\s*cardParts\.slice/s.test(educationRenderer)) {
    errors.push('Governed educationDisplay.card labels must take priority over canonical dimension abbreviations at runtime.');
  }
  if (!educationRenderer.includes('cardDisplay,') || !educationSummaryRenderer.includes('model.education.cardDisplay')) {
    errors.push('Person-specific governed education card labels must render intact, including labels without a middle-dot separator.');
  }
  const bioGate = sourceText.match(/function governedBioIsVisible\b[\s\S]*?(?=function buildModels\b)/)?.[0] ?? '';
  for (const field of [
    'owner_authorized_paraphrase_from_first_person_application',
    'first_person_application_exact_roster_match',
    'owner_authorized_synthesis_from_roster_evidence',
    'factual_role_education_and_work_evidence',
    'factual_fallback',
    'bounded_inference'
  ]) {
    if (!bioGate.includes(field)) errors.push(`Profile-copy rendering must recognize governed bio contract: ${field}.`);
  }
  if (!/\.engagement-chip-list\s*\{[^}]*flex-wrap:\s*wrap/s.test(sourceText) ||
      !/\.engagement-chip\s*\{[^}]*max-width:\s*100%/s.test(sourceText)) {
    errors.push('Engagement-history chips must wrap within the card at compact widths.');
  }
  const assetGate = sourceText.match(/function approvedAssetFor\b[\s\S]*?(?=function socialIsPublishable\b)/)?.[0] ?? '';
  for (const field of ['verificationStatus', 'consentStatus', 'rightsStatus', 'publicationBasis', 'ownerApproval', 'publicationStatus']) {
    if (!assetGate.includes(field)) errors.push(`Image rendering must gate on assets[].${field}.`);
  }
  const socialGate = sourceText.match(/function socialIsPublishable\b[\s\S]*?(?=function safeExternalUrl\b)/)?.[0] ?? '';
  for (const field of ['verificationStatus', 'consentStatus', 'publicationBasis', 'ownerApproval', 'publicationStatus']) {
    if (!socialGate.includes(field)) errors.push(`Social rendering must gate on socialProfiles[].${field}.`);
  }
  for (const field of [
    'names.nickname',
    'names.full',
    'educationDisplay.card',
    'educationDisplay.detail',
    'shortNames',
    'recipientPersonIds',
    'publicUrl'
  ]) {
    if (!sourceText.includes(field)) errors.push(`The UI must consume the generated schema field ${field}.`);
  }
  if (!/@media/.test(sourceText) || !/filter-dialog/.test(sourceText)) {
    errors.push('Responsive styles must treat #filter-dialog as the compact mobile filter surface.');
  }
  if (!/data-theme/.test(allUiText) || !/colorScheme/.test(allUiText) || !/theme-color/.test(allUiText)) {
    errors.push('Theme control must synchronize data-theme, color-scheme, and meta theme-color.');
  }
  if (!/documentElement\.lang|root\.lang/.test(allUiText)) {
    errors.push('Language control must synchronize the document language.');
  }
  if (!allUiText.includes('แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น')) {
    errors.push('The exact approved Thai Landom tagline is missing from the UI.');
  }
  if (/member:\s*["']Contributor["']/.test(allUiText)) {
    errors.push('The public UI must use “Team member” instead of the generic “Contributor” fallback.');
  }
  if (!sourceText.includes('period: periodForContribution(contribution)')) {
    errors.push('Contribution periods must use the governed month-and-year formatter instead of exposing exact response dates.');
  }
  if (!/fromUrl:\s*true,\s*animate:\s*false,\s*scroll:\s*true/.test(sourceText)) {
    errors.push('Deep-linked inline profiles must scroll into view on compact screens.');
  }
  if (/LanDOM/.test(allUiText)) errors.push('Use exact casing “Landom”; “LanDOM” is not allowed.');
}

async function validatePublishBoundary(publishRoot, errors, { distMode }) {
  const roots = distMode
    ? [publishRoot]
    : PUBLIC_BUILD_INPUTS.map((entry) => path.join(publishRoot, entry));
  const files = [];
  for (const root of roots) {
    try {
      const rootStat = await stat(root);
      if (rootStat.isFile()) files.push(root);
      else files.push(...(await walkFiles(root)));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  const forbidden = [
    [/contacts_internal/i, 'private contacts_internal dataset'],
    [/["'](?:email|phone|line_id|lineId|discord|cv_file_ids|cvFileIds)["']\s*:/i, 'private contact field'],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
    [/(?:api[_-]?key|access[_-]?token|client[_-]?secret)["']?\s*[:=]\s*["'][^"']{8,}/i, 'credential-shaped value'],
    [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, 'email address']
  ];
  for (const file of files) {
    if (!textExtensions.has(path.extname(file))) continue;
    const contents = await readFile(file, 'utf8');
    for (const [pattern, label] of forbidden) {
      if (pattern.test(contents)) errors.push(`${path.relative(publishRoot, file)} contains a ${label}.`);
    }
  }
  if (distMode) {
    const rawPath = path.join(publishRoot, 'data', 'raw');
    try {
      await stat(rawPath);
      errors.push('dist/data/raw exists; private source rows must never enter a public build.');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

async function validateAssetManifest(publishRoot, siteData, errors) {
  const manifestPath = path.join(repoRoot, 'docs', 'assets-manifest.json');
  const manifestText = await readIfPresent(manifestPath);
  if (manifestText === null) {
    errors.push('docs/assets-manifest.json is missing.');
    return;
  }
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    errors.push(`docs/assets-manifest.json is invalid JSON: ${error.message}`);
    return;
  }
  if (manifest?.policy?.defaultDecision !== 'deny') errors.push('Asset manifest policy must default to deny.');
  if (!Array.isArray(manifest?.assets)) {
    errors.push('Asset manifest assets must be an array.');
    return;
  }
  for (const asset of manifest.assets) {
    if (asset.approvalStatus !== 'approved') continue;
    const sourcePath = path.join(repoRoot, asset.path);
    let bytes;
    try {
      bytes = await readFile(sourcePath);
    } catch (error) {
      errors.push(`Approved asset ${asset.assetId} is missing at ${asset.path}.`);
      continue;
    }
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (digest !== asset.sha256) errors.push(`Approved asset ${asset.assetId} does not match its recorded SHA-256.`);
    const builtPath = path.join(publishRoot, asset.path);
    if (publishRoot !== repoRoot) {
      try {
        await stat(builtPath);
      } catch (error) {
        errors.push(`Approved asset ${asset.assetId} is missing from the build at ${asset.path}.`);
      }
    }
  }

  const peopleAssetRoot = path.join(publishRoot, 'public', 'assets', 'people');
  const peopleAssetFiles = await walkFiles(peopleAssetRoot);
  const declaredPaths = new Set(
    siteData.assets
      .filter((asset) => isPublic(asset) && isVerified(asset) && hasAssetPublicationAuthority(asset) && hasRights(asset))
      .map((asset) => String(valueAt(asset, ['publicPath', 'path', 'src', 'publicUrl']) ?? '').replace(/^\.\//, ''))
  );
  for (const file of peopleAssetFiles) {
    const relativePath = path.relative(publishRoot, file).split(path.sep).join('/');
    if (!declaredPaths.has(relativePath)) errors.push(`Person image ${relativePath} has no fully approved public assets[] record.`);
  }

  const certificateAssetRoot = path.join(publishRoot, 'public', 'assets', 'certificates');
  const certificateAssetFiles = await walkFiles(certificateAssetRoot);
  const declaredCertificates = new Map(
    siteData.certificates
      .filter((certificate) => isPublic(certificate) && isVerified(certificate) && hasCertificatePublicationAuthority(certificate) && hasRights(certificate))
      .map((certificate) => [String(certificate.publicPath ?? '').replace(/^\.\//, ''), certificate])
  );
  for (const file of certificateAssetFiles) {
    const relativePath = path.relative(publishRoot, file).split(path.sep).join('/');
    const certificate = declaredCertificates.get(relativePath);
    if (!certificate) {
      errors.push(`Certificate image ${relativePath} has no fully governed public certificates[] record.`);
      continue;
    }
    const bytes = await readFile(file);
    if (bytes.byteLength !== certificate.bytes) errors.push(`Certificate byte count does not match for ${certificate.certificateId}.`);
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (digest !== certificate.sha256) errors.push(`Certificate SHA-256 does not match for ${certificate.certificateId}.`);
  }
  for (const [relativePath, certificate] of declaredCertificates) {
    try {
      await stat(path.join(publishRoot, relativePath));
    } catch (error) {
      errors.push(`Governed certificate ${certificate.certificateId} is missing from the build at ${relativePath}.`);
    }
  }
}

async function validateGeneratedParity(publishRoot, siteData, errors) {
  const fileMap = {
    meta: 'meta.json',
    copy: 'copy.json',
    institutions: 'institutions.json',
    programs: 'programs.json',
    educationRecords: 'education-records.json',
    people: 'people.json',
    engagements: 'engagements.json',
    works: 'works.json',
    contributions: 'contributions.json',
    achievements: 'achievements.json',
    socialProfiles: 'social-profiles.json',
    assets: 'assets.json',
    certificates: 'certificates.json'
  };
  for (const [key, filename] of Object.entries(fileMap)) {
    const filePath = path.join(publishRoot, 'data', 'generated', filename);
    const text = await readIfPresent(filePath);
    if (text === null) {
      errors.push(`data/generated/${filename} is missing.`);
      continue;
    }
    try {
      const value = JSON.parse(text);
      if (JSON.stringify(value) !== JSON.stringify(siteData[key])) {
        errors.push(`data/generated/${filename} does not match site-data.json.${key}.`);
      }
    } catch (error) {
      errors.push(`data/generated/${filename} is invalid JSON: ${error.message}`);
    }
  }
}

async function validateDiscovery(publishRoot, errors) {
  const canonicalUrl = 'https://montri-th.github.io/Landom/';
  const index = await readIfPresent(path.join(publishRoot, 'index.html'));
  const robots = await readIfPresent(path.join(publishRoot, 'robots.txt'));
  const sitemap = await readIfPresent(path.join(publishRoot, 'sitemap.xml'));
  if (robots === null) errors.push('robots.txt is missing.');
  else {
    if (!/^User-agent:\s*\*$/m.test(robots) || !/^Allow:\s*\/$/m.test(robots)) {
      errors.push('robots.txt must explicitly allow the public root for all crawlers.');
    }
    if (!robots.includes(`Sitemap: ${canonicalUrl}sitemap.xml`)) {
      errors.push('robots.txt must reference the canonical root sitemap URL.');
    }
  }
  if (sitemap === null) errors.push('sitemap.xml is missing.');
  else {
    if (!sitemap.includes(`<loc>${canonicalUrl}</loc>`)) errors.push('sitemap.xml is missing the canonical public route.');
    if ((sitemap.match(/<loc>/g) ?? []).length !== 1) {
      errors.push('sitemap.xml must contain the single canonical route for this one-page site.');
    }
  }
  if (index !== null) {
    if (!index.includes(`<link rel="canonical" href="${canonicalUrl}">`)) {
      errors.push('index.html canonical URL does not match the published GitHub Pages route.');
    }
    if (/<link[^>]+rel=["'][^"']*(?:icon|apple-touch-icon)/i.test(index) || /property=["']og:image["']/i.test(index)) {
      errors.push('Do not fabricate favicon or social-image roles from the horizontal header lockup.');
    }
  }
}

async function validateBuildManifest(publishRoot, errors) {
  const manifestPath = path.join(publishRoot, 'build-manifest.json');
  const manifestText = await readIfPresent(manifestPath);
  if (manifestText === null) {
    errors.push('dist/build-manifest.json is missing.');
    return;
  }
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    errors.push(`dist/build-manifest.json is invalid JSON: ${error.message}`);
    return;
  }
  if (manifest.formatVersion !== 1 || manifest.reproducible !== true) {
    errors.push('dist/build-manifest.json must declare formatVersion 1 and reproducible true.');
  }
  if (JSON.stringify(manifest.inputs) !== JSON.stringify(PUBLIC_BUILD_INPUTS)) {
    errors.push('dist/build-manifest.json inputs do not match the public build allowlist.');
  }
  if (!Array.isArray(manifest.files)) {
    errors.push('dist/build-manifest.json files must be an array.');
    return;
  }

  const actualFiles = (await walkFiles(publishRoot)).filter((file) => file !== manifestPath);
  const actualPaths = actualFiles.map((file) => path.relative(publishRoot, file).split(path.sep).join('/'));
  const recordedPaths = manifest.files.map((record) => record?.path);
  if (JSON.stringify(recordedPaths) !== JSON.stringify(actualPaths)) {
    errors.push('dist/build-manifest.json file list/order does not exactly match the built artifact.');
  }

  const seen = new Set();
  for (const record of manifest.files) {
    if (!record || typeof record.path !== 'string') {
      errors.push('dist/build-manifest.json contains a record without a path.');
      continue;
    }
    if (seen.has(record.path)) errors.push(`dist/build-manifest.json duplicates ${record.path}.`);
    seen.add(record.path);
    const normalized = path.posix.normalize(record.path.replaceAll('\\', '/'));
    if (normalized !== record.path || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
      errors.push(`dist/build-manifest.json contains unsafe path ${record.path}.`);
      continue;
    }
    let bytes;
    try {
      bytes = await readFile(path.join(publishRoot, record.path));
    } catch (error) {
      errors.push(`dist/build-manifest.json references missing file ${record.path}.`);
      continue;
    }
    if (record.bytes !== bytes.byteLength) errors.push(`Build byte count does not match for ${record.path}.`);
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (record.sha256 !== digest) errors.push(`Build SHA-256 does not match for ${record.path}.`);
  }
}

export async function validateSite({ distMode = false } = {}) {
  const errors = [];
  const publishRoot = distMode ? path.join(repoRoot, 'dist') : repoRoot;
  const dataPath = path.join(publishRoot, 'data', 'generated', 'site-data.json');
  const dataText = await readIfPresent(dataPath);
  let siteData;
  if (dataText === null) {
    errors.push(`${path.relative(repoRoot, dataPath)} is missing. Run npm run normalize from an authorized local snapshot.`);
    siteData = Object.fromEntries(REQUIRED_DATASETS.map((key) => [key, []]));
  } else {
    try {
      siteData = JSON.parse(dataText);
      errors.push(...validateDataContract(siteData));
    } catch (error) {
      errors.push(`${path.relative(repoRoot, dataPath)} is invalid JSON: ${error.message}`);
      siteData = Object.fromEntries(REQUIRED_DATASETS.map((key) => [key, []]));
    }
  }

  await validateUi(publishRoot, errors);
  await validatePublishBoundary(publishRoot, errors, { distMode });
  await validateAssetManifest(publishRoot, siteData, errors);
  await validateGeneratedParity(publishRoot, siteData, errors);
  await validateDiscovery(publishRoot, errors);
  if (distMode) await validateBuildManifest(publishRoot, errors);
  return errors;
}

async function main() {
  const distMode = process.argv.includes('--dist');
  const errors = await validateSite({ distMode });
  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Validated ${distMode ? 'dist' : 'source'}: data, privacy, assets, naming, and UI contracts pass.`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) await main();
