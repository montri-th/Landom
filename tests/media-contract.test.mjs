import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteData = JSON.parse(fs.readFileSync(path.join(root, 'data/generated/site-data.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(root, 'data/generated/people-media.json'), 'utf8'));
const portraitInventory = JSON.parse(fs.readFileSync(path.join(root, 'data/approved/portrait-assets.json'), 'utf8'));
const assetManifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/assets-manifest.json'), 'utf8'));
const canonicalRoot = 'https://montri-th.github.io/Landom/';

function digest(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

test('public people media manifest is an absolute-URL projection of governed portraits', () => {
  assert.equal(media.schemaVersion, '1.0.0');
  assert.equal(media.canonicalUrl, `${canonicalRoot}data/generated/people-media.json`);
  assert.equal(media.contract.access, 'public_read_only');
  assert.equal(media.contract.failureMode, 'render_fallback.fullNickname');
  assert.deepEqual(media.people.map((person) => person.personId), siteData.people.map((person) => person.personId));

  const approvedByPersonId = new Map(siteData.assets
    .filter((asset) => asset.kind === 'profile_portrait' && asset.publicPath && asset.publicationStatus === 'publishable')
    .map((asset) => [asset.personId, asset]));

  for (const person of media.people) {
    assert.match(person.profileUrl.th, /^https:\/\/montri-th\.github\.io\/Landom\/\?person=[SPI]\d{4}&lang=th$/);
    assert.match(person.profileUrl.en, /^https:\/\/montri-th\.github\.io\/Landom\/en\/\?person=[SPI]\d{4}&lang=en$/);
    assert.equal(person.fallback.kind, 'full_nickname');
    assert.ok(person.fallback.fullNickname.th || person.fallback.fullNickname.en);
    const approved = approvedByPersonId.get(person.personId);
    if (!approved) {
      assert.equal(person.portrait, null);
      assert.equal(person.fallback.reason, 'no_governed_person_portrait');
      continue;
    }
    assert.equal(person.portrait.url, `${canonicalRoot}${approved.publicPath}`);
    assert.equal(person.portrait.versionedUrl, `${person.portrait.url}?v=${approved.sha256.slice(0, 12)}`);
    assert.equal(person.portrait.sha256, approved.sha256);
    assert.equal(person.portrait.bytes, approved.bytes);
    assert.equal(person.fallback.reason, 'image_load_failure');
  }

  const serialized = JSON.stringify(media);
  assert.doesNotMatch(serialized, /avatars\.githubusercontent|linkedin\.com\/in\//i);
  assert.doesNotMatch(serialized, /"(?:sourceUrl|sourceProfileUrl)"\s*:/i);
});

test('Biw and Nat expose governed absolute portrait URLs while Pote keeps the truthful nickname fallback', () => {
  const byPersonId = new Map(media.people.map((person) => [person.personId, person]));
  assert.equal(byPersonId.get('S0005').portrait.url, `${canonicalRoot}public/assets/people/S0005.jpg`);
  assert.equal(byPersonId.get('S0005').portrait.sha256, 'a79068222c94b892b4af8782751411c421bdaef489219514410596710f657992');
  assert.equal(byPersonId.get('S0006').portrait.url, `${canonicalRoot}public/assets/people/S0006.jpg`);
  assert.equal(byPersonId.get('S0006').portrait.sha256, 'e673f299631e449c72d39a00d349ed53a0801948083a6dbd30e178601a85e422');
  assert.equal(byPersonId.get('S0007').portrait, null);
  assert.deepEqual(byPersonId.get('S0007').fallback.fullNickname, { th: 'โปเต้', en: 'Pote' });
});

test('Nicha portrait is the recorded deterministic source crop with no generated or retouched variant', () => {
  const expectedSourceHash = '655fe37578c1fd7fb30d7fb1a462e51e615d10cd4f4ae8a61714de2977df2201';
  const expectedOutputHash = '226bad11daa7aab5dab832fa992df2777afc876fbbd3837dbfb5cc51b487986c';
  const approved = portraitInventory.assets.find((asset) => asset.personId === 'I0037');
  const manifest = assetManifest.assets.find((asset) => asset.assetId === 'PORTRAIT-I0037');
  const publicPath = path.join(root, 'public/assets/people/I0037.jpg');
  const projected = media.people.find((person) => person.personId === 'I0037');

  assert.equal(digest(publicPath), expectedOutputHash);
  assert.equal(approved.sha256, expectedOutputHash);
  assert.equal(approved.bytes, fs.statSync(publicPath).size);
  assert.equal(approved.optimization.operation, 'deterministic_source_crop_no_retouch');
  assert.equal(approved.optimization.sourceOriginalSha256, expectedSourceHash);
  assert.deepEqual(
    [approved.optimization.cropX, approved.optimization.cropY, approved.optimization.cropWidth, approved.optimization.cropHeight],
    [1000, 0, 1400, 1400]
  );
  assert.equal(manifest.sha256, expectedOutputHash);
  assert.equal(manifest.sourceOriginalSha256, expectedSourceHash);
  assert.equal(manifest.sourceCrop.retouched, false);
  assert.equal(manifest.sourceCrop.generated, false);
  assert.equal(projected.portrait.url, `${canonicalRoot}public/assets/people/I0037.jpg`);
  assert.deepEqual(projected.portrait.alt, { th: 'ภาพโปรไฟล์ของณิชา', en: 'Profile portrait of Nicha' });
});
