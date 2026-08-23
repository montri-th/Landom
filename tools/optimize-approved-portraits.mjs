import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.resolve(process.argv[2] || '/private/tmp/landom-approved-portrait-import.json');
const originalDir = '/private/tmp/landom-portrait-source-originals';
const optimizedDir = '/private/tmp/landom-portrait-optimized';
const report = JSON.parse(await readFile(reportPath, 'utf8'));

await Promise.all([mkdir(originalDir, { recursive: true }), mkdir(optimizedDir, { recursive: true })]);

for (const asset of report.imported) {
  const sourcePath = path.join(repoRoot, asset.publicPath);
  const sourceExtension = path.extname(sourcePath).toLowerCase();
  const optimizedTempPath = path.join(optimizedDir, `${asset.personId}.jpg`);
  const publicPath = `public/assets/people/${asset.personId}.jpg`;
  const destinationPath = path.join(repoRoot, publicPath);
  const preservedOriginal = path.join(originalDir, `${asset.personId}${sourceExtension}`);

  const result = spawnSync('sips', [
    '-Z', '800',
    '-s', 'format', 'jpeg',
    '-s', 'formatOptions', '78',
    sourcePath,
    '--out', optimizedTempPath
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Portrait optimization failed for ${asset.personId}: ${result.stderr || result.stdout}`);

  await rename(sourcePath, preservedOriginal);
  await rename(optimizedTempPath, destinationPath);
  const bytes = await readFile(destinationPath);
  const fileStat = await stat(destinationPath);
  asset.publicPath = publicPath;
  asset.mime = 'image/jpeg';
  asset.bytes = fileStat.size;
  asset.sha256 = createHash('sha256').update(bytes).digest('hex');
  asset.optimization = {
    format: 'jpeg',
    maxDimension: 800,
    quality: 78,
    sourceOriginalPreservedPrivately: true
  };
}

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Optimized ${report.imported.length} portraits; source originals preserved at ${originalDir}.`);
