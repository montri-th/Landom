import { createHash } from 'node:crypto';
import { copyFile, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PUBLIC_BUILD_INPUTS, validateSite } from './validate-site.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(repoRoot, 'dist');

export const PUBLISH_PATHS = PUBLIC_BUILD_INPUTS;

function assertSafeDistPath() {
  if (path.dirname(distRoot) !== repoRoot || path.basename(distRoot) !== 'dist') {
    throw new Error(`Refusing to replace unexpected build path: ${distRoot}`);
  }
}

async function copyDeterministically(source, destination) {
  const sourceStat = await lstat(source);
  if (sourceStat.isSymbolicLink()) throw new Error(`Build inputs may not be symbolic links: ${source}`);
  if (sourceStat.isFile()) {
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
    return;
  }
  if (!sourceStat.isDirectory()) throw new Error(`Unsupported build input: ${source}`);

  await mkdir(destination, { recursive: true });
  const entries = (await readdir(source, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name, 'en')
  );
  for (const entry of entries) {
    await copyDeterministically(path.join(source, entry.name), path.join(destination, entry.name));
  }
}

async function listFiles(directory) {
  const entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name, 'en')
  );
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(entryPath)));
    else if (entry.isFile()) files.push(entryPath);
    else throw new Error(`Build output contains an unsupported filesystem entry: ${entryPath}`);
  }
  return files;
}

async function createBuildManifest() {
  const files = await listFiles(distRoot);
  const records = [];
  for (const file of files) {
    if (path.basename(file) === 'build-manifest.json') continue;
    const bytes = await readFile(file);
    records.push({
      path: path.relative(distRoot, file).split(path.sep).join('/'),
      bytes: bytes.byteLength,
      sha256: createHash('sha256').update(bytes).digest('hex')
    });
  }
  const manifest = {
    formatVersion: 1,
    reproducible: true,
    inputs: [...PUBLISH_PATHS],
    files: records
  };
  await writeFile(path.join(distRoot, 'build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

export async function buildSite() {
  const sourceErrors = await validateSite();
  if (sourceErrors.length > 0) {
    throw new Error(`Refusing to build invalid or private source:\n- ${sourceErrors.join('\n- ')}`);
  }
  assertSafeDistPath();
  await rm(distRoot, { recursive: true, force: true });
  await mkdir(distRoot, { recursive: true });

  for (const relativePath of PUBLISH_PATHS) {
    if (relativePath === 'data/raw' || relativePath.startsWith('data/raw/')) {
      throw new Error('Private data/raw is not a permitted build input.');
    }
    await copyDeterministically(path.join(repoRoot, relativePath), path.join(distRoot, relativePath));
  }
  await writeFile(path.join(distRoot, '.nojekyll'), '', 'utf8');
  await createBuildManifest();
  const distErrors = await validateSite({ distMode: true });
  if (distErrors.length > 0) {
    throw new Error(`Built artifact failed its privacy/site contract:\n- ${distErrors.join('\n- ')}`);
  }
  console.log(`Built ${path.relative(repoRoot, distRoot)} from ${PUBLISH_PATHS.join(', ')}.`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    await buildSite();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
