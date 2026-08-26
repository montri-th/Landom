import { createHash } from 'node:crypto';
import { copyFile, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PUBLIC_BUILD_INPUTS, validateSite } from './validate-site.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(repoRoot, 'dist');
const canonicalRoot = 'https://montri-th.github.io/Landom/';

const EN_INITIAL_HTML_REPLACEMENTS = Object.freeze([
  ['LANDOM · พวกเรา ที่ช่วยกันสร้าง LANDOMETER', 'Landom — meet the people shaping Landometer'],
  ['Landom — คนที่ร่วมสร้าง Landometer', 'Landom — meet the people shaping Landometer'],
  [
    'รู้จักคน ความสนใจ และผลงานที่เกิดขึ้นระหว่างการร่วมงานกับ Landometer',
    'Meet the people, interests and work shaped through time with Landometer.'
  ],
  ['"inLanguage": "th"', '"inLanguage": "en"'],
  ['"name": "ชาว Landom"', '"name": "People of Landom"'],
  ['ข้ามไปยังเนื้อหาหลัก', 'Skip to main content'],
  ['ส่วนหัวเว็บไซต์', 'Site header'],
  ['Landom — หน้าหลัก', 'Landom — home'],
  ['การตั้งค่าการแสดงผล', 'Display preferences'],
  ['ธีม: ตามระบบ กดเพื่อใช้ธีมสว่าง', 'Theme: system. Press to use light theme'],
  ['Switch to English', 'เปลี่ยนเป็นภาษาไทย'],
  ['<span aria-hidden="true">TH</span>', '<span aria-hidden="true">EN</span>'],
  ['LANDOM · ชุมชนของคนที่ร่วมสร้าง LANDOMETER', 'LANDOM · THE PEOPLE SHAPING LANDOMETER'],
  ['ไม่ใช่สถานที่&#10;แต่คือผู้คน', 'It’s not a place.&#10;It’s the people.'],
  ['ชาว Landom ถ่ายภาพร่วมกันที่สำนักงาน Landometer', 'People of Landom together at the Landometer office'],
  [
    'Landom — แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น',
    'Landom is for people who want to understand cities and make them better, together.'
  ],
  ['คนใน Landom', 'people in Landom'],
  ['กำลังโหลดข้อมูลล่าสุด', 'Loading the latest data'],
  ['ชาว Landom', 'PEOPLE OF LANDOM'],
  ['รู้จักพวกเรา ที่อยู่เบื้องหลังแต่ละงาน', 'Meet the people behind the work'],
  ['กำลังโหลด…', 'Loading…'],
  ['ค้นหาชื่อ มหาวิทยาลัย สาขาที่เรียน หรือผลงาน', 'Search by name, university, program or contribution'],
  ['ค้นหาคนหรือผลงาน', 'Search people or work'],
  ['ตัวกรอง', 'Filters'],
  ['เลือกดูให้ตรงความสนใจ', 'NARROW THE RESULTS'],
  ['บทบาท', 'Role'],
  ['ทุกบทบาท', 'All roles'],
  ['พนักงานประจำ', 'Full-time staff'],
  ['พนักงานพาร์ตไทม์', 'Part-time staff'],
  ['รุ่น / ปี', 'Cohort / year'],
  ['ทุกรุ่น', 'All cohorts'],
  ['สถานะ', 'Status'],
  ['ทุกสถานะ', 'All statuses'],
  ['ร่วมงานอยู่', 'Active'],
  ['เคยร่วมงาน', 'Alumni'],
  ['ผลงาน', 'Contribution'],
  ['ทุกผลงาน', 'All contributions'],
  ['ล้างตัวกรอง', 'Clear filters'],
  ['ดูผลลัพธ์', 'Show results'],
  ['ปิดตัวกรอง', 'Close filters'],
  ['ไม่พบข้อมูลที่ค้นหา', 'No matching profiles'],
  ['ลองใช้คำค้นสั้นลง หรือล้างตัวกรองแล้วค้นหาอีกครั้ง', 'Try a shorter search or clear the filters and search again.'],
  ['ล้างการค้นหาและตัวกรอง', 'Clear search and filters'],
  ['โหลดข้อมูลไม่สำเร็จ', 'The profiles could not be loaded'],
  ['โปรดลองอีกครั้ง ข้อมูลบุคคลจะไม่ถูกแทนที่ด้วยข้อมูลที่ยังไม่ได้ยืนยัน', 'Please try again. Unverified information will not be substituted.'],
  ['ลองอีกครั้ง', 'Try again'],
  ['มาเป็นชาว Landom กัน · Let us cultivate our city with data.', 'Come be part of Landom · Let us cultivate our city with data.'],
  ['ชาวด้อม Landom', 'People of Landom'],
  ['ประกาศนียบัตร', 'Certificates'],
  ['ปิดประกาศนียบัตร', 'Close certificate'],
  ['เปิดภาพต้นฉบับ', 'Open original image'],
  ['บันทึกภาพความละเอียดสูง', 'Save high-resolution image'],
  [
    'หน้านี้ต้องใช้ JavaScript เพื่ออ่านและกรองทะเบียนบุคลากร แต่จะไม่ส่งข้อมูลการค้นหาออกจากอุปกรณ์ของคุณ',
    'This page uses JavaScript to read and filter the public directory. Search terms stay on your device.'
  ]
]);

