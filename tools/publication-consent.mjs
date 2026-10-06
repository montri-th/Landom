const PERSON_ID = /^[SPI]\d{4}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const PUBLIC_SOCIAL_PLATFORMS = new Set(['linkedin', 'github']);

function assertObject(value, allowedKeys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(label + ' must be an object.');
  for (const key of Object.keys(value)) {
    if (!allowedKeys.includes(key)) throw new Error(label + ' contains an unsupported field: ' + key);
  }
}

function indexUnique(rows, key, label) {
  const result = new Map();
  for (const row of rows) {
    const id = key(row);
    if (result.has(id)) throw new Error('Duplicate ' + label + ': ' + id);
    result.set(id, row);
  }
  return result;
}

/** Apply only reviewed scopes; profile consent never authorizes an image or link. */
export function applyPublicationConsent(siteData, contract) {
  assertObject(contract, ['contractVersion', 'reviewedAt', 'scope', 'records'], 'Publication consent contract');
  if (contract.contractVersion !== '1.0' || !/^\d{4}-\d{2}-\d{2}$/.test(contract.reviewedAt ?? '') ||
      !Number.isFinite(Date.parse(contract.reviewedAt)) || !Array.isArray(contract.records)) {
    throw new Error('Publication consent requires contractVersion 1.0, a review date and records.');
  }
  if (contract.scope !== undefined && contract.scope !== 'Landom profile and related work pages only') {
    throw new Error('Publication consent scope must be limited to Landom profile and related work pages.');
  }
  const result = structuredClone(siteData);
  const people = indexUnique(result.people, (person) => person.personId, 'person ID');
  const portraits = indexUnique(result.assets.filter((asset) => asset.kind === 'profile_portrait'), (asset) => asset.personId, 'portrait person ID');
  const socials = indexUnique(result.socialProfiles, (social) => social.personId + '|' + social.platform, 'social person/platform');
  const records = indexUnique(contract.records, (record) => record?.personId, 'publication consent person ID');
  for (const [personId, record] of records) {
    assertObject(record, ['personId', 'profileConsent', 'portrait', 'socials', 'sourceRef'], 'Publication consent record');
    if (!PERSON_ID.test(personId) || !people.has(personId)) throw new Error('Publication consent references an unknown person: ' + personId);
    if (record.profileConsent !== 'granted') throw new Error('Publication profile consent must explicitly be granted: ' + personId);
    if (!/^participant_reply_reviewed_\d{4}-\d{2}-\d{2}$|^participant_reply_\d{4}-\d{2}-\d{2}$/.test(record.sourceRef ?? '')) {
      throw new Error('Publication consent sourceRef must be a bounded participant review reference: ' + personId);
    }
    const person = people.get(personId);
    person.publication = { ...person.publication, consentStatus: 'granted', profileStatus: 'eligible' };

    if (record.portrait !== undefined) {
      assertObject(record.portrait, ['consentStatus', 'sha256'], 'Portrait consent');
      const { consentStatus, sha256 } = record.portrait;
      if (!['granted', 'denied'].includes(consentStatus) || !(sha256 === null || SHA256.test(sha256 ?? ''))) {
        throw new Error('Portrait consent requires an explicit status and SHA-256 or null: ' + personId);
      }
      const portrait = portraits.get(personId);
      if (!portrait) throw new Error('Portrait consent references a missing asset record: ' + personId);
      if (sha256 !== null && sha256 !== portrait.sha256) throw new Error('Portrait consent SHA-256 mismatch: ' + personId);
      if (consentStatus === 'granted') {
        if (!sha256 || !portrait.publicPath || portrait.verificationStatus !== 'verified') {
          throw new Error('Granted portrait consent requires the exact verified public asset and SHA-256: ' + personId);
        }
        Object.assign(portrait, {
          consentStatus: 'granted', publicationBasis: 'individual_consent',
          rightsStatus: 'cleared', publicationStatus: 'publishable'
        });
      } else {
        Object.assign(portrait, {
          consentStatus: 'denied', publicationBasis: null, rightsStatus: 'denied',
          publicationStatus: 'withheld_pending_rights_consent_and_verification', publicPath: null, sourceUrl: null,
          sha256: null, mediaType: null, bytes: null
        });
      }
    }

    if (record.socials !== undefined && !Array.isArray(record.socials)) throw new Error('Social consent must be an array: ' + personId);
    const socialApprovals = indexUnique(record.socials ?? [], (social) => social?.platform, 'social consent platform for ' + personId);
    for (const [platform, approval] of socialApprovals) {
      assertObject(approval, ['platform', 'publicUrl', 'consentStatus'], 'Social consent');
      if (!PUBLIC_SOCIAL_PLATFORMS.has(platform) || !['granted', 'denied'].includes(approval.consentStatus)) {
        throw new Error('Social consent must explicitly grant or deny a public LinkedIn or GitHub profile: ' + personId);
      }
      const profile = socials.get(personId + '|' + platform);
      if (approval.consentStatus === 'denied') {
        // A withdrawn channel is omitted completely. Keep the URL and mailbox evidence private.
        // Reapplying the same denial to an already omitted channel must be a no-op.
        if (approval.publicUrl && profile && approval.publicUrl !== profile.publicUrl) {
          throw new Error('Social consent URL mismatch: ' + personId + '|' + platform);
        }
        result.socialProfiles = result.socialProfiles.filter((item) => item.personId !== personId || item.platform !== platform);
        continue;
      }
      if (!profile || !approval.publicUrl || profile.publicUrl !== approval.publicUrl) {
        throw new Error('Social consent URL mismatch: ' + personId + '|' + platform);
      }
      if (profile.verificationStatus !== 'verified') throw new Error('Social consent requires an identity-verified profile: ' + personId + '|' + platform);
      Object.assign(profile, { consentStatus: 'granted', publicationBasis: 'individual_consent', publicationStatus: 'publishable' });
    }
  }
  // Approval provenance stays in the reviewed contract; no mailbox evidence is projected.
  result.meta.dataUpdatedAt = [result.meta.dataUpdatedAt, contract.reviewedAt].filter(Boolean).sort().at(-1);
  result.meta.reviewedAt = result.meta.dataUpdatedAt;
  if (result.meta.counts) {
    result.meta.counts.publishedPublicSocialProfiles = result.socialProfiles.filter((profile) => profile.publicUrl && profile.publicationStatus === 'publishable').length;
  }
  return result;
}
