import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { applyPersonIdentityOverrides } from '../tools/person-identity-overrides.mjs';
import { validatePortfolioIconSet, validateIconHtml, expectedManifestIcons, PORTFOLIO_ICONS } from '../tools/portfolio-icon-contract.mjs';
import { renderLocalizedEntrypoint } from '../tools/build.mjs';
const root = new URL('../', import.meta.url).pathname;
const readJson = async (file) => JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'));

test('owner-confirmed Que identity changes only three English name values and retains consent, credits and portrait absence', async () => {
  const contract = await readJson('data/approved/person-identity-overrides.json');
  const data = await readJson('data/generated/site-data.json');
  const baseline = structuredClone(data);
  const person = baseline.people.find((row) => row.personId === 'I0045');
  person.names.full.en = person.names.nickname.en = person.names.card.en = null;
  const updated = applyPersonIdentityOverrides(baseline, contract);
  assert.deepEqual(updated, data);
  assert.equal(person.names.full.en, null, 'input remains unchanged');
  assert.deepEqual(applyPersonIdentityOverrides(updated, contract), updated, 'idempotent');
  assert.deepEqual([updated.people.length, updated.works.length, updated.contributions.length], [53, 69, 129]);
  const que = updated.people.find((row) => row.personId === 'I0045');
  assert.deepEqual(que.names, { full: { th: 'ณัฐพัฒน์ แดงคงแก้ว', en: 'Nattapat Daengkongkaew' }, nickname: { th: 'คิว', en: 'Que' }, card: { th: 'คิว', en: 'Que' } });
  assert.deepEqual(que.publication, { consentStatus: 'pending', profileStatus: 'withheld_pending_consent' });
  assert.equal(que.bio.en, null);
  const media = await readJson('data/generated/people-media.json');
  const publicQue = media.people.find((row) => row.personId === 'I0045');
  assert.equal(publicQue.portrait, null);
  assert.deepEqual(publicQue.fallback.fullNickname, que.names.card);
});

test('identity application rejects swapped identity, consent fields, duplicate entries and unverified Thai transliteration without mutating input', async () => {
  const data = await readJson('data/generated/site-data.json');
  const contract = await readJson('data/approved/person-identity-overrides.json');
  const original = structuredClone(data);
  for (const change of [
    (c) => { c.overrides.find((row) => row.personId === 'I0045').expectedThaiFullName = 'ชื่ออื่น'; },
    (c) => { c.overrides.find((row) => row.personId === 'I0045').publication = { consentStatus: 'granted' }; },
    (c) => { c.overrides.push(c.overrides.find((row) => row.personId === 'I0045')); },
    (c) => { c.overrides.find((row) => row.personId === 'I0045').nicknameEn = 'คิว'; }
  ]) {
    const invalid = structuredClone(contract); change(invalid);
    assert.throws(() => applyPersonIdentityOverrides(data, invalid));
    assert.deepEqual(data, original);
  }
});

test('approved six-role icons match exact local bytes and every locale/profile URL resolves the same first-party icon set', async () => {
  assert.deepEqual((await validatePortfolioIconSet(root)).errors, []);
  assert.deepEqual((await readJson('public/manifest.webmanifest')).icons, expectedManifestIcons());
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const locale of ['th', 'en']) {
    const html = renderLocalizedEntrypoint(source, locale);
    assert.deepEqual(validateIconHtml(html), []);
    for (const query of ['', '?person=I0045&theme=dark', '?person=I0030&lang=en']) {
      const route = `https://montri-th.github.io/Landom/${locale === 'en' ? 'en/' : ''}${query}`;
      const base = locale === 'en' ? new URL('../', route) : new URL(route);
      for (const icon of PORTFOLIO_ICONS.filter((item) => !item.role.startsWith('manifest'))) {
        assert.equal(new URL(`./${icon.path}`, base).href, `https://montri-th.github.io/Landom/${icon.path}`);
      }
    }
  }
  assert.ok(validateIconHtml(source.replace('sizes="32x32"', 'sizes="192x192"')).length);
  assert.ok(validateIconHtml(source.replace('icon-portfolio-32-5cd19dee724f.png', 'unapproved.png')).length);
});

