import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { applyCitymeterAttribution, buildCitymeterContributors } from '../tools/citymeter-attribution.mjs';
import { publicDirectoryEntries } from '../src/public-directory.js';

const read = (path) => JSON.parse(fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const approved = read('data/approved/citymeter-attribution-2026-10-10.json');
const current = read('data/generated/site-data.json');
const media = read('data/generated/people-media.json');

function baseline() {
  const data = structuredClone(current);
  data.works = data.works.filter((row) => !approved.works.some((item) => item.workId === row.workId));
  data.contributions = data.contributions.filter((row) => !approved.contributions.some((item) => item.contributionId === row.contributionId));
  for (const correction of approved.routeCorrections) Object.assign(data.works.find((work) => work.workId === correction.workId), {
    catalogUrl: structuredClone(correction.previousCatalogUrl), destinationUrl: correction.previousDestinationUrl, linkEvidence: structuredClone(correction.previousLinkEvidence)
  });
  data.meta.counts.works = data.works.length;
  data.meta.counts.contributions = data.contributions.length;
  return data;
}

test('approved attribution is additive and idempotent with only the reviewed historical route correction', () => {
  const before = baseline();
  const frozen = structuredClone(before);
  const result = applyCitymeterAttribution(before, approved);
  assert.deepEqual(before, frozen);
  for (const field of Object.keys(before).filter((key) => !['meta', 'works', 'contributions'].includes(key))) assert.deepEqual(result[field], before[field], field);
  assert.deepEqual(result.meta.source, before.meta.source);
  const historicalId = 'work-citymeter-business-dynamics';
  assert.deepEqual(result.works.slice(0, before.works.length).filter((work) => work.workId !== historicalId), before.works.filter((work) => work.workId !== historicalId));
  const withoutRoutes = ({ catalogUrl, destinationUrl, linkEvidence, ...rest }) => rest;
  assert.deepEqual(withoutRoutes(result.works.find((work) => work.workId === historicalId)), withoutRoutes(before.works.find((work) => work.workId === historicalId)));
  assert.deepEqual(result.contributions.slice(0, before.contributions.length), before.contributions);
  assert.equal(result.works.length, 69);
  assert.equal(result.contributions.length, 129);
  assert.deepEqual(applyCitymeterAttribution(result, approved), result);
  assert.deepEqual(result.contributions.slice(-5).map((row) => [row.contributionId, row.personId, row.workId]), [
    ['C0125', 'I0030', 'work-citymeter-grocery-retail'],
    ['C0126', 'I0034', 'work-citymeter-terrain-elevation'],
    ['C0127', 'I0036', 'work-citymeter-government-spending'],
    ['C0128', 'S0001', 'work-citymeter-events-notices'],
    ['C0129', 'I0034', 'work-citymeter-events-notices']
  ]);
  for (const row of result.contributions.slice(-5)) {
    assert.equal(row.engagementId, null);
    assert.deepEqual(row.period, { start: null, end: null, label: null });
    assert.deepEqual(row.role, { th: 'ร่วมพัฒนา', en: 'Contributor' });
  }
});

for (const [label, mutate, message] of [
  ['unknown person', (data, contract) => { contract.contributions[0].personId = 'I9999'; }, /identity/],
  ['invented role', (data, contract) => { contract.contributions[0].role = 'Lead'; }, /unsupported fields/],
  ['invented dates', (data, contract) => { contract.contributions[0].period = '2026'; }, /unsupported fields/],
  ['private input field', (data, contract) => { contract.works[0].internalReceipt = 'private'; }, /unsupported fields/],
  ['duplicate contribution', (data, contract) => { contract.contributions.push(contract.contributions[0]); }, /Duplicate/],
  ['different work already using module', (data, contract) => { data.works.push({ ...current.works.at(-4), workId: 'work-other', moduleSlug: contract.works[0].moduleSlug }); }, /another work/],
  ['canonical contribution ID conflict', (data, contract) => { data.contributions.push({ ...current.contributions.at(-5), personId: 'I0034' }); }, /differs/],
  ['different ID for same person/work', (data, contract) => { data.contributions.push({ ...current.contributions.at(-5), contributionId: 'C0999' }); }, /another contribution ID/]
]) test('attribution fails closed for ' + label, () => {
  const data = baseline(); const contract = structuredClone(approved); mutate(data, contract);
  const frozen = structuredClone(data);
  assert.throws(() => applyCitymeterAttribution(data, contract), message);
  assert.deepEqual(data, frozen, 'failure must not partially mutate the input graph');
});

test('historical Business Dynamics uses the approved direct route without restoring catalog discovery', () => {
  const result = applyCitymeterAttribution(baseline(), approved);
  const historical = result.works.find((work) => work.workId === 'work-citymeter-business-dynamics');
  assert.deepEqual(historical.catalogUrl, { th: null, en: null });
  assert.equal(historical.destinationUrl, 'https://landometer.com/v3/citymeter?d=businessDynamics');
  assert.equal(historical.linkEvidence.linkScope, 'historical_direct_route');
  for (const language of ['th', 'en']) {
    const links = publicDirectoryEntries(result, language).flatMap((person) => person.contributions).filter((work) => work.workId === historical.workId);
    assert.ok(links.length > 0);
    assert.ok(links.every((work) => work.url === historical.destinationUrl));
  }
  assert.equal(buildCitymeterContributors(result, media).byModuleSlug['dataset-business-dynamics'], undefined);
  assert.throws(() => buildCitymeterContributors(baseline(), media), /must not link/);
  const drift = baseline(); drift.works.find((work) => work.workId === historical.workId).destinationUrl = 'https://example.invalid/';
  const frozen = structuredClone(drift);
  assert.throws(() => applyCitymeterAttribution(drift, approved), /differs from approved correction/);
  assert.deepEqual(drift, frozen);
});

test('existing-work bindings use their approved catalog identities and previous Fuel Stations credits stay distinct', () => {
  for (const [id, slug] of [['work-citymeter-nonbank', 'dataset-non-bank'], ['work-citymeter-religious-places-unresolved', 'dataset-places-of-worship']]) assert.equal(current.works.find((work) => work.workId === id).moduleSlug, slug);
  const fuel = current.contributions.filter((row) => row.workId === 'work-citymeter-fuel-stations');
  assert.ok(fuel.some((row) => row.personId === 'I0043'));
  assert.ok(fuel.some((row) => row.personId === 'I0045' && row.contributionId === 'C0123' && row.role.en === 'Improving'));
});

test('CityMETER public projection has exact identities, localized profile links and no private fields', () => {
  const input = structuredClone(current); const publicMedia = structuredClone(media);
  input.people[0].contacts_internal = { email: 'private@example.invalid' };
  input.contributions[0].privateReceipt = 'private';
  publicMedia.people[0].sourceUrl = 'https://private.example.invalid';
  const projection = buildCitymeterContributors(input, publicMedia);
  assert.equal(Object.keys(projection.byModuleSlug).length, 43);
  assert.equal(projection.byModuleSlug['dataset-business-dynamics'], undefined);
  assert.deepEqual(projection.byModuleSlug['dataset-non-bank'].map((row) => row.personId), ['I0030']);
  assert.deepEqual(projection.byModuleSlug['dataset-places-of-worship'].map((row) => row.personId), ['I0045']);
  assert.deepEqual(projection.byModuleSlug['dataset-events-notices'].map((row) => row.personId), ['S0001', 'I0034']);
  assert.equal(projection.byModuleSlug['dataset-government-spending'][0].nickname.en, 'Toh');
  for (const rows of Object.values(projection.byModuleSlug)) for (const row of rows) {
    assert.deepEqual(Object.keys(row), ['personId', 'nickname', 'contributionRole', 'profileUrl', 'portrait']);
    assert.equal(row.profileUrl.th, `https://montri-th.github.io/Landom/?person=${row.personId}&lang=th`);
    assert.equal(row.profileUrl.en, `https://montri-th.github.io/Landom/en/?person=${row.personId}&lang=en`);
    if (row.portrait) assert.deepEqual(Object.keys(row.portrait), ['url', 'versionedUrl', 'alt']);
  }
  const text = JSON.stringify(projection);
  for (const privateValue of ['contacts_internal', 'private@example.invalid', 'privateReceipt', 'sourceUrl', 'consentStatus', 'engagementId', 'C0125']) assert.equal(text.includes(privateValue), false);
  assert.deepEqual(read('data/generated/citymeter-contributors.json'), buildCitymeterContributors(current, media));
});

test('no portrait or removed public person creates no fallback image or identity', () => {
  const publicMedia = structuredClone(media);
  publicMedia.people.find((row) => row.personId === 'I0030').portrait.status = 'withdrawn';
  const withoutPortrait = buildCitymeterContributors(current, publicMedia);
  assert.equal(withoutPortrait.byModuleSlug['dataset-grocery-retail'][0].portrait, null);
  const data = structuredClone(current);
  data.people = data.people.filter((row) => row.personId !== 'I0030');
  assert.equal(buildCitymeterContributors(data, media).byModuleSlug['dataset-grocery-retail'], undefined);
});
