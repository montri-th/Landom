import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PERSON_ID_PATTERN = /^[SPI][0-9]{4}$/;
const PUBLIC_WEB_SOCIAL_PLATFORMS = new Set(['linkedin', 'github']);
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
  'llms.txt',
  'robots.txt',
  'sitemap.xml',
  'src',
  'public',
  'data/generated'
]);

export const REQUIRED_UI_IDS = [
  'language-toggle',
  'theme-toggle',
  'menu-toggle',
  'site-menu-layer',
  'site-menu',
  'join-team-link',
  'join-team-link-mobile',
  'preference-controls',
  'people',
  'all-products-link',
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
const SOCIAL_PREVIEW = Object.freeze({
  path: 'public/assets/social/landom-people-og.jpg',
  url: 'https://montri-th.github.io/Landom/public/assets/social/landom-people-og.jpg?v=a7c46cf31e97',
  mimeType: 'image/jpeg',
  width: 1200,
  height: 630,
  bytes: 211478,
  sha256: 'a7c46cf31e976e420f78eb324ed9c41cbbdb5b91be28849ec6e307cf4ca5865c',
  cacheRevision: 'a7c46cf31e97',
  alt: {
    th: 'ชาว Landom ถ่ายภาพร่วมกันที่สำนักงาน Landometer',
    en: 'People of Landom together at the Landometer office'
  }
});
const MATERIAL_SYMBOLS_EXTERNAL = Object.freeze({
  path: 'public/assets/fonts/material-symbols-rounded-open-in-new-300.woff2',
  licensePath: 'public/assets/fonts/licenses/material-symbols-Apache-2.0.txt',
  bytes: 1124,
  sha256: '778b29f8befe5ba7a8f0f8188d4c12e3c53d00810dac10337609b04d8506d46e',
  family: 'Material Symbols Rounded',
  subset: 'open_in_new',
  axesLock: 'FILL 0, wght 300, GRAD 0, opsz 20'
});
const MATERIAL_SYMBOLS_NAV = Object.freeze({
  path: 'public/assets/fonts/material-symbols-rounded-nav-300.woff2',
  licensePath: 'public/assets/fonts/licenses/material-symbols-Apache-2.0.txt',
  bytes: 2500,
  sha256: 'd7e283106ed2898726b24504c4e0f5ad524292984a90a4d29553c7dcf53b9657',
  family: 'Material Symbols Rounded Nav',
  subset: 'unified-nav-7',
  axesLock: 'FILL 0, wght 300, GRAD 0, opsz 24',
  glyphs: ['open_in_new', 'menu', 'close', 'light_mode', 'dark_mode', 'contrast', 'groups'],
  approvalAuthority: 'Owner-approved Landom-local alignment',
  designSystemStatus: 'Candidate local extension; not a normative Design System release'
});
const MATERIAL_SYMBOLS_FOOTER = Object.freeze({
  path: 'public/assets/fonts/material-symbols-rounded-footer-r10.ttf',
  licensePath: 'public/assets/fonts/licenses/material-symbols-Apache-2.0.txt',
  bytes: 9464,
  sha256: 'bbcc034717d243cd5a3653dd1169cec00e8f11f289c20ef949078db24dc680f5',
  family: 'Material Symbols Rounded Footer',
  subset: 'rebuild02-footer-r10',
  axesLock: 'FILL 0, wght 300, GRAD 0, opsz 24',
  glyphs: [
    'arrow_downward',
    'arrow_forward',
    'close',
    'compare_arrows',
    'dark_mode',
    'expand_more',
    'graphic_eq',
    'groups',
    'handshake',
    'light_mode',
    'location_searching',
    'mail',
    'map',
    'menu',
    'monitoring',
    'newspaper',
    'place',
    'query_stats',
    'radar',
    'send',
    'share',
    'square_foot',
    'task_alt',
    'visibility',
    'widgets'
  ],
  source: 'Exact Apache-2.0-licensed font bytes used by the published rebuild02 ui-20260830-11 reference',
  approvalAuthority: 'Owner instruction on 2026-08-31 to align the Landom footer map action with rebuild02',
  designSystemStatus: 'Reference-aligned Landom-local addition; not a normative Design System release'
});
const MATERIAL_SYMBOL_FONTS = Object.freeze([
  MATERIAL_SYMBOLS_EXTERNAL,
  MATERIAL_SYMBOLS_NAV,
  MATERIAL_SYMBOLS_FOOTER
]);

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

function jpegDimensions(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const startOfFrameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    while (offset < bytes.length && bytes[offset] !== 0xff) offset += 1;
    while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
    if (offset >= bytes.length) break;
    const marker = bytes[offset];
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (marker === 0xda || offset + 2 > bytes.length) break;
    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) break;
    if (startOfFrameMarkers.has(marker) && segmentLength >= 7) {
      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5)
      };
    }
    offset += segmentLength;
  }
  return null;
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
  const peopleWithPrimaryEducation = new Set(data.educationRecords
    .filter((record) => record.isPrimary === true)
    .map((record) => record.personId));

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
      part_time: { prefix: 'P', educationMode: 'qualification' },
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
      const ownerDetailRequiredWithoutPrimaryEducation =
        normalizeText(valueAt(person.educationDisplay ?? {}, ['verificationStatus'])) === 'owner_detail_required' &&
        !peopleWithPrimaryEducation.has(person.personId);
      for (const field of ['card.th', 'card.en', 'detail.th', 'detail.en']) {
        if (!ownerDetailRequiredWithoutPrimaryEducation && !valueAt(person.educationDisplay ?? {}, [field])) {
          errors.push(`Person ${person.personId} is missing role-aware educationDisplay.${field}.`);
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
    const platform = normalizeText(profile.platform);
    if (hasPublicUrl(profile) && !PUBLIC_WEB_SOCIAL_PLATFORMS.has(platform)) {
      errors.push(`Social profile ${profile.socialProfileId} exposes unsupported public platform ${profile.platform}; only LinkedIn and GitHub may appear on the web.`);
    }
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
  for (const sourceModule of ['app.js', 'navigation.js', 'approach-motion.js', 'media-parallax.js']) {
    const sourcePath = path.join(publishRoot, 'src', sourceModule);
    const sourceCheck = spawnSync(process.execPath, ['--check', sourcePath], { encoding: 'utf8' });
    if (sourceCheck.status !== 0) {
      errors.push(`src/${sourceModule} has a syntax error: ${(sourceCheck.stderr || sourceCheck.stdout).trim()}`);
    }
  }

  for (const id of REQUIRED_UI_IDS) {
    if (!new RegExp(`id=["']${id}["']`).test(index)) errors.push(`Required UI control #${id} is missing from index.html.`);
  }
  if (!/\.\/src\/styles\.css/.test(index)) errors.push('index.html must load ./src/styles.css.');
  if (!/\.\/src\/app\.js/.test(index)) errors.push('index.html must load ./src/app.js.');
  const joinTeamUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdGVOA--7YLOP2Go4hB-Edj4452MPJyVuWsPDi_O9H2jM6wiw/viewform';
  if (!/<header[^>]*data-navigation-header[^>]*>[\s\S]*?<div class="header-identity">[\s\S]*?<nav class="header-nav"/s.test(index)) {
    errors.push('The unified header must preserve the approved identity-first structure and product navigation.');
  }
  if (!/<a class="brand" href="https:\/\/landometer\.com\/"[\s\S]*?landometer-horizontal\.png\?v=6c71c10505ca/s.test(index) ||
      !/<span class="brand-product"[^>]*>[\s\S]*?Landom<\/span>/.test(index)) {
    errors.push('The unified header must retain the approved Landometer lockup with the Landom product indicator.');
  }
  for (const destination of ['https://montri-th.github.io/CityMETER/', 'https://landometer.com/v3/citywiki']) {
    if (!index.includes(`href="${destination}"`)) errors.push(`The unified navigation is missing ${destination}.`);
  }
  if ((index.match(new RegExp(`href="${joinTeamUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g')) ?? []).length !== 3) {
    errors.push('The unified navigation must expose the exact join-team destination in desktop, compact-menu, and fail-open contexts.');
  }
  if (
    (index.match(/class="header-cta-sweep"/g) ?? []).length !== 2 ||
    !/<a[^>]*class="header-cta"[^>]*id="join-team-link"[^>]*>[\s\S]*?<span class="header-cta-label">สมัครร่วมทีม<\/span>[\s\S]*?<span class="header-cta-sweep" aria-hidden="true">สมัครร่วมทีม<\/span>[\s\S]*?<\/a>/s.test(index) ||
    !/<a[^>]*class="header-cta site-menu-mobile-cta"[^>]*id="join-team-link-mobile"[^>]*>[\s\S]*?<span class="header-cta-label">สมัครร่วมทีม<\/span>[\s\S]*?<span class="header-cta-sweep" aria-hidden="true">สมัครร่วมทีม<\/span>[\s\S]*?<\/a>/s.test(index)
  ) {
    errors.push('The desktop and compact-menu CTAs must each preserve one visible label and one aria-hidden r7 sweep label.');
  }
  if (
    !/function setLayeredActionText\b[\s\S]*?querySelectorAll\("\.header-cta-label, \.header-cta-sweep"\)[\s\S]*?layers\.forEach\(\(layer\) => setText\(layer, value\)\)/.test(sourceText) ||
    !/joinTeamLinks\?\.forEach\(\(link\) => setLayeredActionText\(link, copy\.joinTeam\)\)/.test(sourceText) ||
    /joinTeamLinks\?\.forEach\(\(link\) => setText\(link, copy\.joinTeam\)\)/.test(sourceText)
  ) {
    errors.push('Hydrated localization must update both CTA text layers without replacing the r7 sweep structure.');
  }
  if (!/<button[\s\S]*?id="menu-toggle"[\s\S]*?aria-haspopup="dialog"[\s\S]*?aria-expanded="false"[\s\S]*?aria-controls="site-menu"/s.test(index) ||
      !/<div class="site-menu-panel" id="site-menu" role="dialog" aria-modal="true"[^>]*tabindex="-1"/s.test(index)) {
    errors.push('The site menu must be an explicitly controlled modal disclosure with a focusable dialog panel.');
  }
  if ((index.match(/<a href="#people" data-menu-close>/g) ?? []).length !== 1 ||
      /bookmark-rail|data-scrollspy-link/.test(index) ||
      /href="#certificates"/.test(index) ||
      /railLinks|railSections|syncScrollspy/.test(sourceText)) {
    errors.push('On-page navigation must retain one compact-menu #people link, remove the obsolete one-item bookmark rail, and avoid dead certificate anchors.');
  }
  if (!/<nav class="navigation-fallback"[^>]*>[\s\S]*?class="navigation-fallback-language" href="\.\/en\/" hreflang="en"/s.test(index) ||
      !/root\.classList\.add\('navigation-enhanced'\)/.test(sourceText) ||
      !/html\.navigation-enhanced \.navigation-fallback\s*\{[^}]*display:\s*none;/s.test(sourceText)) {
    errors.push('Compact navigation must retain a crawlable fail-open fallback until the JavaScript controller is ready.');
  }
  if (!/id="language-toggle"[\s\S]*?href="\.\/en\/"[\s\S]*?hreflang="en"/s.test(index)) {
    errors.push('The Thai entrypoint must expose English as a crawlable sibling route.');
  }
  if (!/import \{ initSiteNavigation \} from "\.\/navigation\.js";/.test(sourceText) ||
      !/initSiteNavigation\(\);/.test(sourceText)) {
    errors.push('The unified navigation controller must be imported and initialized.');
  }
  const navigationSource = await readIfPresent(path.join(publishRoot, 'src', 'navigation.js')) ?? '';
  for (const token of [
    "event.key === 'Escape'",
    "event.key !== 'Tab'",
    "toggle.setAttribute('aria-expanded'",
    "toggle.focus({ preventScroll: true })",
    "url.origin === here.origin",
    "url.pathname === here.pathname",
    "document.getElementById(decodeURIComponent(url.hash.slice(1)))",
    "setMenuOpen(false, { returnFocus: !destination })",
    "if (destination) event.preventDefault()",
    "window.history.pushState({}, '', nextUrl)",
    "destination.scrollIntoView({ block: 'start' })",
    "'(prefers-reduced-motion: reduce)'",
    "root.dataset.navState = 'calm'",
    "window.addEventListener('pageshow'"
  ]) {
    if (!navigationSource.includes(token)) errors.push(`The unified navigation controller is missing its accessibility/state contract: ${token}.`);
  }
  if (
    !/new WeakMap\(\)/.test(navigationSource) ||
    !/document\.addEventListener\(['"]scroll['"],\s*\w+,\s*true\)/.test(navigationSource) ||
    !/document\.scrollingElement/.test(navigationSource) ||
    !/\.get\(\w+\)/.test(navigationSource) ||
    !/\.set\(\w+,\s*\w+\)/.test(navigationSource) ||
    !/delta\s*>\s*4/.test(navigationSource) ||
    !/delta\s*<\s*-4/.test(navigationSource) ||
    !/(?:currentY|scrollY|scrollTop)\s*<\s*24/.test(navigationSource)
  ) {
    errors.push('Deep-calm navigation must capture bubbling and nested scrolls, keep last position per scroller, use a delta greater than 4 pixels, and restore prominent state near the top.');
  }
  if (!/\.site-header\.is-calm\s*\{/.test(sourceText) ||
      !/:root\[data-nav-state="calm"\]/.test(sourceText) ||
      !/@media \(prefers-reduced-motion: reduce\)[\s\S]*?--site-header-height:\s*var\(--site-header-height-prominent\)/s.test(sourceText)) {
    errors.push('The prominent/calm header states must retain a reduced-motion-safe CSS contract.');
  }
  if (
    !/--site-header-height-prominent:\s*76px;/.test(sourceText) ||
    !/--site-header-height-calm:\s*29px;/.test(sourceText) ||
    !/@media \(max-width:\s*759px\)[\s\S]*?--site-header-height-prominent:\s*68px;[\s\S]*?--site-header-height-calm:\s*27px;/s.test(sourceText) ||
    !/\.site-header\.is-calm\s*\{(?=[^}]*background:\s*color-mix\(in srgb,\s*var\(--surface-canvas\)\s*26%,\s*transparent\);)(?=[^}]*border-bottom(?:-color)?:\s*(?:1px solid )?color-mix\(in srgb,\s*var\(--border-hairline\)\s*20%,\s*transparent\);)[^}]*\}/s.test(sourceText) ||
    !/\.site-header\.is-calm\s+(?:\.header-inner|\.header-row|\.site-header__row)\s*\{(?=[^}]*width:\s*200%;)(?=[^}]*opacity:\s*(?:0?\.72|72%);)(?=[^}]*transform:\s*scale\((?:0?\.5)\);)[^}]*\}/s.test(sourceText)
  ) {
    errors.push('The r7 deep-calm header must preserve 76→29 desktop and 68→27 mobile heights, 26% canvas/20% hairline glass, and a 200% row scaled to 0.5 at 72% opacity.');
  }
  if (!/\.site-header\.is-calm \.menu-toggle::before\s*\{(?=[^}]*width:\s*max\(100%,\s*88px\);)(?=[^}]*height:\s*88px;)(?=[^}]*pointer-events:\s*auto;)[^}]*\}/s.test(sourceText) ||
      !/\.site-header\.is-calm \.header-nav\s*\{[^}]*gap:\s*22px;/s.test(sourceText)) {
    errors.push('Deep-calm controls must retain unambiguous 44px rendered pointer targets through 88px pre-transform hit areas and a non-overlapping 22px pre-transform navigation gap.');
  }
  if (/url\.search === here\.search/.test(navigationSource)) {
    errors.push('Same-path menu anchors must preserve the current query string instead of treating a query difference as cross-document navigation.');
  }
  if (
    !/\.site-menu-panel\s*\{[^}]*top:\s*(?:6px|calc\(var\(--site-header-height(?:-prominent)?\)\s*\+\s*6px\));[^}]*width:\s*(?:min\(340px,[^)]+\)|340px);[^}]*padding:\s*(?:8px|var\(--space-2\));[^}]*border:\s*1px solid var\(--border-default\);[^}]*border-radius:\s*var\(--radius-md\);[^}]*box-shadow:\s*var\(--elevation-sm\);/s.test(sourceText) ||
    !/@media \(max-width:\s*759px\)[\s\S]*?\.site-menu-panel\s*\{[^}]*top:\s*(?:0|var\(--site-header-height\));[^}]*width:\s*100%;[^}]*border-radius:\s*0 0 var\(--radius-md\) var\(--radius-md\);/s.test(sourceText)
  ) {
    errors.push('The menu must preserve r7 geometry: 340px desktop width, 6px offset, 8px padding, default border, medium radius/small shadow, and the full-width compact panel.');
  }
  if (
    !/\.header-cta\s*\{(?=[^}]*position:\s*relative;)(?=[^}]*display:\s*inline-flex;)[^}]*\}/s.test(sourceText) ||
    !/\.header-cta-sweep\s*\{(?=[^}]*position:\s*absolute;)(?=[^}]*background:\s*var\(--energy-yellow\);)(?=[^}]*color:\s*var\(--fg-on-light-primary\);)(?=[^}]*animation:\s*lmSweep 3\.7s var\(--motion-ease-state\) infinite,\s*lmFlick 1\.09s steps\(1,\s*end\) infinite;)(?=[^}]*pointer-events:\s*none;)[^}]*\}/s.test(sourceText) ||
    !/@keyframes lmSweep\s*\{[\s\S]*?23%\s*,\s*27%\s*\{[^}]*clip-path:\s*inset\(0(?:\s+0\s+0\s+0)?\)/s.test(sourceText) ||
    !/@keyframes lmSweep\s*\{[\s\S]*?53%\s*,\s*55%\s*\{[^}]*clip-path:\s*inset\(0(?:\s+0\s+0\s+0)?\)/s.test(sourceText) ||
    !/@keyframes lmSweep\s*\{[\s\S]*?84%\s*,\s*89%\s*\{[^}]*clip-path:\s*inset\(0(?:\s+0\s+0\s+0)?\)/s.test(sourceText) ||
    !/@keyframes lmFlick\s*\{/.test(sourceText)
  ) {
    errors.push('The CTA must preserve the r7 lmSweep 3.7s/lmFlick 1.09s treatment and all three full-word highlight beats.');
  }
  if (/Material Symbols Rounded Nav Filled|material-symbols-rounded-groups-filled-300|\.bookmark-rail/.test(sourceText)) {
    errors.push('The removed bookmark rail must not leave a filled-groups font face or rail styling in the public UI.');
  }
  if (!/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.header-cta-sweep\s*\{[^}]*(?:display:\s*none|clip-path:\s*inset\(0\s+98%\s+0\s+0\)\s*!important);/s.test(sourceText)) {
    errors.push('Reduced-motion mode must keep the header prominent and suppress the moving CTA sweep.');
  }

  if (!/import \{ initApproachMotion \} from "\.\/approach-motion\.js";/.test(sourceText) ||
      !/initApproachMotion\(\);/.test(sourceText)) {
    errors.push('The bounded approach-motion adapter must be imported and initialized.');
  }

  const mediaParallaxSource = await readIfPresent(path.join(publishRoot, 'src', 'media-parallax.js')) ?? '';
  const staticParallaxMarkers = index.match(/\bdata-parallax-media\b/g) ?? [];
  const staticParallaxDepths = [...index.matchAll(/\bdata-parallax-depth="(\d+)"/g)].map((match) => Number(match[1]));
  const avatarRenderer = sourceText.match(/function avatarMarkup\b[\s\S]*?(?=function hydrateImages\b)/)?.[0] ?? '';
  const certificateRenderer = sourceText.match(/function certificatesMarkup\b[\s\S]*?(?=function personDetailMarkup\b)/)?.[0] ?? '';
  if (
    !/import \{ initMediaParallax \} from "\.\/media-parallax\.js";/.test(sourceText) ||
    !/mediaParallaxController\s*=\s*initMediaParallax\(\)/.test(sourceText) ||
    !/mediaParallaxController\?\.refresh\(elements\.board\)/.test(sourceText) ||
    staticParallaxMarkers.length !== 4 ||
    JSON.stringify(staticParallaxDepths) !== JSON.stringify([32, 20, 18, 22]) ||
    !/class="avatar-image"[^>]*data-parallax-media[^>]*data-parallax-depth="14"/.test(avatarRenderer) ||
    /data-parallax-media/.test(certificateRenderer) ||
    /<img[^>]*(?:landometer-horizontal|landometer-symbol)[^>]*data-parallax-media/i.test(index)
  ) {
    errors.push('Photo parallax must be initialized once, refresh generated portraits, mark exactly four static Hero photos plus approved portraits, and exclude certificates and brand assets.');
  }
  for (const token of [
    'const MEDIA_SELECTOR = "img[data-parallax-media]"',
    'const MAX_DEPTH = 36',
    'maxOffset: parallaxBleedLimit(frameRect.height, scale)',
    'image.parentElement?.getBoundingClientRect?.()',
    'new win.IntersectionObserver',
    'win.requestAnimationFrame',
    'win.cancelAnimationFrame',
    'addWindowListener("scroll", onScroll, { passive: true })',
    '"(prefers-reduced-motion: reduce)"',
    'win?.matchMedia?.("print")',
    'addWindowListener("beforeprint", onBeforePrint)',
    'addWindowListener("pagehide", onPageHide)',
    'destroy()'
  ]) {
    if (!mediaParallaxSource.includes(token)) errors.push(`The media-parallax controller is missing its bounded lifecycle contract: ${token}.`);
  }
  if (
    !/html\.media-parallax-enabled img\[data-parallax-media\]\.is-media-parallax-active\s*\{[^}]*will-change:\s*transform;/s.test(sourceText) ||
    !/@media print[\s\S]*?img\[data-parallax-media\]\s*\{[^}]*transform:\s*none !important;[^}]*will-change:\s*auto !important;/s.test(sourceText) ||
    !/@media \(prefers-reduced-motion: reduce\)[\s\S]*?img\[data-parallax-media\]\s*\{[^}]*transform:\s*none !important;[^}]*will-change:\s*auto !important;/s.test(sourceText)
  ) {
    errors.push('Parallax CSS must remain opt-in and reset transforms for print and reduced-motion users.');
  }

  const footerMarkup = index.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '';
  const corporateSocialUrls = [
    'https://www.facebook.com/landometer',
    'https://www.instagram.com/landometer',
    'https://www.tiktok.com/@landometer82',
    'https://www.linkedin.com/company/landometer',
    'https://x.com/landometer'
  ];
  if (
    !/class="footer-main"[^>]*data-approach-sequence/.test(footerMarkup) ||
    !/class="footer-measure-line"[\s\S]*?<span><\/span><span><\/span><span><\/span><span><\/span>/.test(footerMarkup) ||
    /<form\b|id="footer-title">\s*Hello\b/i.test(footerMarkup) ||
    !/href="mailto:hello@landometer\.com">hello@landometer\.com<\/a>/.test(footerMarkup) ||
    !/href="https:\/\/maps\.app\.goo\.gl\/8DQPVMtPdxWMBoZU9"/.test(footerMarkup) ||
    !/href="https:\/\/landometer\.com\/pdpa\/showDocVer"/.test(footerMarkup) ||
    !/id="footer-top-link" href="#top"/.test(footerMarkup) ||
    !/id="footer-people-link" href="#people"/.test(footerMarkup) ||
    !/class="footer-brand"[\s\S]*?public\/assets\/brand\/landometer-horizontal\.png/.test(footerMarkup) ||
    corporateSocialUrls.some((url) => (footerMarkup.split(`href="${url}"`).length - 1) !== 1)
  ) {
    errors.push('The footer must use the approved contact-first layout without a Hello form and expose the exact corporate contact, social, privacy, brand, and real-page destinations.');
  }
  if (
    !/\.site-footer\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*#89CEF6 0%,\s*#5ECAD6 50%,\s*#6CD5B3 100%\);/s.test(sourceText) ||
    !/\.footer-measure-line\s*\{[^}]*height:\s*8px;[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/s.test(sourceText) ||
    !/\.footer-bottom\s*\{[^}]*border-top:\s*1px solid #33403D;[^}]*background:\s*#11191D;/s.test(sourceText) ||
    !/\.footer-social-links a\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;[^}]*border-radius:\s*50%;/s.test(sourceText)
  ) {
    errors.push('The footer must preserve the rebuild02 measure strip, luminous gradient, circular social actions, and dark lower band.');
  }
  if (
    !index.includes(`<link rel="preload" href="./${MATERIAL_SYMBOLS_FOOTER.path}" as="font" type="font/ttf" crossorigin>`) ||
    !/@font-face\s*\{[^}]*font-family:\s*"Material Symbols Rounded Footer";[^}]*material-symbols-rounded-footer-r10\.ttf[^}]*font-weight:\s*300;/s.test(sourceText) ||
    !/class="icon-symbol footer-map-icon"[^>]*>map<\/span>/.test(footerMarkup) ||
    !/\.footer-map-icon\s*\{[^}]*font-family:\s*"Material Symbols Rounded Footer";[^}]*font-variation-settings:\s*"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;/s.test(sourceText)
  ) {
    errors.push('The footer map action must preload and use the exact governed rebuild02 r10 Material Symbols font face.');
  }
  for (const localizedToken of [
    'footerTitle: "มาเป็นชาว Landom กัน"',
    'footerTitle: "Be part of Landom"',
    'footerSocialLabel: "ช่องทางสังคมของ Landometer"',
    'footerSocialLabel: "Landometer social profiles"',
    'footerBackTop: "กลับไปด้านบน"',
    'footerBackTop: "Back to top"',
    'footerPeople: "ชาว Landom"',
    'footerPeople: "People of Landom"',
    'setText(elements.footerTitle, copy.footerTitle)',
    'elements.footerSocialLinks?.setAttribute("aria-label", copy.footerSocialLabel)',
    'setText(elements.footerTopLink, copy.footerBackTop)',
    'setText(elements.footerPeopleLink, copy.footerPeople)'
  ]) {
    if (!sourceText.includes(localizedToken)) errors.push(`The footer localization contract is missing: ${localizedToken}.`);
  }
  if (!/root\.classList\.add\("lds-motion-pending"\)/.test(index) ||
      !/"IntersectionObserver" in window/.test(index) ||
      !/prefers-reduced-motion: reduce/.test(index) ||
      !/matchMedia\("print"\)/.test(index)) {
    errors.push('The pre-paint motion bootstrap must remain capability-, reduced-motion-, and print-gated.');
  }
  if (!/data-approach="section_opener"/.test(index) ||
      (index.match(/data-approach="paired_inline"/g) ?? []).length !== 2 ||
      !/data-approach-sequence/.test(index)) {
    errors.push('Approach motion must remain opt-in on bounded semantic units with an explicit two-item sequence.');
  }
  const approachMotionSource = await readIfPresent(path.join(publishRoot, 'src', 'approach-motion.js')) ?? '';
  for (const token of [
    'threshold: 0.14',
    'rootMargin: "0px 0px -12% 0px"',
    'const INIT_WATCHDOG_MS = 2400',
    'const STAGGER_STEP_MS = 120',
    'const STAGGER_CAP_MS = 600',
    'const TRANSFORM_SETTLE_MS = 640',
    'function failOpen',
    'function onFocusIn',
    'function onHashChange',
    'function onPageShow',
    'function onBeforePrint',
    'function onReducedMotionChange',
    'const atDocumentEnd = Math.ceil',
    '(atDocumentEnd && overlapsBlockViewport)',
    'isForbiddenTarget',
    'hasAlreadyPainted'
  ]) {
    if (!approachMotionSource.includes(token)) errors.push(`The hardened approach-motion adapter is missing: ${token}.`);
  }
  for (const excludedTarget of ['"header"', '"nav"', '"h1"', '"[aria-live]"', '".hero"']) {
    if (!approachMotionSource.includes(excludedTarget)) errors.push(`Approach motion must exclude critical target ${excludedTarget}.`);
  }
  if (!/html\.lds-motion-ready \[data-approach\]\.is-lds-reveal-armed/.test(sourceText) ||
      /html\.lds-motion-pending \[data-approach\]/.test(sourceText) ||
      !/--lds-reveal-delay/.test(sourceText) ||
      !/__LANDOM_MOTION_WATCHDOG__[\s\S]*?setTimeout[\s\S]*?2400/.test(index) ||
      !/function clearBootstrapWatchdog\(\)/.test(approachMotionSource) ||
      !/--motion-ease-settle:\s*cubic-bezier\(0\.2, 0\.9, 0\.25, 1\.08\)/.test(sourceText) ||
      !/--motion-duration-reveal-opacity:\s*640ms/.test(sourceText) ||
      !/--motion-duration-reveal-transform:\s*640ms/.test(sourceText) ||
      !/--motion-duration-media-arrival:\s*900ms/.test(sourceText) ||
      !/--motion-delay-stagger:\s*120ms/.test(sourceText) ||
      !/--motion-delay-stagger-cap:\s*600ms/.test(sourceText) ||
      !/--motion-distance-reveal:\s*20px/.test(sourceText) ||
      !/--motion-duration-reveal:\s*640ms/.test(sourceText) ||
      !/\.site-footer\s*\{[^}]*overflow-x:\s*clip;/s.test(sourceText) ||
      !/\.is-lds-reveal-armed\.is-lds-revealed\.is-lds-reveal-arriving\s*\{[\s\S]*?opacity var\(--motion-duration-reveal\) var\(--motion-ease-enter\)[\s\S]*?transform var\(--motion-duration-reveal\) var\(--motion-ease-enter\)/s.test(sourceText) ||
      !/\.is-lds-reveal-armed\s*\{[^}]*transform:\s*translate3d\(0,\s*var\(--motion-distance-reveal\),\s*0\);/s.test(sourceText) ||
      !/\.is-lds-reveal-armed\s*\{[^}]*transition:\s*none;/s.test(sourceText)) {
    errors.push('Approach-motion CSS must hide only explicitly armed targets after readiness and retain stagger delay support.');
  }
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
  const masonryRenderer = sourceText.match(/function layoutMasonry\b[\s\S]*?(?=function scheduleMasonryLayout\b)/)?.[0] ?? '';
  if (!/columnHeights\[candidate\]\s*<\s*columnHeights\[column\]/.test(masonryRenderer) || /storedColumn/.test(masonryRenderer)) {
    errors.push('Masonry must deterministically recompute the shortest column so the first row shares one top edge and expansion cannot hide cards.');
  }
  const reflowRenderer = sourceText.match(/function animateCardReflow\b[\s\S]*?(?=function setCardExpanded\b)/)?.[0] ?? '';
  for (const token of ['originIndex', 'deltaX', 'deltaY', 'rippleIndex', 'fill: "backwards"']) {
    if (!reflowRenderer.includes(token)) errors.push(`Inline profile reflow must preserve full FLIP ripple behavior: ${token}.`);
  }
  const modelBuilder = sourceText.match(/function buildModels\b[\s\S]*?(?=function makeSearchText\b)/)?.[0] ?? '';
  const personOrdering = sourceText.match(/function completedEngagementEndSortValue\b[\s\S]*?(?=function relationId\b)/)?.[0] ?? '';
  if (!/state\.models\.sort\(personModelSort\)/.test(modelBuilder) ||
      !/statusKey === "active"/.test(personOrdering) ||
      !/model\.engagements/.test(personOrdering) ||
      !/latestCompletedEngagementEndSortValue/.test(personOrdering) ||
      /nickname\.localeCompare/.test(modelBuilder)) {
    errors.push('People must sort Active first, then Alumni by their latest completed engagement end date, with stable ties and undated Alumni last.');
  }
  const filterCountRenderer = sourceText.match(/function updateFilterCount\b[\s\S]*?(?=function syncFilterState\b)/)?.[0] ?? '';
  if (!/setText\(elements\.filterOpenLabel, message\("filter"\)\)/.test(filterCountRenderer)) {
    errors.push('The compact filter label must not repeat the active-filter count already shown by its badge.');
  }
  const engagementRoleRenderer = sourceText.match(/function engagementRoleName\b[\s\S]*?(?=function engagementIsCurrent\b)/)?.[0] ?? '';
  if (!/localizedField\([\s\S]*?, "en"\)/.test(engagementRoleRenderer) || sourceText.includes('return "ที่ปรึกษาธุรกิจ";')) {
    errors.push('Public role labels must render from the English role field in both locales.');
  }
  const publicationRenderer = sourceText.match(/function publicationsMarkup\b[\s\S]*?(?=function socialIconMarkup\b)/)?.[0] ?? '';
  const personDetailRenderer = sourceText.match(/function personDetailMarkup\b[\s\S]*?(?=function cardShellFor\b)/)?.[0] ?? '';
  const socialNormalizer = sourceText.match(/function normalizeSocials\b[\s\S]*?(?=function normalizeSearch\b)/)?.[0] ?? '';
  const socialIconRenderer = sourceText.match(/function profileSocialIconsMarkup\b[\s\S]*?(?=function socialsMarkup\b)/)?.[0] ?? '';
  if (!/PUBLIC_WEB_SOCIAL_KEYS\.has\(platform\.key\)/.test(socialNormalizer) ||
      !/PUBLIC_WEB_SOCIAL_KEYS\.has\(social\.key\)/.test(socialIconRenderer)) {
    errors.push('The web UI must deny-by-default every social platform except LinkedIn and GitHub.');
  }
  for (const token of ['external_publication_not_landometer_contribution', 'owner_supplied_with_bibliographic_match', 'owner_authorized_external_publication_link', 'safeExternalUrl']) {
    if (!sourceText.includes(token)) errors.push(`External publications must retain their strict publication governance boundary: ${token}.`);
  }
  if (!/publicationsMarkup\(model\)/.test(personDetailRenderer) || !/publication-link/.test(publicationRenderer)) {
    errors.push('Governed external publications must render as minimal links in expanded person detail.');
  }
  if (!/\.publication-link\s*\{[^}]*border-radius:\s*var\(--radius-pill\)/s.test(sourceText)) {
    errors.push('External publication actions must use the design-system capsule shape.');
  }
  const contributionRenderer = sourceText.match(/function contributionsMarkup\b[\s\S]*?(?=function achievementsMarkup\b)/)?.[0] ?? '';
  const externalIconRenderer = sourceText.match(/function externalLinkIconMarkup\b[\s\S]*?(?=function educationLinkedInMarkup\b)/)?.[0] ?? '';
  if (!/class="contribution-heading-link"/.test(contributionRenderer) || !/class="contribution-open-icon"/.test(contributionRenderer) || !/externalLinkIconMarkup\(\)/.test(contributionRenderer)) {
    errors.push('Contribution destinations must preserve the linked title and its circular external-link cue in one accessible destination.');
  }
  if (/↗/.test(contributionRenderer)) {
    errors.push('Contribution actions must not use a font-dependent arrow glyph.');
  }
  if (!/material-symbols-rounded external-link-icon/.test(externalIconRenderer) || !/>open_in_new<\/span>/.test(externalIconRenderer) || /<svg\b/.test(externalIconRenderer)) {
    errors.push('Contribution actions must use the self-hosted Material Symbols Rounded open_in_new glyph, not an ad-hoc vector.');
  }
  if (!/\.contribution-open-icon\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;[^}]*border-radius:\s*50%;/s.test(sourceText)) {
    errors.push('Contribution external-link cues must render as 44 by 44 pixel circles.');
  }
  if (!/\.contribution-evidence-link\s*\{[^}]*min-height:\s*44px;[^}]*padding:\s*10px\s+var\(--space-5\);[^}]*border-radius:\s*var\(--radius-pill\);/s.test(sourceText)) {
    errors.push('Labelled contribution evidence actions must use the 44 pixel design-system capsule recipe.');
  }
  if (!/\.timeline-item,[\s\S]*?\.contribution-item,[\s\S]*?\.achievement-item\s*\{[^}]*border-radius:\s*var\(--radius-md\);/s.test(sourceText)) {
    errors.push('Contribution containers must retain card geometry rather than action geometry.');
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
  if (/publication/i.test(cardRenderer)) {
    errors.push('External publications must never appear in the collapsed card or Landometer work preview.');
  }
  if ((cardRenderer.match(/role-badge/g) ?? []).length !== 1 || !cardRenderer.includes('engagementHistoryMarkup(model)')) {
    errors.push('Each person card must keep one current-role badge and a separate repeat-engagement history row.');
  }
  const educationRenderer = sourceText.match(/function educationFor\b[\s\S]*?(?=function normalizedBoolean\b)/)?.[0] ?? '';
  const educationSummaryRenderer = sourceText.match(/function educationSummary\b[\s\S]*?(?=function programCode\b)/)?.[0] ?? '';
  const educationDetailRenderer = sourceText.match(/function educationDetailMarkup\b[\s\S]*?(?=function roleHistoryMarkup\b)/)?.[0] ?? '';
  if (!/shortProgram\s*=\s*degreeShort\s*\|\|\s*\(cardHasProgramAndInstitution\s*\?\s*cardParts\[0\]/s.test(educationRenderer) ||
      !/shortInstitution\s*=\s*\(cardHasProgramAndInstitution\s*\?\s*cardParts\.slice/s.test(educationRenderer)) {
    errors.push('Governed educationDisplay.card labels must take priority over canonical dimension abbreviations at runtime.');
  }
  if (!educationRenderer.includes('cardDisplay,') || !educationSummaryRenderer.includes('model.education.cardDisplay')) {
    errors.push('Person-specific governed education card labels must render intact, including labels without a middle-dot separator.');
  }
  if (!educationRenderer.includes('ownerDetailRequiredWithoutPrimaryEducation') ||
      !educationRenderer.includes('hidden: ownerDetailRequiredWithoutPrimaryEducation') ||
      !educationSummaryRenderer.includes('model.education.hidden') ||
      !educationDetailRenderer.includes('model.education.hidden')) {
    errors.push('Owner-detail-required education must stay hidden only when no primary education record exists.');
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
    [/(?:api[_-]?key|access[_-]?token|client[_-]?secret)["']?\s*[:=]\s*["'][^"']{8,}/i, 'credential-shaped value']
  ];
  for (const file of files) {
    if (!textExtensions.has(path.extname(file))) continue;
    const contents = await readFile(file, 'utf8');
    const relativePath = path.relative(publishRoot, file).split(path.sep).join('/');
    for (const [pattern, label] of forbidden) {
      if (pattern.test(contents)) errors.push(`${relativePath} contains a ${label}.`);
    }
    const emailMatches = contents.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
    if (emailMatches.length > 0) {
      const isStaticEntrypoint = relativePath === 'index.html' || relativePath === 'en/index.html';
      const isExactCorporateFooterEmail =
        emailMatches.length === 2 &&
        emailMatches.every((email) => email.toLowerCase() === 'hello@landometer.com') &&
        (contents.match(/<a class="footer-email" href="mailto:hello@landometer\.com">hello@landometer\.com<\/a>/g) ?? []).length === 1;
      if (!isStaticEntrypoint || !isExactCorporateFooterEmail) {
        errors.push(`${relativePath} contains an email address outside the single verified corporate footer contact.`);
      }
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

  const socialPreview = manifest.assets.find((asset) => asset.assetId === 'social-landom-people-og');
  if (
    socialPreview?.path !== SOCIAL_PREVIEW.path ||
    socialPreview?.mediaType !== SOCIAL_PREVIEW.mimeType ||
    socialPreview?.width !== SOCIAL_PREVIEW.width ||
    socialPreview?.height !== SOCIAL_PREVIEW.height ||
    socialPreview?.bytes !== SOCIAL_PREVIEW.bytes ||
    socialPreview?.sha256 !== SOCIAL_PREVIEW.sha256 ||
    socialPreview?.approvalScope !== 'social-preview' ||
    socialPreview?.publicationBasis !== 'owner_authorized_social_preview_image' ||
    socialPreview?.ownerApproval?.status !== 'granted' ||
    socialPreview?.ownerApproval?.scope !== 'public_social_preview_only' ||
    socialPreview?.metadataStripped !== true ||
    JSON.stringify(socialPreview?.approvedRoles) !== JSON.stringify(['social-preview']) ||
    socialPreview?.alt?.th !== SOCIAL_PREVIEW.alt.th ||
    socialPreview?.alt?.en !== SOCIAL_PREVIEW.alt.en
  ) {
    errors.push('docs/assets-manifest.json does not pin the owner-approved social-preview asset and role boundary.');
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

async function validateDiscovery(publishRoot, siteData, errors, { distMode }) {
  const canonicalUrl = 'https://montri-th.github.io/Landom/';
  const localeUrls = {
    th: canonicalUrl,
    en: `${canonicalUrl}en/`
  };
  const faviconHref = 'https://montri-th.github.io/Landometer/assets/images/landometer-symbol-transparent.png?v=35a1496f';
  const index = await readIfPresent(path.join(publishRoot, 'index.html'));
  const llms = await readIfPresent(path.join(publishRoot, 'llms.txt'));
  const robots = await readIfPresent(path.join(publishRoot, 'robots.txt'));
  const sitemap = await readIfPresent(path.join(publishRoot, 'sitemap.xml'));
  let fontManifest = null;
  try {
    fontManifest = JSON.parse(await readFile(path.join(publishRoot, 'public/assets/fonts/font-assets.manifest.json'), 'utf8'));
    if (!/owner-approved Landom-local addition/i.test(fontManifest.authorityScope ?? '') ||
        !/do(?:es)? not publish or upgrade a normative Design System release/i.test(fontManifest.authorityScope ?? '')) {
      errors.push('The font manifest must distinguish the local navigation subset from normative Design System authority.');
    }
    const licenseText = await readFile(path.join(publishRoot, MATERIAL_SYMBOLS_EXTERNAL.licensePath), 'utf8');
    if (!/Apache License\s+Version 2\.0/i.test(licenseText)) {
      errors.push('The Material Symbols Rounded Apache 2.0 license file is missing or invalid.');
    }
  } catch (error) {
    errors.push('The governed Material Symbols Rounded manifest or Apache 2.0 license is missing.');
  }
  for (const font of MATERIAL_SYMBOL_FONTS) {
    try {
      const fontBytes = await readFile(path.join(publishRoot, font.path));
      const fontDigest = createHash('sha256').update(fontBytes).digest('hex');
      const fontRecord = fontManifest?.faces?.find((record) => record.file === path.basename(font.path));
      if (fontBytes.byteLength !== font.bytes || fontDigest !== font.sha256) {
        errors.push(`The ${font.family} subset bytes do not match the governed font record.`);
      }
      if (
        fontRecord?.family !== font.family ||
        fontRecord?.sha256 !== font.sha256 ||
        fontRecord?.subset !== font.subset ||
        fontRecord?.weight !== 300 ||
        fontRecord?.axesLock !== font.axesLock ||
        fontRecord?.license !== 'Apache License 2.0' ||
        fontRecord?.licenseFile !== path.relative('public/assets/fonts', font.licensePath) ||
        (font.glyphs && JSON.stringify(fontRecord?.glyphs) !== JSON.stringify(font.glyphs)) ||
        (font.source && fontRecord?.source !== font.source) ||
        (font.approvalAuthority && fontRecord?.approvalAuthority !== font.approvalAuthority) ||
        (font.designSystemStatus && fontRecord?.designSystemStatus !== font.designSystemStatus)
      ) {
        errors.push(`The ${font.family} subset is missing its exact manifest, glyph, axis-lock, or license record.`);
      }
    } catch (error) {
      errors.push(`The governed ${font.family} subset is missing at ${font.path}.`);
    }
  }
  try {
    const previewBytes = await readFile(path.join(publishRoot, SOCIAL_PREVIEW.path));
    const previewDigest = createHash('sha256').update(previewBytes).digest('hex');
    const dimensions = jpegDimensions(previewBytes);
    if (previewBytes.byteLength !== SOCIAL_PREVIEW.bytes || previewDigest !== SOCIAL_PREVIEW.sha256) {
      errors.push('The social-preview image bytes do not match the approved identity record.');
    }
    if (dimensions?.width !== SOCIAL_PREVIEW.width || dimensions?.height !== SOCIAL_PREVIEW.height) {
      errors.push('The social-preview image dimensions must remain exactly 1200 by 630 pixels.');
    }
    for (const marker of ['Exif\u0000\u0000', 'http://ns.adobe.com/xap/1.0/', 'GPS', 'iPhone']) {
      if (previewBytes.includes(Buffer.from(marker, 'utf8'))) {
        errors.push(`The social-preview derivative must remain free of source metadata marker ${JSON.stringify(marker)}.`);
      }
    }
  } catch (error) {
    errors.push(`The approved social-preview image is missing at ${SOCIAL_PREVIEW.path}.`);
  }
  if (robots === null) errors.push('robots.txt is missing.');
  else {
    if (!/^User-agent:\s*\*$/m.test(robots) || !/^Allow:\s*\/$/m.test(robots)) {
      errors.push('robots.txt must explicitly allow the public root for all crawlers.');
    }
    if (!robots.includes(`Sitemap: ${canonicalUrl}sitemap.xml`)) {
      errors.push('robots.txt must reference the canonical root sitemap URL.');
    }
  }
  if (llms === null) errors.push('llms.txt is missing.');
  else {
    for (const requiredUrl of [canonicalUrl, localeUrls.en, `${canonicalUrl}data/generated/site-data.json`]) {
      if (!llms.includes(requiredUrl)) errors.push(`llms.txt is missing navigation URL ${requiredUrl}.`);
    }
    if (!/navigation aid/i.test(llms) || !/not an access-control rule/i.test(llms) || !/authority for an agent to act/i.test(llms)) {
      errors.push('llms.txt must remain a bounded navigation aid and deny access-control, ranking, license, and agent-action interpretations.');
    }
  }
  if (sitemap === null) errors.push('sitemap.xml is missing.');
  else {
    const sitemapRoutes = [canonicalUrl, localeUrls.en];
    for (const route of sitemapRoutes) {
      if (!sitemap.includes(`<loc>${route}</loc>`)) errors.push(`sitemap.xml is missing ${route}.`);
    }
    if ((sitemap.match(/<loc>/g) ?? []).length !== sitemapRoutes.length) {
      errors.push('sitemap.xml must contain exactly the Thai canonical root and English public route.');
    }
    for (const [locale, route] of Object.entries({ th: localeUrls.th, en: localeUrls.en, 'x-default': canonicalUrl })) {
      const pattern = new RegExp(`<xhtml:link\\s+rel=["']alternate["']\\s+hreflang=["']${locale}["']\\s+href=["']${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']\\s*\\/>`, 'g');
      if ((sitemap.match(pattern) ?? []).length !== sitemapRoutes.length) {
        errors.push(`sitemap.xml must give every route the reciprocal ${locale} alternate.`);
      }
    }
  }

  function validateDiscoveryHtml(html, { fileLabel, routeUrl, locale, localized }) {
    if (!html.includes(`<link rel="canonical" href="${routeUrl}">`)) {
      errors.push(`${fileLabel} canonical URL does not match ${routeUrl}.`);
    }
    for (const [hreflang, href] of Object.entries({ th: localeUrls.th, en: localeUrls.en, 'x-default': canonicalUrl })) {
      if (!html.includes(`<link rel="alternate" hreflang="${hreflang}" href="${href}">`)) {
        errors.push(`${fileLabel} is missing the reciprocal ${hreflang} hreflang link.`);
      }
    }
    if (!html.includes('type="application/json"') || !html.includes(`href="${canonicalUrl}data/generated/site-data.json"`)) {
      errors.push(`${fileLabel} must expose the public directory JSON as a typed alternate representation.`);
    }
    if (!html.includes(`<meta property="og:url" content="${routeUrl}">`)) {
      errors.push(`${fileLabel} Open Graph URL does not match its canonical route.`);
    }
    const iconLinks = html.match(/<link\b[^>]*\brel=["']icon["'][^>]*>/gi) ?? [];
    if (
      iconLinks.length !== 1 ||
      !iconLinks[0].includes(`href="${faviconHref}"`) ||
      !iconLinks[0].includes('type="image/png"') ||
      !iconLinks[0].includes('sizes="192x192"')
    ) {
      errors.push(`${fileLabel} must use only the exact DS-approved 192x192 transparent browser-tab favicon.`);
    }
    if (/<link\b[^>]*\brel=["'][^"']*apple-touch-icon/i.test(html)) {
      errors.push(`${fileLabel} must not claim an unapproved apple-touch icon.`);
    }
    const expectedPreviewAlt = SOCIAL_PREVIEW.alt[locale];
    const requiredPreviewMetadata = [
      `<meta property="og:image" content="${SOCIAL_PREVIEW.url}">`,
      `<meta property="og:image:secure_url" content="${SOCIAL_PREVIEW.url}">`,
      `<meta property="og:image:type" content="${SOCIAL_PREVIEW.mimeType}">`,
      `<meta property="og:image:width" content="${SOCIAL_PREVIEW.width}">`,
      `<meta property="og:image:height" content="${SOCIAL_PREVIEW.height}">`,
      `<meta property="og:image:alt" content="${expectedPreviewAlt}">`,
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:image" content="${SOCIAL_PREVIEW.url}">`,
      `<meta name="twitter:image:alt" content="${expectedPreviewAlt}">`
    ];
    for (const required of requiredPreviewMetadata) {
      if (!html.includes(required)) errors.push(`${fileLabel} is missing approved social-preview metadata: ${required}`);
    }
    if (!html.includes(`<link rel="preload" href="./${MATERIAL_SYMBOLS_NAV.path}" as="font" type="font/woff2" crossorigin>`)) {
      errors.push(`${fileLabel} must preload the self-hosted unified-navigation Material Symbols subset.`);
    }
    if (!html.includes(`<link rel="preload" href="./${MATERIAL_SYMBOLS_FOOTER.path}" as="font" type="font/ttf" crossorigin>`)) {
      errors.push(`${fileLabel} must preload the exact governed rebuild02 r10 footer Material Symbols subset.`);
    }
    if ((html.match(/<meta property="og:image"\s/g) ?? []).length !== 1 || (html.match(/<meta name="twitter:image"\s/g) ?? []).length !== 1) {
      errors.push(`${fileLabel} must expose exactly one approved Open Graph image and one approved Twitter image.`);
    }
    if (!html.includes('<meta name="robots" content="index,follow">')) {
      errors.push(`${fileLabel} must explicitly declare its approved public indexability.`);
    }
    if (!new RegExp(`<html[\\s\\S]*?lang=["']${locale}["']`, 'i').test(html)) {
      errors.push(`${fileLabel} does not declare ${locale} as its initial HTML language.`);
    }
    if (!html.includes(`data-locale-route="${locale}"`)) {
      errors.push(`${fileLabel} is missing its stable locale-route marker.`);
    }
    if (localized && !html.includes('<base href="../">')) {
      errors.push(`${fileLabel} must preserve root-relative app/data delivery through its localized base URL.`);
    }
    if (localized && !html.includes(`href="${routeUrl}#main-content"`)) {
      errors.push(`${fileLabel} skip link must remain on its localized route when a base URL is present.`);
    }
    if (localized && (html.match(new RegExp(`href="${routeUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}#people"`, 'g')) ?? []).length !== 2) {
      errors.push(`${fileLabel} on-page shortcuts must remain on the localized route when a base URL is present.`);
    }
    if (!html.includes('<a class="brand" href="https://landometer.com/"')) {
      errors.push(`${fileLabel} brand link must preserve the approved Landometer destination.`);
    }
    const siblingLocale = locale === 'th' ? 'en' : 'th';
    const siblingRoute = localeUrls[siblingLocale];
    if (!new RegExp(`id=["']language-toggle["'][\\s\\S]*?href=["']${siblingRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][\\s\\S]*?hreflang=["']${siblingLocale}["']`).test(html) &&
        !(locale === 'th' && /id=["']language-toggle["'][\s\S]*?href=["']\.\/en\/["'][\s\S]*?hreflang=["']en["']/.test(html))) {
      errors.push(`${fileLabel} language switch must be a crawlable link to its ${siblingLocale} sibling route.`);
    }
    if (!html.includes(`<a href="${routeUrl}" aria-current="page">`) &&
        !(locale === 'th' && html.includes('<a href="./" aria-current="page">'))) {
      errors.push(`${fileLabel} current ecosystem item must preserve its localized route.`);
    }
    const expectedTitle = locale === 'th'
      ? 'Landom — คนที่ร่วมสร้าง Landometer'
      : 'Landom — meet the people shaping Landometer';
    const expectedSocialTitle = locale === 'th'
      ? 'LANDOM · พวกเรา ที่ช่วยกันสร้าง LANDOMETER'
      : 'Landom — meet the people shaping Landometer';
    const expectedDescription = locale === 'th'
      ? 'รู้จักคน ความสนใจ และผลงานที่เกิดขึ้นระหว่างการร่วมงานกับ Landometer'
      : 'Meet the people, interests and work shaped through time with Landometer.';
    const expectedHeading = locale === 'th' ? 'ไม่ใช่สถานที่&#10;แต่คือผู้คน' : 'It’s not a place.&#10;It’s the people.';
    if (!html.includes(`<title>${expectedTitle}</title>`)) errors.push(`${fileLabel} is missing its localized initial title.`);
    if (!html.includes(`<meta property="og:title" content="${expectedSocialTitle}">`)) {
      errors.push(`${fileLabel} is missing its exact locale-specific Open Graph title.`);
    }
    if (!html.includes(`<meta name="twitter:title" content="${expectedSocialTitle}">`)) {
      errors.push(`${fileLabel} is missing its exact locale-specific Twitter title.`);
    }
    if (!html.includes(`content="${expectedDescription}"`)) errors.push(`${fileLabel} is missing its localized initial description.`);
    if (!html.includes(`id="page-title">${expectedHeading}</h1>`)) errors.push(`${fileLabel} is missing its localized initial H1.`);

    const structuredMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
    let collectionPage = null;
    for (const match of structuredMatches) {
      try {
        const record = JSON.parse(match[1]);
        if (record?.['@type'] === 'CollectionPage') collectionPage = record;
      } catch (error) {
        errors.push(`${fileLabel} contains invalid JSON-LD: ${error.message}`);
      }
    }
    if (!collectionPage) errors.push(`${fileLabel} is missing truthful CollectionPage JSON-LD.`);
    else {
      if (collectionPage.url !== routeUrl || collectionPage.inLanguage !== locale) {
        errors.push(`${fileLabel} JSON-LD URL/language does not match its localized route.`);
      }
      if (collectionPage?.mainEntity?.['@type'] !== 'ItemList' || collectionPage.mainEntity.numberOfItems !== siteData.people.length) {
        errors.push(`${fileLabel} JSON-LD ItemList count does not match the public people registry.`);
      }
    }
  }

  if (index !== null) validateDiscoveryHtml(index, {
    fileLabel: 'index.html',
    routeUrl: canonicalUrl,
    locale: 'th',
    localized: false
  });

  const manifestText = await readIfPresent(path.join(publishRoot, 'public', 'manifest.webmanifest'));
  if (manifestText !== null) {
    try {
      const manifest = JSON.parse(manifestText);
      if (manifest.id !== '/Landom/' || manifest.start_url !== '/Landom/' || manifest.scope !== '/Landom/') {
        errors.push('The web manifest id, start_url, and scope must match the canonical GitHub Pages project root.');
      }
      if (Array.isArray(manifest.icons) && manifest.icons.length > 0) {
        errors.push('The web manifest must not claim touch, maskable, or install icons without separate approval.');
      }
    } catch (error) {
      errors.push(`public/manifest.webmanifest is invalid JSON: ${error.message}`);
    }
  }

  if (distMode) {
    const localizedIndex = await readIfPresent(path.join(publishRoot, 'en', 'index.html'));
    if (localizedIndex === null) errors.push('en/index.html is missing from the localized build.');
    else validateDiscoveryHtml(localizedIndex, {
      fileLabel: 'en/index.html',
      routeUrl: localeUrls.en,
      locale: 'en',
      localized: true
    });
  }

  const identityRecordText = await readIfPresent(path.join(repoRoot, 'docs', 'identity-discovery.json'));
  if (identityRecordText === null) errors.push('docs/identity-discovery.json is missing.');
  else {
    try {
      const identityRecord = JSON.parse(identityRecordText);
      const favicon = identityRecord?.identityAssets?.find((asset) => asset.role === 'browser-tab favicon');
      const approvalRecord = favicon?.approvalRecord;
      if (
        favicon?.deliveryUrl !== faviconHref ||
        favicon?.sha256 !== '35a1496f6e8c502cef82f0a46de5dacff98718ff9f5a6c07ccc3783d76e3ae85' ||
        favicon?.bytes !== 11001 ||
        favicon?.intrinsicWidth !== 192 ||
        favicon?.intrinsicHeight !== 192 ||
        favicon?.approvalScope !== 'browser-tab favicon only' ||
        favicon?.sourceVersion !== 'Landometer Design System v0.9.0' ||
        approvalRecord?.manifestPath !== 'deployment/machine/v0.9.0/identity-approvals.manifest.json' ||
        approvalRecord?.introducedAtCommit !== '36d72ab1dd755cbad5273a7f217e1ee10aeb54a2' ||
        approvalRecord?.gitBlob !== '7e1e084d2340486cd27fe4af5d44c8de6dcf4baa' ||
        approvalRecord?.sha256 !== '4d9864b05fc3b95bc76e6c986aff69444245a843509d5c7cdf481719a95e7ea1' ||
        approvalRecord?.underlyingApprovalSourceCommit !== 'ce785864e5341321e1957dce35a8326732764432'
      ) {
        errors.push('docs/identity-discovery.json does not pin the exact DS-approved favicon role and evidence.');
      }
      const socialPreview = identityRecord?.identityAssets?.find((asset) => asset.role === 'social preview image');
      if (
        socialPreview?.path !== SOCIAL_PREVIEW.path ||
        socialPreview?.deliveryUrl !== SOCIAL_PREVIEW.url ||
        socialPreview?.mimeType !== SOCIAL_PREVIEW.mimeType ||
        socialPreview?.intrinsicWidth !== SOCIAL_PREVIEW.width ||
        socialPreview?.intrinsicHeight !== SOCIAL_PREVIEW.height ||
        socialPreview?.bytes !== SOCIAL_PREVIEW.bytes ||
        socialPreview?.sha256 !== SOCIAL_PREVIEW.sha256 ||
        socialPreview?.cacheRevision !== SOCIAL_PREVIEW.cacheRevision ||
        socialPreview?.approvalScope !== 'social preview image only' ||
        socialPreview?.ownerApproval?.status !== 'granted' ||
        socialPreview?.ownerApproval?.scope !== 'public_social_preview_only' ||
        socialPreview?.localizedAlt?.th !== SOCIAL_PREVIEW.alt.th ||
        socialPreview?.localizedAlt?.en !== SOCIAL_PREVIEW.alt.en ||
        socialPreview?.sameOrigin !== true
      ) {
        errors.push('docs/identity-discovery.json does not pin the exact owner-approved social-preview role and evidence.');
      }
      const omittedRoles = new Set((identityRecord?.omittedRoles ?? []).map((record) => record.role));
      for (const role of ['apple-touch icon', 'maskable or install icon']) {
        if (!omittedRoles.has(role)) errors.push(`docs/identity-discovery.json must record the missing ${role} approval.`);
      }
      if (omittedRoles.has('social preview image')) {
        errors.push('docs/identity-discovery.json must not mark the approved social-preview role as omitted.');
      }
    } catch (error) {
      errors.push(`docs/identity-discovery.json is invalid JSON: ${error.message}`);
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
  await validateDiscovery(publishRoot, siteData, errors, { distMode });
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
