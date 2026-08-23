import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

const evidencePath = path.resolve(option('--input', '/tmp/landom-linkedin-portrait-observations.json'));
const rawSnapshotPath = path.resolve(option('--raw', path.join(repoRoot, 'data/raw/google-sheet-snapshot.json')));
const reportPath = path.resolve(option('--report', '/private/tmp/landom-approved-portrait-import.json'));
const outputDir = path.join(repoRoot, 'public/assets/people');

const [observations, rawSnapshot, generatedPeople] = await Promise.all([
  readFile(evidencePath, 'utf8').then(JSON.parse),
  readFile(rawSnapshotPath, 'utf8').then(JSON.parse),
  readFile(path.join(repoRoot, 'data/generated/people.json'), 'utf8').then(JSON.parse)
]);

const [rawHeader, ...rawRows] = rawSnapshot.sheets.people_registry;
if (rawRows.length !== generatedPeople.length) {
  throw new Error(`Cannot map portrait identities: raw people ${rawRows.length} != canonical people ${generatedPeople.length}.`);
}

const sourceIdToPersonId = new Map(rawRows.map((row, index) => [String(row[0]), generatedPeople[index].personId]));
const rawBySourceId = new Map(rawRows.map((row) => [String(row[0]), Object.fromEntries(rawHeader.map((key, index) => [key, row[index] ?? '']))]));
const mimeExtensions = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);

await mkdir(outputDir, { recursive: true });
const imported = [];
const skipped = [];

async function downloadImage(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (compatible; LandometerAssetImporter/1.0)'
    },
    redirect: 'follow'
  });
  if (!response.ok) return { error: `download_http_${response.status}` };
  const mime = String(response.headers.get('content-type') || '').split(';')[0].toLowerCase();
  const extension = mimeExtensions.get(mime);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!extension || bytes.length < 1024 || bytes.length > 10_000_000) {
    return { error: `unsupported_asset_${mime || 'unknown'}_${bytes.length}` };
  }
  return { mime, extension, bytes };
}

for (const observation of observations) {
  const personId = sourceIdToPersonId.get(observation.sourceId);
  const sourceUrl = observation.portrait?.src;
  if (!personId || !sourceUrl) {
    skipped.push({ sourceId: observation.sourceId, personId: personId || null, reason: personId ? 'no_portrait_found' : 'identity_mapping_missing' });
    continue;
  }

  const downloaded = await downloadImage(sourceUrl);
  if (downloaded.error) {
    skipped.push({ sourceId: observation.sourceId, personId, reason: downloaded.error });
    continue;
  }

  const { mime, extension, bytes } = downloaded;
  const filename = `${personId}.${extension}`;
  await writeFile(path.join(outputDir, filename), bytes);
  imported.push({
    personId,
    publicPath: `public/assets/people/${filename}`,
    mime,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    sourcePlatform: 'linkedin',
    sourceProfileUrl: observation.url,
    observedProfileTitle: observation.title,
    observedDimensions: { width: observation.portrait.w, height: observation.portrait.h },
    identityVerification: 'sheet_profile_url_and_visible_profile_title',
    ownerApproval: {
      status: 'granted',
      approvedAt: '2026-08-23',
      scope: 'public_profile_portrait',
      sourceRef: 'owner_instruction_2026-08-23'
    }
  });
}

const linkedInImportedIds = new Set(imported.map((record) => record.personId));
for (const record of [...skipped]) {
  if (!record.personId || linkedInImportedIds.has(record.personId)) continue;
  const rawPerson = rawBySourceId.get(record.sourceId);
  const profileUrl = String(rawPerson?.github_url || '').trim();
  const match = profileUrl.match(/^https:\/\/github\.com\/([^/?#]+)\/?/i);
  if (!match) continue;

  const apiResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(match[1])}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'LandometerAssetImporter/1.0' }
  });
  if (!apiResponse.ok) continue;
  const github = await apiResponse.json();
  const expectedName = String(rawPerson.full_name_en || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
  const observedName = String(github.name || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
  const linkedInObservation = observations.find((item) => item.sourceId === record.sourceId);
  const linkedInTitle = String(linkedInObservation?.title || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
  const identityVerified = Boolean(expectedName) && (expectedName === observedName || linkedInTitle.includes(expectedName));
  if (!identityVerified) continue;

  const downloaded = await downloadImage(github.avatar_url);
  if (downloaded.error) continue;
  const { mime, extension, bytes } = downloaded;
  const filename = `${record.personId}.${extension}`;
  await writeFile(path.join(outputDir, filename), bytes);
  imported.push({
    personId: record.personId,
    publicPath: `public/assets/people/${filename}`,
    mime,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    sourcePlatform: 'github',
    sourceProfileUrl: profileUrl,
    observedProfileTitle: github.name,
    observedDimensions: null,
    identityVerification: expectedName === observedName
      ? 'sheet_profile_url_and_github_api_full_name_exact'
      : 'sheet_github_url_cross_checked_against_exact_linkedin_profile_title',
    ownerApproval: {
      status: 'granted',
      approvedAt: '2026-08-23',
      scope: 'public_profile_portrait',
      sourceRef: 'owner_instruction_2026-08-23'
    }
  });
  record.reason = 'linkedin_unavailable_github_fallback_imported';
}

await writeFile(reportPath, `${JSON.stringify({ imported, skipped }, null, 2)}\n`, 'utf8');
console.log(`Imported ${imported.length} owner-approved portraits; skipped ${skipped.length}. Private report: ${reportPath}`);