export const PUBLISH_PATHS = PUBLIC_BUILD_INPUTS;

function replaceRequired(source, search, replacement, label = search) {
  if (!source.includes(search)) throw new Error(`Localized entrypoint is missing required source text: ${label}`);
  return source.replaceAll(search, replacement);
}

export function renderLocalizedEntrypoint(source, locale) {
  if (!['th', 'en'].includes(locale)) throw new Error(`Unsupported locale route: ${locale}`);
  if (locale === 'th') return source;
  const localeUrl = `${canonicalRoot}en/`;
  let html = source;
  html = replaceRequired(html, '  <head>\n', '  <head>\n    <base href="../">\n', '<head>');
  html = replaceRequired(
    html,
    '  data-default-language="th"\n  data-locale-route="th"\n>',
    '  data-default-language="en"\n  data-locale-route="en"\n>',
    'root language attributes'
  );
  html = replaceRequired(
    html,
    'href="#main-content"',
    `href="${localeUrl}#main-content"`,
    'locale-safe skip link'
  );
  html = replaceRequired(
    html,
    '<a class="brand" href="./"',
    `<a class="brand" href="${localeUrl}"`,
    'locale-safe home link'
  );
  html = replaceRequired(
    html,
    `<link rel="canonical" href="${canonicalRoot}">`,
    `<link rel="canonical" href="${localeUrl}">`,
    'canonical link'
  );
  html = replaceRequired(
    html,
    `<meta property="og:url" content="${canonicalRoot}">`,
    `<meta property="og:url" content="${localeUrl}">`,
    'Open Graph URL'
  );
  html = replaceRequired(
    html,
    `"@id": "${canonicalRoot}#collection"`,
    `"@id": "${localeUrl}#collection"`,
    'CollectionPage @id'
  );
  html = replaceRequired(
    html,
    `"url": "${canonicalRoot}",`,
    `"url": "${localeUrl}",`,
    'CollectionPage URL'
  );
  html = replaceRequired(html, '  lang="th"', '  lang="en"', 'root lang');
  html = replaceRequired(html, '<meta property="og:locale" content="th_TH">', '<meta property="og:locale" content="en_US">');
  html = replaceRequired(html, '<meta property="og:locale:alternate" content="en_US">', '<meta property="og:locale:alternate" content="th_TH">');
  for (const [search, replacement] of [...EN_INITIAL_HTML_REPLACEMENTS].sort(
    (left, right) => right[0].length - left[0].length
  )) {
    html = replaceRequired(html, search, replacement);
  }
  return html;
}

async function createLocalizedEntrypoints() {
  const source = await readFile(path.join(distRoot, 'index.html'), 'utf8');
  const localeDirectory = path.join(distRoot, 'en');
  await mkdir(localeDirectory, { recursive: true });
  await writeFile(path.join(localeDirectory, 'index.html'), renderLocalizedEntrypoint(source, 'en'), 'utf8');
}

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
  await createLocalizedEntrypoints();
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
