import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const workflow = read('.github/workflows/pages.yml');
// Execute the actual deployment assertion before merge, so a stale deployed
// count/denylist cannot pass the build simply because deploy is skipped on PRs.
const start = workflow.indexOf('if (credits.schemaVersion');
const end = workflow.indexOf('const manifest = JSON.parse', start);
assert.ok(start >= 0 && end > start, 'deployment credit assertion boundaries exist');
const validate = new Function('credits', 'data', 'html', 'english', workflow.slice(start, end));
const credits = JSON.parse(read('data/generated/citymeter-contributors.json'));
const data = JSON.parse(read('data/generated/site-data.json'));

test('actual post-deployment credit assertions accept the current public release', () => {
  validate(credits, data, '', '');
});

for (const [label, mutate] of [
  ['missing binding', (c) => { delete c.byModuleSlug['dataset-non-bank']; }],
  ['wrong person', (c) => { c.byModuleSlug['dataset-places-of-worship'][0].personId = 'I0030'; }],
  ['promoted role', (c) => { c.byModuleSlug['dataset-places-of-worship'][0].contributionRole.en = 'Lead'; }],
  ['wrong existing contribution', (_, d) => { d.contributions.find((row) => row.contributionId === 'C0124').personId = 'I0045'; }],
  ['hidden module replacing a public module', (c) => { delete c.byModuleSlug['dataset-buildings']; c.byModuleSlug['dataset-business-dynamics'] = []; }]
]) test('actual post-deployment assertions reject ' + label, () => {
  const c = structuredClone(credits); const d = structuredClone(data);
  mutate(c, d);
  assert.throws(() => validate(c, d, '', ''));
});
