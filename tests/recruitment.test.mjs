import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { RECRUITMENT_FORM_URL, RECRUITMENT_PROGRAMS, prepareRecruitmentArrival, renderRecruitmentSection, updateRecruitmentSection } from '../src/recruitment.js';
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
    assert.equal((section.match(/<details /g) ?? []).length, 4);
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

test('the bilingual lead foregrounds work and learning while exact compensation stays in native logistics', () => {
  for (const locale of ['th', 'en']) {
    const section = renderRecruitmentSection(locale);
    const lead = section.split('<details class="recruitment-logistics"')[0];
    const logistics = section.match(/<details class="recruitment-logistics"[^]*?<\/details>/)?.[0];
    assert.match(lead, /Data \+ AI/);
    assert.ok(lead.includes(locale === 'th' ? 'มีงานจริงให้ลงมือ' : 'Real work to take on'));
    assert.ok(lead.includes(locale === 'th' ? 'รุ่นพี่นักพัฒนา' : 'former developer interns'));
    assert.doesNotMatch(lead, /400|THB|บาท/);
    assert.ok(logistics.includes(locale === 'th' ? '400 บาท/วัน' : '400 THB/day'));
    assert.ok(logistics.includes(locale === 'th' ? '3 วัน' : '3 days'));
    assert.ok(logistics.includes(locale === 'th' ? '2 วัน' : '2 days'));
    assert.ok(logistics.includes(locale === 'th' ? '10 สัปดาห์' : '10 weeks'));
    assert.doesNotMatch(section, /guaranteed|job guarantee|รับประกัน|การันตี|ได้งานแน่นอน/i);
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
  nextDetails.push({ id: 'internship-logistics', open: false });
  const root = {
    querySelector: () => ({ dataset: { recruitmentLocale: 'th' } }),
    querySelectorAll: (selector) => selector === 'details[open]' ? [{ id: 'internship-pdi-details' }, { id: 'internship-logistics' }] : nextDetails,
    innerHTML: ''
  };
  updateRecruitmentSection(root, 'en');
  assert.equal(root.innerHTML, renderRecruitmentSection('en'));
  assert.deepEqual(nextDetails.map((details) => details.open), [false, true, false, true]);
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

function arrivalFixture(hash = '#internships') {
  const listeners = new Map();
  const frames = new Map();
  const timers = new Map();
  const arrivals = [];
  let sequence = 0;
  let targetTop = 3000;
  const win = {
    location: { hash },
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: (type) => listeners.delete(type),
    setTimeout: (callback, delay) => { assert.equal(delay, 10000); timers.set(++sequence, callback); return sequence; },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (callback) => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: (id) => frames.delete(id)
  };
  const doc = { getElementById: (id) => ({ scrollIntoView: (options) => arrivals.push({ id, top: targetTop, options }) }) };
  const flushFrame = () => {
    const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback());
  };
  return { win, doc, listeners, frames, timers, arrivals, flushFrame, moveTarget: (top) => { targetTop = top; } };
}

test('initial recruitment fragments arrive once at the post-hydration position without animation', () => {
  for (const hash of ['#internships', '#internship-msi', '#internship-pdi', '#internship-fdi']) {
    const fixture = arrivalFixture(hash);
    const arrival = prepareRecruitmentArrival(fixture);
    assert.equal(fixture.arrivals.length, 0);
    arrival.afterLayout();
    fixture.flushFrame();
    fixture.moveTarget(38000); // The full people directory replaces its shorter fallback.
    fixture.flushFrame();
    assert.deepEqual(fixture.arrivals, [{ id: hash.slice(1), top: 38000, options: { block: 'start', behavior: 'instant' } }]);
    arrival.afterLayout(); fixture.flushFrame();
    assert.equal(fixture.arrivals.length, 1);
    assert.equal(fixture.listeners.size, 0);
    assert.equal(fixture.timers.size, 0);
  }
});

test('intervening user intent, navigation or timeout cancels arrival and cleans up pending work', () => {
  for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown', 'hashchange', 'pagehide', 'timeout']) {
    const fixture = arrivalFixture();
    const arrival = prepareRecruitmentArrival(fixture);
    arrival.afterLayout();
    fixture.flushFrame();
    if (event === 'timeout') [...fixture.timers.values()][0]();
    else fixture.listeners.get(event)();
    fixture.flushFrame();
    arrival.afterLayout(); fixture.flushFrame();
    assert.equal(fixture.arrivals.length, 0, `${event} must prevent a later jump`);
    assert.equal(fixture.listeners.size, 0);
    assert.equal(fixture.frames.size, 0);
    assert.equal(fixture.timers.size, 0);
  }
  const fixture = arrivalFixture('#people');
  prepareRecruitmentArrival(fixture).afterLayout();
  assert.equal(fixture.listeners.size, 0, 'other native fragments are untouched');
  assert.equal(fixture.frames.size, 0);
});

test('app waits for both the directory attempt and fonts before the bounded recruitment arrival', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /Promise\.allSettled\(\[loadData\(\), document\.fonts\?\.ready\]\)\.then\(\(\) => recruitmentArrival\.afterLayout\(\)\)/);
});
