import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { uiIconMarkup, UI_GLYPHS } from '../src/interface-icons.js';
import { renderRecruitmentSection } from '../src/recruitment.js';
import { renderPublicEntrypoint } from '../tools/build.mjs';
const read = (p) => readFile(new URL('../' + p, import.meta.url), 'utf8');

// Inspect the supplied TrueType cmap and GSUB ligatures so a declared but absent
// icon cannot pass merely because its name appears in HTML or a font manifest.
function ligatures(font) {
  const u16 = (p) => font.readUInt16BE(p), u32 = (p) => font.readUInt32BE(p);
  const tables = {};
  for (let i = 0; i < u16(4); i++) { const p = 12 + i * 16; tables[font.toString('ascii', p, p + 4)] = u32(p + 8); }
  assert.equal(u16(tables['OS/2'] + 4), 300);
  assert.equal(tables.fvar, undefined, 'The downloaded subset is a fixed-axis instance');
  const cmap = tables.cmap;
  let c;
  for (let i = 0; i < u16(cmap + 2); i++) { const p = cmap + u32(cmap + 8 + i * 8); if (u16(p) === 4) c = p; }
  assert.ok(c);
  const count = u16(c + 6) / 2, ends = c + 14, starts = ends + count * 2 + 2, deltas = starts + count * 2, ranges = deltas + count * 2;
  const glyph = (code) => {
    for (let i = 0; i < count; i++) if (code >= u16(starts + i * 2) && code <= u16(ends + i * 2)) {
      const delta = font.readInt16BE(deltas + i * 2), range = u16(ranges + i * 2);
      if (!range) return (code + delta) & 65535;
      const id = u16(ranges + i * 2 + range + (code - u16(starts + i * 2)) * 2);
      return id ? (id + delta) & 65535 : 0;
    }
    return 0;
  };
  const coverage = (p) => {
    const values = [];
    if (u16(p) === 1) for (let i = 0; i < u16(p + 2); i++) values.push(u16(p + 4 + i * 2));
    else if (u16(p) === 2) for (let i = 0; i < u16(p + 2); i++) { const at = p + 4 + i * 6; for (let x = u16(at); x <= u16(at + 2); x++) values.push(x); }
    else throw Error('Unsupported coverage');
    return values;
  };
  const found = new Set(), gsub = tables.GSUB, lookups = gsub + u16(gsub + 8);
  for (let i = 0; i < u16(lookups); i++) {
    const lookup = lookups + u16(lookups + 2 + i * 2), type = u16(lookup);
    for (let j = 0; j < u16(lookup + 4); j++) {
      let p = lookup + u16(lookup + 6 + j * 2), effectiveType = type;
      if (type === 7) { effectiveType = u16(p + 2); p += u32(p + 4); }
      if (effectiveType !== 4) continue;
      assert.equal(u16(p), 1);
      const bases = coverage(p + u16(p + 2));
      for (let k = 0; k < u16(p + 4); k++) {
        const set = p + u16(p + 6 + k * 2);
        for (let n = 0; n < u16(set); n++) {
          const lig = set + u16(set + 2 + n * 2), sequence = [bases[k]];
          assert.ok(u16(lig) > 0);
          for (let a = 1; a < u16(lig + 2); a++) sequence.push(u16(lig + 2 + a * 2));
          found.add(sequence.join(','));
        }
      }
    }
  }
  return (name) => { const ids = [...name].map((c) => glyph(c.codePointAt(0))); return ids.every(Boolean) && found.has(ids.join(',')); };
}

test('the fixed Google Rounded font has every declared outline UI ligature and exact approved bytes', async () => {
  const contract = JSON.parse(await read('docs/interface-icons-2026-10-10.json'));
  const { font } = contract;
  assert.equal(new URL(font.sourceCssUrl).hostname, 'fonts.googleapis.com');
  assert.equal(new URL(font.sourceUrl).hostname, 'fonts.gstatic.com');
  assert.deepEqual(font.axes, { FILL: 0, wght: 300, GRAD: 0, opsz: 24 });
  assert.deepEqual(font.glyphs, UI_GLYPHS);
  const bytes = await readFile(new URL('../public/assets/fonts/' + font.file, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), font.sha256);
  assert.equal(bytes.length, font.bytes);
  const includes = ligatures(bytes);
  for (const name of UI_GLYPHS) assert.ok(includes(name), `Missing font ligature: ${name}`);
  assert.equal(includes('unregistered_icon'), false);
  const manifest = JSON.parse(await read('public/assets/fonts/font-assets.manifest.json'));
  const face = manifest.faces.find((f) => f.file === font.file);
  assert.equal(face.approvalReceiptSha256, createHash('sha256').update(await read('docs/interface-icons-2026-10-10.json')).digest('hex'));
});

