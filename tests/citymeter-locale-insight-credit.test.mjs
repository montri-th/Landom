import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { applyLocaleInsightContinuation, buildCitymeterContributors } from '../tools/citymeter-attribution.mjs';
import { publicDirectoryEntries } from '../src/public-directory.js';

const root = new URL('../', import.meta.url).pathname;
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const contract = read('data/approved/citymeter-locale-insight-credit-2026-10-11.json');
const current = read('data/generated/site-data.json');
const media = read('data/generated/people-media.json');
function baseline() {
  const data = structuredClone(current);
  data.contributions = data.contributions.filter((row) => row.contributionId !== 'C0130');
  data.meta.counts.contributions = data.contributions.length;
  return data;
}

test('Locale continuation adds only the exact Earth module credit and retains Ing, shared-layer work and all other facts', () => {
  const before = baseline(), frozen = structuredClone(before);
  const result = applyLocaleInsightContinuation(before, contract);
  assert.deepEqual(before, frozen);
  for (const key of Object.keys(before).filter((key) => !['meta', 'contributions'].includes(key))) assert.deepEqual(result[key], before[key], key);
  assert.deepEqual(result.meta, { ...before.meta, counts: { ...before.meta.counts, contributions: 130 } });
  assert.deepEqual(result.contributions.slice(0, before.contributions.length), before.contributions);
  assert.deepEqual([result.people.length, result.works.length, result.contributions.length], [53, 69, 130]);
  assert.deepEqual(applyLocaleInsightContinuation(result, contract), result);
  const added = result.contributions.at(-1);
  assert.deepEqual([added.contributionId, added.personId, added.workId], ['C0130', 'I0034', 'work-citymeter-locale-insights']);
  assert.deepEqual(added.role, { th: 'พัฒนาต่อ', en: 'Continued development' });
  assert.deepEqual(added.period, { start: null, end: null, label: null });
  assert.equal(added.engagementId, null);
  assert.equal(added.evidenceStatus, 'owner_supplied', 'do not claim a Sheet confirmation');
  assert.equal(Object.hasOwn(added, 'version'), false);
  for (const id of ['C0071', 'C0086']) assert.deepEqual(result.contributions.find((row) => row.contributionId === id), before.contributions.find((row) => row.contributionId === id));
});

for (const [name, mutate, message] of [
  ['wrong person', (_d, c) => { c.contribution.personId = 'I0011'; }, /identity or role/],
  ['invented role', (_d, c) => { c.contribution.role.en = 'Lead developer'; }, /identity or role/],
  ['invented date', (_d, c) => { c.contribution.period = { start: '2026-10-11' }; }, /unsupported fields/],
  ['missing original credit', (d) => { d.contributions = d.contributions.filter((row) => row.contributionId !== 'C0071'); }, /differs from reviewed evidence/],
  ['changed shared credit', (d) => { d.contributions.find((row) => row.contributionId === 'C0086').workId = 'work-citymeter-locale-insights'; }, /differs from reviewed evidence/],
  ['changed work identity', (d) => { d.works.find((row) => row.workId === contract.workId).moduleSlug = 'dataset-other'; }, /reviewed module/],
  ['swapped person identity', (d) => { d.people.find((row) => row.personId === 'I0034').names.full.th = 'Another person'; }, /exact reviewed/],
  ['conflicting new credit ID', (d) => { d.contributions.push({ ...d.contributions[0], contributionId: 'C0130' }); }, /differs from approval/],
  ['duplicate person/work pair', (d) => { d.contributions.push({ ...d.contributions[0], contributionId: 'C0999', personId: 'I0034', workId: contract.workId }); }, /another contribution ID/]
]) test('Locale continuation rejects ' + name + ' without partial mutation', () => {
  const data = baseline(), approval = structuredClone(contract); mutate(data, approval);
  const frozen = structuredClone(data);
  assert.throws(() => applyLocaleInsightContinuation(data, approval), message);
  assert.deepEqual(data, frozen);
});

test('public projection and both directory locales retain Ing before Earth without exposing source records', () => {
  const result = applyLocaleInsightContinuation(baseline(), contract);
  const before = buildCitymeterContributors(baseline(), media);
  const after = buildCitymeterContributors(result, media);
  const rows = after.byModuleSlug['dataset-locale-insights'];
  assert.deepEqual(rows.map((row) => [row.personId, row.contributionRole.en]), [['I0011', 'Software development'], ['I0034', 'Continued development']]);
  assert.deepEqual(rows[0], before.byModuleSlug['dataset-locale-insights'][0]);
  for (const key of Object.keys(before.byModuleSlug).filter((key) => key !== 'dataset-locale-insights')) assert.deepEqual(after.byModuleSlug[key], before.byModuleSlug[key]);
  assert.equal(Object.keys(after.byModuleSlug).length, 43);
  for (const row of rows) assert.deepEqual(Object.keys(row), ['personId', 'nickname', 'contributionRole', 'profileUrl', 'portrait']);
  assert.doesNotMatch(JSON.stringify(rows), /C0130|sourceRef|evidenceNote|engagementId|consentStatus/);
  for (const lang of ['th', 'en']) {
    const people = publicDirectoryEntries(result, lang);
    const ing = people.find((person) => person.personId === 'I0011');
    const earth = people.find((person) => person.personId === 'I0034');
    assert.equal(ing.contributions.filter((row) => row.workId === contract.workId).length, 1);
    assert.equal(earth.contributions.filter((row) => row.workId === contract.workId).length, 1);
    assert.equal(earth.contributions.filter((row) => row.workId === 'work-locale-insight-intelligence-layer').length, 1);
  }
});

test('reviewed normalization recreates the credit and projection without raw Sheet access', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'landom-locale-credit-'));
  try {
    const input = path.join(dir, 'reviewed.json'), output = path.join(dir, 'generated');
    fs.writeFileSync(input, JSON.stringify(baseline()));
    execFileSync(process.execPath, [path.join(root, 'tools/normalize-data.mjs'), '--reviewed-site-data', input, '--input', path.join(dir, 'absent-raw.json'), '--output-dir', output], { encoding: 'utf8' });
    const generated = JSON.parse(fs.readFileSync(path.join(output, 'site-data.json'), 'utf8'));
    const projected = JSON.parse(fs.readFileSync(path.join(output, 'citymeter-contributors.json'), 'utf8'));
    assert.equal(generated.contributions.filter((row) => row.contributionId === 'C0130').length, 1);
    assert.equal(generated.meta.counts.contributions, 130);
    assert.equal(generated.meta.reviewedAt, contract.reviewedAt);
    assert.deepEqual(generated.people, current.people);
    assert.deepEqual(generated.works, current.works);
    assert.deepEqual(generated.assets, current.assets);
    assert.deepEqual(projected.byModuleSlug['dataset-locale-insights'].map((row) => row.personId), ['I0011', 'I0034']);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
