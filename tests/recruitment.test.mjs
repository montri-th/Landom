import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { RECRUITMENT_FORM_URL, RECRUITMENT_PROGRAMS, renderRecruitmentSection, updateRecruitmentSection } from '../src/recruitment.js';
import { renderPublicEntrypoint } from '../tools/build.mjs';

const originalHashes = [
  '9bfcce536f95ef5acb97d021dbc92bb17e88aa395d56aa41ab0269cf75177dbe',
  'ee744d266cb4fec479acac5a9cc520b9ae0a81926dd646355b27f0d05394a592',
  '74af307858a43739d76be2f22c87cc8a922419bc59ddc48cc4e3c4eb2ef2c51d'
];

test('three owner-supplied posters retain their original bytes, dimensions, attribution and form destination', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/assets/recruitment/manifest.json', import.meta.url), 'utf8'));
  assert.deepEqual(manifest.assets.map((asset) => asset.programId), ['msi', 'pdi', 'fdi']);
  for (const [index, asset] of manifest.assets.entries()) {
    const bytes = await readFile(new URL(`../${asset.path}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), originalHashes[index]);
    assert.equal(asset.sha256, originalHashes[index]);
    assert.equal(bytes.length, asset.byteLength);
    assert.equal(bytes.readUInt32BE(16), 1080);
    assert.equal(bytes.readUInt32BE(20), 1528);
    assert.equal(asset.decodedQrUrl, RECRUITMENT_FORM_URL);
    assert.equal(asset.approval.role, 'internship recruitment poster');
    assert.equal(asset.approval.status, 'approved');
    assert.equal(asset.path, `public/assets/recruitment/${RECRUITMENT_PROGRAMS[index].poster}`);
    assert.ok(asset.attribution.includes('retained in full'));
  }
});

test('both no-script entrypoints expose the same three programs with native direct apply links and inline details', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const data = JSON.parse(await readFile(new URL('../data/generated/site-data.json', import.meta.url), 'utf8'));
  for (const locale of ['th', 'en']) {
    const html = renderPublicEntrypoint(source, locale, data);
    const section = renderRecruitmentSection(locale);
    assert.ok(html.includes(section), 'build uses the runtime renderer byte-for-byte');
    assert.ok(html.indexOf('id="internships"') > html.indexOf('id="people-board"'));
    assert.ok(html.indexOf('id="internships"') < html.indexOf('<footer'));
    assert.equal((section.match(/<article /g) ?? []).length, 3);
    assert.equal((section.match(/<details /g) ?? []).length, 3);
    assert.equal((section.match(/class="recruitment-apply"/g) ?? []).length, 3);
    assert.equal(section.split(`href="${RECRUITMENT_FORM_URL}"`).length - 1, 3);
    for (const program of RECRUITMENT_PROGRAMS) {
      assert.ok(section.includes(`<h3 id="internship-${program.id}-title" lang="en">${program.name}</h3>`));
      assert.ok(section.includes(program.summary[locale]));
      assert.match(section, /width="1080" height="1528" loading="lazy" decoding="async"/);
    }
    assert.ok(section.includes(locale === 'th' ? 'ตกลงวันเริ่มงานร่วมกัน' : 'start date by agreement'));
    assert.ok(section.includes(locale === 'th' ? '400 บาท/วัน' : '400 THB/day'));
    assert.ok(section.includes(locale === 'th' ? 'ดูรายละเอียดโปรแกรม' : 'Program details'));
    assert.doesNotMatch(section, /onclick=|onload=|hidden|aria-hidden|<script|<iframe|<form|\/edit\b|mailto:|response[s]?[\/-]|JobPosting/);
    assert.equal((html.match(/class="loading-card/g) ?? []).length, 3, 'people loading skeletons are preserved');
  }
});

test('matching initial locale preserves native details and focus without hydration replacement', () => {
  const root = {
    querySelector: () => ({ dataset: { recruitmentLocale: 'th' } }),
    set innerHTML(_) { assert.fail('matching initial section must not be replaced'); }
  };
  updateRecruitmentSection(root, 'th');
  updateRecruitmentSection(null, 'en');
});

test('switching language preserves which program details are open and does not need the registry request', () => {
  const nextDetails = ['msi', 'pdi', 'fdi'].map((id) => ({ id: `internship-${id}-details`, open: false }));
  const root = {
    querySelector: () => ({ dataset: { recruitmentLocale: 'th' } }),
    querySelectorAll: (selector) => selector === 'details[open]' ? [{ id: 'internship-pdi-details' }] : nextDetails,
    innerHTML: ''
  };
  updateRecruitmentSection(root, 'en');
  assert.equal(root.innerHTML, renderRecruitmentSection('en'));
  assert.deepEqual(nextDetails.map((details) => details.open), [false, true, false]);
  const before = root.innerHTML;
  assert.throws(() => updateRecruitmentSection(root, 'unverified'), /Unsupported recruitment locale/);
  assert.equal(root.innerHTML, before);
});

test('section styles keep posters intact, content visible and keyboard controls usable without motion', async () => {
  const css = await readFile(new URL('../src/recruitment.css', import.meta.url), 'utf8');
  assert.match(css, /\.recruitment-poster img[^}]*height: auto/s);
  assert.match(css, /focus-visible[^}]*outline: 3px solid/s);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.doesNotMatch(css, /object-fit:\s*cover|filter:|opacity:\s*0|display:\s*none|visibility:\s*hidden|animation:|transition:|border-left:|border-inline-start:/);
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /function applyLanguage[^]*?updateRecruitmentSection\(document\.getElementById\("recruitment-root"\), state\.language\)/);
});
