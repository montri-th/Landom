import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { contributionRoleLabel, publicDirectoryEntries, personProfileUrl, renderPublicDirectory } from '../src/public-directory.js';
import { renderPublicEntrypoint } from '../tools/build.mjs';

const fixture = {
  people: [{ personId: 'I0045', names: { card: { th: 'คิว', en: 'Q' }, full: { th: 'ชื่อ <ทดสอบ>', en: 'Example Name' } }, bio: { th: 'UNAPPROVED_STATEMENT' }, email: 'PRIVATE_EMAIL' }],
  works: [{ workId: 'citymeter-test', names: { th: 'ศาสนสถาน & ชุมชน', en: 'Places of Worship' }, catalogUrl: { th: 'https://montri-th.github.io/CityMETER/#dataset-test', en: 'https://montri-th.github.io/CityMETER/en/#dataset-test' } }],
  contributions: [{ personId: 'I0045', workId: 'citymeter-test', role: { en: 'Data preparation' }, sourceRef: 'INTERNAL_RECEIPT' }]
};

test('public fallback projects only public names, roles and work links in each language', () => {
  const entry = publicDirectoryEntries(fixture, 'en')[0];
  assert.equal(entry.name, 'Q');
  assert.equal(entry.contributions[0].name, 'Places of Worship');
  assert.equal(entry.contributions[0].url, 'https://montri-th.github.io/CityMETER/en/#dataset-test');
  assert.equal(entry.url, 'https://montri-th.github.io/Landom/en/?person=I0045');
  assert.equal(personProfileUrl('I0045', 'th'), 'https://montri-th.github.io/Landom/?person=I0045');
  assert.equal(personProfileUrl('../secret'), '');
  const html = renderPublicDirectory(fixture, 'th');
  assert.match(html, /ชื่อ &lt;ทดสอบ&gt;/);
  assert.match(html, /ศาสนสถาน &amp; ชุมชน/);
  assert.match(html, /<details><summary>/);
  assert.doesNotMatch(html, /UNAPPROVED_STATEMENT|PRIVATE_EMAIL|INTERNAL_RECEIPT|hidden/);
});

test('unsafe destinations and unknown work references never become fallback links', () => {
  const data = structuredClone(fixture);
  data.works[0].catalogUrl = 'javascript:alert(1)';
  data.contributions.push({ personId: 'I0045', workId: 'missing' });
  const entries = publicDirectoryEntries(data);
  assert.equal(entries[0].contributions.length, 1);
  assert.equal(entries[0].contributions[0].url, '');
  assert.doesNotMatch(renderPublicDirectory(data), /javascript:|missing/);
});

test('contribution display uses the approved local role without turning a generic credit into leadership', () => {
  const data = structuredClone(fixture);
  data.contributions[0].role = { th: 'ร่วมพัฒนา', en: 'Contributor' };
  assert.equal(publicDirectoryEntries(data, 'th')[0].contributions[0].role, 'ร่วมพัฒนา');
  assert.equal(publicDirectoryEntries(data, 'en')[0].contributions[0].role, 'Team member');
  assert.equal(contributionRoleLabel('Contributor', 'th'), 'ร่วมทำงาน');
  assert.equal(contributionRoleLabel('Software development', 'th'), 'พัฒนาซอฟต์แวร์');
  assert.equal(data.contributions[0].role.en, 'Contributor', 'canonical attribution remains unchanged');
});

test('both build entrypoints contain every generated identity and contribution, with minimal graph parity', async () => {
  const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const data = JSON.parse(await readFile(new URL('../data/generated/site-data.json', import.meta.url), 'utf8'));
  for (const locale of ['th', 'en']) {
    const html = renderPublicEntrypoint(source, locale, data);
    const entries = publicDirectoryEntries(data, locale);
    assert.equal((html.match(/data-public-person-id=/g) || []).length, data.people.length);
    assert.equal((html.match(/data-public-work-id=/g) || []).length, entries.reduce((count, person) => count + person.contributions.length, 0));
    assert.equal((html.match(/id="public-directory-fallback"/g) || []).length, 1);
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1);
    const graph = JSON.parse(scripts[0][1]);
    assert.equal(Array.isArray(graph), false);
    const people = graph['@graph'].filter((node) => node['@type'] === 'Person');
    assert.equal(people.length, entries.length);
    for (const node of graph['@graph']) assert.deepEqual(Object.keys(node).sort(), ['@id', '@type', 'name', 'url']);
    people.forEach((person, index) => {
      assert.equal(person.name, entries[index].name);
      assert.equal(person.url, entries[index].url);
    });
    assert.match(html, /id="loading-state" aria-hidden="true" hidden/);
    assert.match(html, new RegExp(`href="https://montri-th.github.io/Landom/${locale === 'en' ? 'en/' : ''}\\?person=I0045"`));
    assert.equal(renderPublicEntrypoint(source, locale, data), html, 'build rendering is deterministic');
  }
});

test('a rejected fetch keeps the visible build fallback and reports an error without invented data', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  const source = app.match(/async function loadData\(\) \{[\s\S]*?(?=\nfunction bindEvents\(\))/)?.[0];
  assert.ok(source);
  const element = () => ({ hidden: false, setAttribute() {} });
  const elements = Object.fromEntries(['loading', 'error', 'empty', 'board', 'resultsCount', 'peopleTotal', 'publicFallback'].map((key) => [key, element()]));
  const state = { raw: { stale: true } };
  const load = Function('elements', 'state', 'fetch', 'DATA_URL', 'setText', 'message', 'console', `${source}; return loadData;`)(
    elements, state, async () => { throw new Error('offline'); }, '/public.json', (node, value) => { node.text = value; }, (key) => key, { error() {} }
  );
  await load();
  assert.equal(elements.publicFallback.hidden, false);
  assert.equal(elements.loading.hidden, true);
  assert.equal(elements.error.hidden, false);
  assert.equal(elements.board.hidden, true);
  assert.equal(state.raw, null);
  const render = app.match(/function renderDirectory\(\) \{[\s\S]*?(?=\nfunction formatNumber\()/)?.[0];
  assert.ok(render.indexOf('elements.publicFallback.hidden = true') > render.indexOf('elements.board.replaceChildren(fragment)'));
  assert.doesNotMatch(app, /person-permalink|ลิงก์โปรไฟล์|Profile link/);
  assert.match(app, /shell\.append\(button, detail\)/);
});