test('icons are supplementary, named glyphs only, with fixed axes in every state', async () => {
  assert.equal(uiIconMarkup('search'), '<span class="ui-icon" aria-hidden="true">search</span>');
  assert.throws(() => uiIconMarkup('filled_unknown'));
  assert.throws(() => uiIconMarkup('search', '" onload="bad'));
  const css = await read('src/styles.css');
  assert.match(css, /\.ui-icon\s*\{[^}]*font-weight:\s*300;[^}]*"FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24/s);
  assert.doesNotMatch(css, /"FILL"\s*1|\.search-symbol::after|\.card-open-cue::after|motion-button-dot/);
  const html = await read('index.html');
  assert.match(html, /<label[^>]*id="search-label"[^>]*for="search-input"/);
  assert.match(html, /id="search-clear"[^>]*aria-label="ล้างคำค้นหา"/);
  const data = JSON.parse(await read('data/generated/site-data.json'));
  assert.match(renderPublicEntrypoint(html, 'en', data), /id="search-clear"[^>]*aria-label="Clear search"/);
  assert.doesNotMatch(html, />[×↗]<\/span>/);
  for (const locale of ['th', 'en']) {
    const section = renderRecruitmentSection(locale);
    assert.equal((section.match(/class="ui-icon disclosure-icon" aria-hidden="true">expand_more/g) || []).length, 4);
    assert.equal((section.match(/<summary><span>/g) || []).length, 4);
  }
});

test('clear-search resets only query, preserves other filters, updates URL and restores input focus', async () => {
  const app = await read('src/app.js');
  const source = app.slice(app.indexOf('function updateSearchClear()'), app.indexOf('function clearFilters()'));
  const state = { filters: { query: 'Que', role: 'intern', cohort: '2026', status: 'active', work: 'W1' }, raw: true };
  const input = { value: 'Que', focus() { this.focused = true; } }, button = { hidden: false }, calls = [];
  const elements = { searchInput: input, searchClear: button, filterRole: { value: 'intern' }, filterCohort: { value: '2026' }, filterStatus: { value: 'active' }, filterWork: { value: 'W1' } };
  const clear = Function('state', 'elements', 'updateUrl', 'renderDirectory', source + ';return clearSearchQuery;')(state, elements, (x) => calls.push(x), () => {});
  clear();
  assert.deepEqual(state.filters, { query: '', role: 'intern', cohort: '2026', status: 'active', work: 'W1' });
  assert.deepEqual(calls, [{ q: '', role: 'intern', cohort: '2026', status: 'active', work: 'W1' }]);
  assert.equal(button.hidden, true); assert.equal(input.focused, true);
});

test('expanded profile keeps a named text action and switches only outline glyph identity', async () => {
  const app = await read('src/app.js');
  const source = app.slice(app.indexOf('function setCardExpanded('), app.indexOf('function renderPersonDetail('));
  const cue = {}, detail = {}, attrs = {}, button = { querySelector: () => cue, setAttribute: (k, v) => { attrs[k] = v; } };
  const shell = { dataset: { personId: 'I0045' }, classList: { toggle() {} }, querySelector: (s) => s.endsWith('.person-card') ? button : detail };
  const update = Function('state', 'message', 'currentNickname', 'escapeHtml', 'uiIconMarkup', 'readingFocusController', source + ';return setCardExpanded;')({ models: [] }, (key) => key, () => 'Que', (s) => s, uiIconMarkup, null);
  update(shell, true); assert.equal(attrs['aria-expanded'], 'true'); assert.equal(detail.hidden, false); assert.match(cue.innerHTML, /collapseProfile.*expand_less/);
  update(shell, false); assert.equal(attrs['aria-expanded'], 'false'); assert.equal(detail.hidden, true); assert.match(cue.innerHTML, /readStory.*expand_more/);
});

test('motion pause/resume and system-reduced states retain labels while using outline glyphs', async () => {
  const source = await read('src/brand-motion.js');
  const body = source.slice(source.indexOf('  function updateButton()'), source.indexOf('  function announce('));
  const text = {}, icon = {}, attrs = {}, button = { querySelector: (s) => s === '.motion-icon' ? icon : text, setAttribute: (k, v) => { attrs[k] = v; } };
  const labels = { reduced: 'Reduced', pause: 'Pause', resume: 'Resume' };
  const run = (userPaused, reduced) => Function('button', 'labels', 'userPaused', 'reducedMotion', body + ';updateButton();')(button, labels, userPaused, { matches: reduced });
  run(false, false); assert.equal(text.textContent, 'Pause'); assert.equal(icon.textContent, 'pause');
  run(true, false); assert.equal(text.textContent, 'Resume'); assert.equal(icon.textContent, 'play_arrow');
  run(true, true); assert.equal(text.textContent, 'Reduced'); assert.equal(icon.textContent, 'pause'); assert.equal(button.disabled, true);
});
