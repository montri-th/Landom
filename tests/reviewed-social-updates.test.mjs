import test from 'node:test';
import assert from 'node:assert/strict';
import { applyReviewedSocialUpdates } from '../tools/reviewed-social-updates.mjs';
import { applyPublicationConsent } from '../tools/publication-consent.mjs';

function fixture() {
  const publicUrl = 'https://github.com/exact-person';
  const baseline = { meta: { schemaVersion: '1.5.0', dataUpdatedAt: '2026-10-08' }, people: [{ personId: 'I0045', publication: { consentStatus: 'pending' } }, { personId: 'I0004' }], assets: [], socialProfiles: [{ socialProfileId: 'SOC-I0045-GITHUB', personId: 'I0045', platform: 'github', publicUrl: null, candidateStatus: 'candidate_missing', verificationStatus: 'missing', consentStatus: 'pending', publicationBasis: null, ownerApproval: null, publicationStatus: 'withheld_pending_candidate', candidateValueEmitted: false, dataBoundary: 'private_candidates_not_emitted' }], contributions: [{ contributionId: 'C0130' }], copy: { th: 'Approved' } };
  const contract = { contractVersion: '1.0', reviewedAt: '2026-10-19', scope: 'Landom first LinkedIn and GitHub profiles only', sourceBaseCommit: 'a'.repeat(40), baseSiteDataSha256: 'b'.repeat(64), records: [{ personId: 'I0045', platform: 'github', expectedPreviousPublicUrl: null, publicUrl, identityVerification: 'exact_roster_match_and_direct_participant_reply' }] };
  const publicationConsent = { contractVersion: '1.0', reviewedAt: '2026-10-19', records: [{ personId: 'I0045', profileConsent: 'granted', sourceRef: 'participant_reply_reviewed_2026-10-19', socials: [{ platform: 'github', publicUrl, consentStatus: 'granted' }] }] };
  return { baseline, contract, options: { baselineSha256: 'b'.repeat(64), publicationConsent } };
}

test('first social slot is identity verified before separate exact consent publishes it', () => {
  const f = fixture();
  const before = structuredClone(f.baseline);
  const result = applyReviewedSocialUpdates(f.baseline, f.contract, f.options);
  assert.deepEqual(f.baseline, before);
  for (const field of ['meta', 'people', 'assets', 'contributions', 'copy']) assert.deepEqual(result[field], before[field]);
  assert.equal(result.socialProfiles.length, 1);
  assert.equal(result.socialProfiles[0].consentStatus, 'pending');
  assert.equal(result.socialProfiles[0].publicationStatus, 'withheld_pending_consent');
  const published = applyPublicationConsent(result, f.options.publicationConsent);
  assert.equal(published.socialProfiles[0].publicationStatus, 'publishable');
  assert.equal(published.socialProfiles[0].publicationBasis, 'individual_consent');
});

for (const [label, modify, error] of [
  ['wrong baseline', (f) => { f.options.baselineSha256 = 'c'.repeat(64); }, /baseline SHA/],
  ['unknown person', (f) => { f.contract.records[0].personId = 'I9999'; }, /Unknown stable/],
  ['existing URL', (f) => { f.baseline.socialProfiles[0].publicUrl = 'https://github.com/previous'; }, /untouched missing/],
  ['prior refusal', (f) => { f.baseline.socialProfiles[0].consentStatus = 'denied'; }, /untouched missing/],
  ['unapproved URL', (f) => { f.options.publicationConsent.records[0].socials[0].publicUrl = 'https://github.com/wrong'; }, /consent missing/],
  ['private evidence', (f) => { f.contract.records[0].messageId = 'private'; }, /unsupported field/],
  ['unsupported platform', (f) => { f.contract.records[0].platform = 'facebook'; }, /Unknown stable/],
  ['nonprofile URL', (f) => { f.contract.records[0].publicUrl = 'https://github.com/exact-person/private'; }, /canonical LinkedIn or GitHub/],
  ['duplicate grant', (f) => { f.contract.records.push(structuredClone(f.contract.records[0])); }, /Duplicate/]
]) test('first social update fails closed for ' + label, () => {
  const f = fixture();
  modify(f);
  assert.throws(() => applyReviewedSocialUpdates(f.baseline, f.contract, f.options), error);
});
