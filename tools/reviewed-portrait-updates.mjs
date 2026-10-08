import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ID = /^[SPI]\d{4}$/;
const SHA = /^[a-f0-9]{64}$/;
const SCOPE = 'Landom profile portrait replacements only';
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const validOptionalOwnerApproval = (approval, reviewedAt) => approval == null || (approval.status === 'granted' && approval.scope === 'public_profile_portrait' && approval.approvedAt === reviewedAt);

function strictObject(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(label + ' must be an object.');
  for (const key of Object.keys(value)) if (!keys.includes(key)) throw new Error(label + ' unsupported field: ' + key);
}

function unique(rows, key, label) {
  const indexed = new Map();
  for (const row of rows) {
    const value = key(row);
    if (indexed.has(value)) throw new Error('Duplicate ' + label + ': ' + value);
    indexed.set(value, row);
  }
  return indexed;
}

function jpegDimensions(bytes) {
  if (bytes.length < 4 || bytes.readUInt16BE(0) !== 0xffd8 || bytes.readUInt16BE(bytes.length - 2) !== 0xffd9) throw new Error('Replacement is not JPEG.');
  let offset = 2;
  let dimensions;
  while (offset < bytes.length - 2) {
    if (bytes[offset++] !== 0xff) throw new Error('Invalid JPEG header.');
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xda) break;
    if (marker === 0xd9) break;
    if (offset + 2 > bytes.length) throw new Error('Truncated JPEG header.');
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) throw new Error('Invalid JPEG segment.');
    if ((marker >= 0xe1 && marker <= 0xef) || marker === 0xfe) throw new Error('Replacement JPEG contains source metadata.');
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      if (length < 8) throw new Error('Invalid JPEG dimensions.');
      dimensions = { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    }
    offset += length;
  }
  if (!dimensions || dimensions.width !== 800 || dimensions.height !== 800) throw new Error('Replacement portrait must be 800x800.');
  return dimensions;
}

/** Replace only approved portrait bytes in an immutable reviewed graph; emit no source URLs. */
export function applyReviewedPortraitUpdates(siteData, contract, { repoRoot, baselineSha256, publicationConsent }) {
  strictObject(contract, ['contractVersion', 'reviewedAt', 'scope', 'sourceBaseCommit', 'baseSiteDataSha256', 'records'], 'Portrait update contract');
  if (contract.contractVersion !== '1.0' || contract.scope !== SCOPE || !/^\d{4}-\d{2}-\d{2}$/.test(contract.reviewedAt ?? '') || !Number.isFinite(Date.parse(contract.reviewedAt)) || !/^[a-f0-9]{40}$/.test(contract.sourceBaseCommit ?? '') || !SHA.test(contract.baseSiteDataSha256 ?? '') || !Array.isArray(contract.records)) throw new Error('Invalid portrait update contract.');
  if (baselineSha256 !== contract.baseSiteDataSha256) throw new Error('Reviewed baseline SHA-256 mismatch.');
  if (siteData?.meta?.schemaVersion !== '1.5.0' || !Array.isArray(siteData.people) || !Array.isArray(siteData.assets)) throw new Error('Reviewed graph schema mismatch.');
  const result = structuredClone(siteData);
  const people = unique(result.people, (person) => person.personId, 'reviewed person ID');
  const portraits = unique(result.assets.filter((asset) => asset.kind === 'profile_portrait'), (asset) => asset.personId, 'reviewed portrait person ID');
  const approved = unique(JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/approved/portrait-assets.json'), 'utf8')).assets, (asset) => asset.personId, 'approved portrait person ID');
  const manifest = unique(JSON.parse(fs.readFileSync(path.join(repoRoot, 'docs/assets-manifest.json'), 'utf8')).assets, (asset) => asset.path, 'manifest asset path');
  const consent = unique(publicationConsent?.records ?? [], (record) => record.personId, 'publication consent person ID');
  const records = unique(contract.records, (record) => record.personId, 'portrait replacement person ID');
  for (const [personId, update] of records) {
    strictObject(update, ['personId', 'expectedPreviousSha256', 'publicPath', 'sha256', 'bytes'], 'Portrait replacement');
    const current = portraits.get(personId);
    const publicPath = `public/assets/people/${personId}.jpg`;
    if (!ID.test(personId ?? '') || !people.has(personId) || !current || current.assetId !== `PORTRAIT-${personId}`) throw new Error('Unknown stable portrait person ID: ' + personId);
    if (current.publicPath !== publicPath || update.publicPath !== publicPath) throw new Error('Replacement public path mismatch: ' + personId);
    if (!SHA.test(update.expectedPreviousSha256 ?? '') || update.expectedPreviousSha256 !== current.sha256) throw new Error('Previous portrait SHA-256 mismatch: ' + personId);
    if (!SHA.test(update.sha256 ?? '') || update.sha256 === current.sha256 || !Number.isSafeInteger(update.bytes) || update.bytes <= 0) throw new Error('Invalid replacement hash/bytes: ' + personId);
    const inventory = approved.get(personId);
    const assetManifest = manifest.get(publicPath);
    const approval = consent.get(personId);
    if (!inventory || inventory.publicPath !== publicPath || inventory.mime !== 'image/jpeg' || inventory.sha256 !== update.sha256 || inventory.bytes !== update.bytes || inventory.publicationBasis !== 'individual_consent' || typeof inventory.identityVerification !== 'string' || !/^[a-z0-9_]+$/.test(inventory.identityVerification) || !validOptionalOwnerApproval(inventory.ownerApproval, contract.reviewedAt)) throw new Error('Approved portrait inventory mismatch: ' + personId);
    if (!assetManifest || assetManifest.assetId !== current.assetId || assetManifest.sha256 !== update.sha256 || assetManifest.bytes !== update.bytes || assetManifest.mediaType !== 'image/jpeg' || assetManifest.width !== 800 || assetManifest.height !== 800 || assetManifest.metadataStripped !== true || assetManifest.approvalScope !== 'person-profile' || assetManifest.publicationBasis !== 'individual_consent' || !validOptionalOwnerApproval(assetManifest.ownerApproval, contract.reviewedAt)) throw new Error('Approved portrait manifest mismatch: ' + personId);
    if (approval?.profileConsent !== 'granted' || approval.portrait?.consentStatus !== 'granted' || approval.portrait?.sha256 !== update.sha256) throw new Error('Exact replacement portrait consent missing: ' + personId);
    const filePath = path.join(repoRoot, publicPath);
    if (fs.lstatSync(filePath).isSymbolicLink()) throw new Error('Replacement portrait may not be a symlink: ' + personId);
    const bytes = fs.readFileSync(filePath);
    if (bytes.length !== update.bytes || digest(bytes) !== update.sha256) throw new Error('Replacement portrait bytes/hash mismatch: ' + personId);
    jpegDimensions(bytes);
    Object.assign(current, {
      publicPath, sourceUrl: null, sha256: update.sha256, bytes: update.bytes, mediaType: 'image/jpeg',
      candidateStatus: 'candidate_present', verificationStatus: 'verified', identityVerificationEvidence: inventory.identityVerification,
      consentStatus: 'pending', rightsStatus: 'cleared', publicationBasis: null,
      publicationStatus: 'withheld_pending_rights_consent_and_verification', ownerApproval: structuredClone(inventory.ownerApproval ?? null)
    });
    // applyPublicationConsent owns the final publication decision immediately afterward.
  }
  return result;
}
