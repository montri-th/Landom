import assert from 'node:assert/strict';
import test from 'node:test';
import { applyPublicationConsent } from '../tools/publication-consent.mjs';

const hash = 'a'.repeat(64);
function fixture() {
  return {
    meta: { source: { fetchedAt: '2026-08-23T10:00:00Z' }, dataUpdatedAt: '2026-08-23' },
    people: ['I0001', 'I0002'].map((personId) => ({ personId, bio: { status: 'owner_pending', th: null, en: null }, publication: { consentStatus: 'pending', profileStatus: 'withheld_pending_consent' } })),
    assets: ['I0001', 'I0002'].map((personId) => ({
      assetId: 'PORTRAIT-' + personId, personId, kind: 'profile_portrait',
      verificationStatus: 'verified', consentStatus: 'pending', rightsStatus: 'cleared',
      publicationBasis: 'owner_authorized_public_profile_portrait', ownerApproval: { status: 'granted' },
      publicPath: 'public/assets/people/' + personId + '.jpg', sourceUrl: null,
      sha256: hash, mediaType: 'image/jpeg', bytes: 123, publicationStatus: 'publishable'
    })),
    socialProfiles: ['I0001', 'I0002'].map((personId) => ({
      personId, platform: 'linkedin', publicUrl: 'https://www.linkedin.com/in/' + personId + '/',
      verificationStatus: 'verified', consentStatus: 'pending',
      publicationBasis: 'owner_authorized_public_profile_link', ownerApproval: { status: 'granted' }, publicationStatus: 'publishable'
    })),
    certificates: [{ personId: 'I0001', consentStatus: 'pending' }]
  };
}

function contract(record = {}) {
  return {
    contractVersion: '1.0', reviewedAt: '2026-09-30',
    records: [{ personId: 'I0001', profileConsent: 'granted', sourceRef: 'participant_reply_reviewed_2026-09-30', ...record }]
  };
}

test('profile consent preserves unapproved media, links, certificates and nonrespondents', () => {
  const original = fixture();
  const before = structuredClone(original);
  const updated = applyPublicationConsent(original, contract());
  assert.deepEqual(original, before, 'applying consent must not mutate its input');
  assert.deepEqual(updated.people[0].publication, { consentStatus: 'granted', profileStatus: 'eligible' });
  assert.deepEqual(updated.people[0].bio, before.people[0].bio, 'publication consent is not final profile-copy approval');
  assert.deepEqual(updated.people[1], before.people[1]);
  assert.deepEqual(updated.assets, before.assets);
  assert.deepEqual(updated.socialProfiles, before.socialProfiles);
  assert.deepEqual(updated.certificates, before.certificates);
  assert.deepEqual(updated.meta.source, before.meta.source);
  assert.equal(updated.meta.dataUpdatedAt, '2026-09-30');
  assert.doesNotMatch(JSON.stringify(updated), /participant_reply|sourceRef|messageId|attachmentId/);
});

test('exact portrait hash and exact public social URL grant only their approved scopes', () => {
  const approval = contract({
    portrait: { consentStatus: 'granted', sha256: hash },
    socials: [{ platform: 'linkedin', publicUrl: 'https://www.linkedin.com/in/I0001/', consentStatus: 'granted' }]
  });
  const updated = applyPublicationConsent(fixture(), approval);
  assert.equal(updated.assets[0].publicationBasis, 'individual_consent');
  assert.equal(updated.assets[0].rightsStatus, 'cleared');
  assert.equal(updated.socialProfiles[0].publicationBasis, 'individual_consent');
  assert.deepEqual(updated.assets[1], fixture().assets[1]);
  assert.deepEqual(applyPublicationConsent(updated, approval), updated, 'reapplying the same reviewed scopes must be stable');
  assert.throws(() => applyPublicationConsent(fixture(), contract({ portrait: { consentStatus: 'granted', sha256: 'b'.repeat(64) } })), /SHA-256 mismatch/);
  assert.throws(() => applyPublicationConsent(fixture(), contract({ portrait: { consentStatus: 'granted', sha256: null } })), /exact verified public asset/);
  assert.throws(() => applyPublicationConsent(fixture(), contract({ socials: [{ platform: 'linkedin', publicUrl: 'https://www.linkedin.com/in/I0001', consentStatus: 'granted' }] })), /URL mismatch/);
  const unverified = fixture();
  unverified.assets[0].verificationStatus = 'owner_review_required';
  assert.throws(() => applyPublicationConsent(unverified, approval), /exact verified public asset/);
});

test('portrait refusal overrides historical owner authorization even when profile consent is granted', () => {
  const approval = contract({ portrait: { consentStatus: 'denied', sha256: null } });
  const updated = applyPublicationConsent(fixture(), approval);
  assert.equal(updated.people[0].publication.consentStatus, 'granted');
  assert.equal(updated.assets[0].consentStatus, 'denied');
  assert.equal(updated.assets[0].rightsStatus, 'denied');
  assert.equal(updated.assets[0].publicationBasis, null);
  assert.notEqual(updated.assets[0].publicationStatus, 'publishable');
  for (const field of ['publicPath', 'sourceUrl', 'sha256', 'mediaType', 'bytes']) assert.equal(updated.assets[0][field], null);
  assert.deepEqual(applyPublicationConsent(updated, approval), updated);
});

test('a refused social channel is omitted despite historical owner authorization and cannot revive on reapplication', () => {
  const original = fixture();
  const approval = contract({ socials: [{ platform: 'linkedin', consentStatus: 'denied' }] });
  const updated = applyPublicationConsent(original, approval);
  assert.equal(updated.people[0].publication.consentStatus, 'granted');
  assert.equal(updated.socialProfiles.some((profile) => profile.personId === 'I0001' && profile.platform === 'linkedin'), false);
  assert.equal(JSON.stringify(updated).includes('https://www.linkedin.com/in/I0001/'), false);
  assert.deepEqual(updated.socialProfiles, [original.socialProfiles[1]]);
  assert.deepEqual(updated.assets, original.assets);
  assert.deepEqual(applyPublicationConsent(updated, approval), updated);
  assert.throws(() => applyPublicationConsent(original, contract({ socials: [{ platform: 'linkedin', publicUrl: 'https://www.linkedin.com/in/wrong/', consentStatus: 'denied' }] })), /URL mismatch/);
});

test('consent fails closed on unknown or duplicate identities and unsupported private evidence', () => {
  assert.throws(() => applyPublicationConsent(fixture(), contract({ personId: 'I9999' })), /unknown person/);
  const duplicate = contract();
  duplicate.records.push(structuredClone(duplicate.records[0]));
  assert.throws(() => applyPublicationConsent(fixture(), duplicate), /Duplicate publication consent/);
  const duplicateLinks = contract({ socials: [0, 1].map(() => ({ platform: 'linkedin', publicUrl: 'https://www.linkedin.com/in/I0001/', consentStatus: 'granted' })) });
  assert.throws(() => applyPublicationConsent(fixture(), duplicateLinks), /Duplicate social consent/);
  assert.throws(() => applyPublicationConsent(fixture(), contract({ messageId: 'PRIVATE' })), /unsupported field/);
  assert.throws(() => applyPublicationConsent(fixture(), contract({ sourceRef: 'person@example.com' })), /bounded participant review/);
  assert.throws(() => applyPublicationConsent(fixture(), contract({ socials: [{ platform: 'facebook', publicUrl: 'https://facebook.com/example', consentStatus: 'granted' }] })), /public LinkedIn or GitHub/);
});