test('both locale body and UI use exact Bai Jamjuree faces; English headings retain approved Thai fallback', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /--font-body: "Bai Jamjuree", var\(--font-body-fallback\)/);
  for (const token of ['font-display-en', 'font-ui-heading-en']) assert.ok(css.includes(`--${token}: "Arvo", "IBM Plex Sans Thai Looped",`));
  assert.match(css, /font-synthesis:\s*none/);
  const manifest = await readJson('public/assets/fonts/font-assets.manifest.json');
  const faces = manifest.faces.filter((face) => !face.family.startsWith('Material'));
  assert.equal(faces.length, 9);
  for (const face of faces) {
    const bytes = await readFile(new URL(`../public/assets/fonts/${face.file}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), face.sha256, face.file);
    assert.ok(css.includes(`../public/assets/fonts/${face.file}`));
  }
});

test('the single profile-card action keeps query deep links, expansion, close and focus return', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const source = app.match(/function openPerson\b[\s\S]*?(?=\nfunction renderCertificateDialog)/)?.[0];
  assert.ok(source);
  const state = { currentPersonId: null };
  const updates = [];
  const trigger = { focused: false, focus() { this.focused = true; } };
  const detail = { classList: { remove() {}, add() {} } };
  const shell = { querySelector: (selector) => selector.includes('inline-detail') ? detail : trigger, scrollIntoView() { this.scrolled = true; } };
  const open = Function('state', 'cardShellFor', 'renderPersonDetail', 'elements', 'desktopFilterQuery', 'approachMotionController', 'cardPositionSnapshot', 'setCardExpanded', 'updateUrl', 'layoutMasonry', 'animateCardReflow', 'reducedMotionQuery', 'requestAnimationFrame', `${source}; return { openPerson, closePerson };`)(state, (id) => id === 'I0045' ? shell : null, () => true, { filterDialog: { open: false } }, null, null, () => null, (node, expanded) => { node.expanded = expanded; }, (query) => updates.push(query), () => {}, () => {}, { matches: true }, (fn) => fn());
  assert.equal(open.openPerson('I0045', trigger, { animate: false }), true);
  assert.equal(shell.expanded, true);
  assert.deepEqual(updates, [{ person: 'I0045' }]);
  open.closePerson({ animate: false });
  assert.equal(shell.expanded, false);
  assert.equal(trigger.focused, true);
  assert.deepEqual(updates.at(-1), { person: null });
  open.openPerson('I0045', null, { animate: false, fromUrl: true });
  assert.equal(shell.scrolled, true);
  assert.equal(updates.length, 2, 'opening the incoming query does not rewrite history');
  assert.doesNotMatch(app, /person-permalink|ลิงก์โปรไฟล์|Profile link/);
});


test('Nine exact English full name preserves the existing identity, approved portrait and every other fact', async () => {
  const data = await readJson('data/generated/site-data.json');
  const contract = await readJson('data/approved/person-identity-overrides.json');
  const before = structuredClone(data);
  const nine = before.people.find((person) => person.personId === 'I0038');
  nine.names.full.en = null;
  const updated = applyPersonIdentityOverrides(before, contract);
  assert.deepEqual(updated, data);
  assert.deepEqual(updated.people.find((person) => person.personId === 'I0038').names, { full: { th: 'นรภัทร รัฐสมุทร', en: 'Norraphat Rathasamuth' }, nickname: { th: 'ไนน์', en: 'Nine' }, card: { th: 'ไนน์', en: 'Nine' } });
  assert.equal(updated.people.find((person) => person.personId === 'I0038').publication.consentStatus, 'granted');
  assert.deepEqual(updated.assets, before.assets);
  assert.deepEqual(updated.contributions, before.contributions);
  assert.equal(before.people.find((person) => person.personId === 'I0038').names.full.en, null);
});
