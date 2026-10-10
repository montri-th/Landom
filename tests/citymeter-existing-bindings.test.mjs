import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { applyExistingCitymeterBindings, buildCitymeterContributors } from '../tools/citymeter-attribution.mjs';
import { publicDirectoryEntries } from '../src/public-directory.js';
import { renderPublicEntrypoint } from '../tools/build.mjs';

const read = (file) => JSON.parse(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'));
const contract = read('data/approved/citymeter-existing-work-bindings-2026-10-10.json');
const current = read('data/generated/site-data.json');
const media = read('data/generated/people-media.json');
function baseline() {
  const result = structuredClone(current);
  for (const item of contract.bindings) Object.assign(result.works.find((work) => work.workId === item.workId), structuredClone(item.previousPublicState));
  return result;
}

test('two existing catalog bindings preserve the complete people and contribution graph', () => {
  const before = baseline();
  const frozen = structuredClone(before);
  const result = applyExistingCitymeterBindings(before, contract);
  assert.deepEqual(before, frozen, 'input is not mutated');
  for (const key of Object.keys(before).filter((key) => key !== 'works')) assert.deepEqual(result[key], before[key], key);
  const boundIds = new Set(contract.bindings.map((item) => item.workId));
  assert.deepEqual(result.works.filter((work) => !boundIds.has(work.workId)), before.works.filter((work) => !boundIds.has(work.workId)));
  for (const item of contract.bindings) {
    const previous = before.works.find((work) => work.workId === item.workId);
    const expected = { ...previous, ...item.nextState };
    assert.deepEqual(result.works.find((work) => work.workId === item.workId), expected);
  }
  assert.deepEqual([result.people.length, result.works.length, result.contributions.length], [53, 69, 129]);
  assert.deepEqual(applyExistingCitymeterBindings(result, contract), result, 'repeated normalization is idempotent');
  assert.equal(result.contributions.find((row) => row.contributionId === 'C0122').role.en, 'Developing');
  assert.equal(result.contributions.find((row) => row.contributionId === 'C0123').role.en, 'Improving');
});

for (const [label, mutate, error] of [
  ['wrong module alias', (_, c) => { c.bindings[0].moduleSlug = 'dataset-nonBank'; }, /identity/],
  ['swapped owner', (_, c) => { c.bindings[0].personId = 'I0045'; }, /identity/],
  ['unknown contribution', (d) => { d.contributions = d.contributions.filter((row) => row.contributionId !== 'C0122'); }, /requires the confirmed/],
  ['missing public person', (d) => { d.people = d.people.filter((row) => row.personId !== 'I0045'); }, /requires the confirmed/],
  ['duplicate binding', (_, c) => { c.bindings[1] = structuredClone(c.bindings[0]); }, /Duplicate/],
  ['module collision', (d, c) => { d.works[0].moduleSlug = c.bindings[0].moduleSlug; }, /another work/],
  ['different existing route', (d) => { d.works.find((work) => work.workId === 'work-citymeter-nonbank').destinationUrl = 'https://example.invalid/'; }, /differs from reviewed/],
  ['new evidence note', (d) => { d.works.find((work) => work.workId === 'work-citymeter-nonbank').evidenceNote = 'Changed after review'; }, /differs from reviewed/],
  ['incorrect public destination', (_, c) => { c.bindings[0].nextState.catalogUrl.en = c.bindings[0].nextState.catalogUrl.th; }, /outside the approved/],
  ['new role field', (_, c) => { c.bindings[0].nextState.role = 'Lead'; }, /unsupported fields/],
  ['new completion field', (_, c) => { c.bindings[1].nextState.completed = true; }, /unsupported fields/]
]) test('binding fails without partial mutation for ' + label, () => {
  const data = baseline(); const approval = structuredClone(contract);
  mutate(data, approval); const frozen = structuredClone(data);
  assert.throws(() => applyExistingCitymeterBindings(data, approval), error);
  assert.deepEqual(data, frozen);
});

test('projection and bilingual native links use exact approved identities without changing work completion', () => {
  const result = applyExistingCitymeterBindings(baseline(), contract);
  const projection = buildCitymeterContributors(result, media);
  assert.equal(Object.keys(projection.byModuleSlug).length, 43);
  assert.equal(projection.byModuleSlug['dataset-business-dynamics'], undefined);
  assert.deepEqual(projection.byModuleSlug['dataset-non-bank'].map((row) => row.personId), ['I0030']);
  const worship = projection.byModuleSlug['dataset-places-of-worship'];
  assert.deepEqual(worship.map((row) => row.personId), ['I0045']);
  assert.deepEqual(worship[0].nickname, { th: 'คิว', en: 'Que' });
  assert.equal(worship[0].portrait, null);
  assert.equal(worship[0].contributionRole.en, 'Developing');
  const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const locale of ['th', 'en']) {
    const entries = publicDirectoryEntries(result, locale);
    const html = renderPublicEntrypoint(source, locale, result);
    for (const item of contract.bindings) {
      const links = entries.flatMap((person) => person.contributions).filter((work) => work.workId === item.workId);
      assert.equal(links.length, 1);
      assert.equal(links[0].url, item.nextState.catalogUrl[locale]);
      assert.ok(html.includes(`href="${item.nextState.catalogUrl[locale]}"`));
    }
  }
});
