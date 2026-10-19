const SHA = /^[a-f0-9]{64}$/;
const ID = /^[SPI]\d{4}$/;

function strictObject(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(label + ' must be an object.');
  for (const key of Object.keys(value)) if (!keys.includes(key)) throw new Error(label + ' unsupported field: ' + key);
}

function unique(rows, key, label) {
  const result = new Map();
  for (const row of rows) {
    const id = key(row);
    if (result.has(id)) throw new Error('Duplicate ' + label + ': ' + id);
    result.set(id, row);
  }
  return result;
}

function validProfile(platform, value) {
  if (typeof value !== 'string') return false;
  return platform === 'linkedin'
    ? /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9%_-]+\/?$/.test(value)
    : platform === 'github' && /^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(value);
}

/** Fill exact existing empty social slots; publication consent owns the final grant. */
export function applyReviewedSocialUpdates(siteData, contract, { baselineSha256, publicationConsent }) {
  strictObject(contract, ['contractVersion', 'reviewedAt', 'scope', 'sourceBaseCommit', 'baseSiteDataSha256', 'records'], 'Social update contract');
  if (contract.contractVersion !== '1.0' || contract.scope !== 'Landom first LinkedIn and GitHub profiles only' || !/^\d{4}-\d{2}-\d{2}$/.test(contract.reviewedAt ?? '') || !Number.isFinite(Date.parse(contract.reviewedAt)) || !/^[a-f0-9]{40}$/.test(contract.sourceBaseCommit ?? '') || !SHA.test(contract.baseSiteDataSha256 ?? '') || !Array.isArray(contract.records)) throw new Error('Invalid social update contract.');
  if (baselineSha256 !== contract.baseSiteDataSha256) throw new Error('Reviewed social baseline SHA-256 mismatch.');
  if (siteData?.meta?.schemaVersion !== '1.5.0' || !Array.isArray(siteData.people) || !Array.isArray(siteData.socialProfiles)) throw new Error('Reviewed social graph schema mismatch.');
  const result = structuredClone(siteData);
  const people = unique(result.people, (person) => person.personId, 'reviewed person ID');
  const socials = unique(result.socialProfiles, (row) => row.personId + '|' + row.platform, 'reviewed social person/platform');
  const approvals = unique(publicationConsent?.records ?? [], (row) => row.personId, 'publication consent person ID');
  const records = unique(contract.records, (row) => row.personId + '|' + row.platform, 'social update person/platform');
  for (const [key, update] of records) {
    strictObject(update, ['personId', 'platform', 'expectedPreviousPublicUrl', 'publicUrl', 'identityVerification'], 'Social update');
    const { personId, platform, publicUrl } = update;
    const current = socials.get(key);
    if (!ID.test(personId ?? '') || !people.has(personId) || !current || current.socialProfileId !== `SOC-${personId}-${String(platform).toUpperCase()}`) throw new Error('Unknown stable social profile: ' + key);
    if (!validProfile(platform, publicUrl)) throw new Error('Social update requires a canonical LinkedIn or GitHub profile: ' + key);
    if (update.expectedPreviousPublicUrl !== null || current.publicUrl !== null || current.candidateStatus !== 'candidate_missing' || current.verificationStatus !== 'missing' || current.consentStatus !== 'pending' || current.publicationBasis !== null || current.ownerApproval !== null || current.publicationStatus !== 'withheld_pending_candidate') throw new Error('First social profile requires an untouched missing-profile baseline: ' + key);
    if (update.identityVerification !== 'exact_roster_match_and_direct_participant_reply') throw new Error('Direct participant identity evidence missing: ' + key);
    const approval = approvals.get(personId);
    const exact = approval?.socials?.filter((row) => row.platform === platform);
    if (approval?.profileConsent !== 'granted' || exact?.length !== 1 || exact[0].consentStatus !== 'granted' || exact[0].publicUrl !== publicUrl) throw new Error('Exact first social profile consent missing: ' + key);
    Object.assign(current, { publicUrl, candidateStatus: 'candidate_present', verificationStatus: 'verified', publicationStatus: 'withheld_pending_consent' });
  }
  return result;
}
