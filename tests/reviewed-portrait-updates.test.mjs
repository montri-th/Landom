import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { applyReviewedPortraitUpdates } from '../tools/reviewed-portrait-updates.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'landom-reviewed-portrait-'));
  const bytes = fs.readFileSync(new URL('../public/assets/people/I0038.jpg', import.meta.url));
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const publicPath = 'public/assets/people/I0012.jpg';
  const ownerApproval = null;
  const approved = { personId: 'I0012', publicPath, sha256, bytes: bytes.length, mime: 'image/jpeg', identityVerification: 'exact_roster_match_and_direct_participant_reply', publicationBasis: 'individual_consent', ownerApproval };
  const manifest = { assetId: 'PORTRAIT-I0012', path: publicPath, sha256, bytes: bytes.length, mediaType: 'image/jpeg', width: 800, height: 800, metadataStripped: true, approvalScope: 'person-profile', publicationBasis: 'individual_consent', ownerApproval };
  for (const dir of ['public/assets/people', 'data/approved', 'docs']) fs.mkdirSync(path.join(root, dir), { recursive: true });
  fs.writeFileSync(path.join(root, publicPath), bytes);
  const save = () => { fs.writeFileSync(path.join(root, 'data/approved/portrait-assets.json'), JSON.stringify({ assets: [approved] })); fs.writeFileSync(path.join(root, 'docs/assets-manifest.json'), JSON.stringify({ assets: [manifest] })); };
  save();
  const baseline = { meta: { schemaVersion: '1.5.0', source: { snapshotFetchedAt: '2026-08-23' } }, people: [{ personId: 'I0012', names: { nickname: { th: 'พิงกี้' } } }], assets: [{ personId: 'I0012', assetId: 'PORTRAIT-I0012', kind: 'profile_portrait', publicPath, sha256: 'f'.repeat(64), bytes: 1, alt: { th: 'ภาพโปรไฟล์ของพิงกี้' } }], educationRecords: [{ completed: false }], socialProfiles: [{ personId: 'I0009', publicationStatus: 'withheld_pending_verification' }], copy: { th: 'approved' }, certificates: [{ printedEvidence: true }] };
  const contract = { contractVersion: '1.0', reviewedAt: '2026-10-08', scope: 'Landom profile portrait replacements only', sourceBaseCommit: 'b'.repeat(40), baseSiteDataSha256: 'a'.repeat(64), records: [{ personId: 'I0012', expectedPreviousSha256: 'f'.repeat(64), publicPath, sha256, bytes: bytes.length }] };
  const options = { repoRoot: root, baselineSha256: 'a'.repeat(64), publicationConsent: { records: [{ personId: 'I0012', profileConsent: 'granted', portrait: { consentStatus: 'granted', sha256 } }] } };
  return { root, approved, manifest, save, baseline, contract, options, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}

test('reviewed portrait update preserves unrelated graph, source timestamp, alt, and input object', () => {
  const f = fixture();
  try {
    const frozen = structuredClone(f.baseline);
    const result = applyReviewedPortraitUpdates(f.baseline, f.contract, f.options);
    assert.deepEqual(f.baseline, frozen);
    for (const field of ['meta', 'people', 'educationRecords', 'socialProfiles', 'copy', 'certificates']) assert.deepEqual(result[field], frozen[field]);
    assert.deepEqual(result.assets[0].alt, frozen.assets[0].alt);
    assert.equal(result.assets[0].sha256, f.contract.records[0].sha256);
    assert.equal(result.assets[0].sourceUrl, null);
    assert.equal(result.assets[0].publicationStatus, 'withheld_pending_rights_consent_and_verification');
  } finally { f.cleanup(); }
});

test('exact subject portrait consent suffices with null directory-owner approval', () => {
  const f = fixture();
  try {
    f.approved.ownerApproval = null;
    f.manifest.ownerApproval = null;
    f.save();
    assert.equal(applyReviewedPortraitUpdates(f.baseline, f.contract, f.options).assets[0].ownerApproval, null);
  } finally { f.cleanup(); }
});

for (const [label, modify, error] of [
  ['wrong baseline hash', (f) => { f.options.baselineSha256 = 'c'.repeat(64); }, /baseline SHA/],
  ['unknown stable person', (f) => { f.contract.records[0].personId = 'I9999'; }, /Unknown stable/],
  ['previous portrait hash mismatch', (f) => { f.contract.records[0].expectedPreviousSha256 = 'c'.repeat(64); }, /Previous portrait/],
  ['path traversal', (f) => { f.contract.records[0].publicPath = 'public/assets/people/../I0012.jpg'; }, /path mismatch/],
  ['private source URL field', (f) => { f.contract.records[0].sourceUrl = 'https://example.com/private-source'; }, /unsupported field/],
  ['missing exact image consent', (f) => { f.options.publicationConsent.records[0].portrait.sha256 = 'c'.repeat(64); }, /consent missing/],
  ['invalid non-null owner approval', (f) => { f.approved.ownerApproval = { status: 'pending' }; f.save(); }, /inventory mismatch/],
  ['wrong bytes count', (f) => { f.contract.records[0].bytes++; }, /inventory mismatch/],
  ['replaced physical file differs', (f) => { fs.appendFileSync(path.join(f.root, f.contract.records[0].publicPath), 'changed'); }, /bytes\/hash mismatch/],
  ['duplicate update', (f) => { f.contract.records.push(structuredClone(f.contract.records[0])); }, /Duplicate/]
]) test('portrait updates fail closed for ' + label, () => {
  const f = fixture();
  try { modify(f); const before = structuredClone(f.baseline); assert.throws(() => applyReviewedPortraitUpdates(f.baseline, f.contract, f.options), error); assert.deepEqual(f.baseline, before); }
  finally { f.cleanup(); }
});

test('reviewed CLI preserves the complete approved graph and never accesses a missing raw snapshot', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'landom-reviewed-cli-'));
  try {
    for (const dir of ['tools', 'data/approved']) fs.mkdirSync(path.join(root, dir), { recursive: true });
    for (const file of ['normalize-data.mjs', 'normalized-sheet-roundtrip.mjs', 'publication-consent.mjs', 'reviewed-portrait-updates.mjs', 'citymeter-attribution.mjs']) {
      fs.copyFileSync(new URL('../tools/' + file, import.meta.url), path.join(root, 'tools', file));
    }
    const baseline = JSON.parse(fs.readFileSync(new URL('../data/generated/site-data.json', import.meta.url), 'utf8'));
    const reviewedPath = path.join(root, 'reviewed.json');
    fs.writeFileSync(reviewedPath, JSON.stringify(baseline));
    fs.writeFileSync(path.join(root, 'data/approved/publication-consent.json'), JSON.stringify({ contractVersion: '1.0', reviewedAt: baseline.meta.reviewedAt, records: [] }));
    const run = spawnSync(process.execPath, [path.join(root, 'tools/normalize-data.mjs'), '--input', path.join(root, 'absent-raw.json'), '--reviewed-site-data', reviewedPath], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const generated = JSON.parse(fs.readFileSync(path.join(root, 'data/generated/site-data.json'), 'utf8'));
    assert.deepEqual(generated, baseline);
    const media = JSON.parse(fs.readFileSync(path.join(root, 'data/generated/people-media.json'), 'utf8'));
    assert.equal(media.people.length, baseline.people.length);
    assert.equal(media.people.filter((person) => person.portrait).length, baseline.assets.filter((asset) => asset.publicationStatus === 'publishable').length);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
