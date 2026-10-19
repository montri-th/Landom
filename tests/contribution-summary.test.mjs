import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { contributionSummary, escapePublicHtml, publicDirectoryEntries, renderPublicDirectory } from '../src/public-directory.js';
import { importNormalizedSheetSnapshot, sheetRows } from '../tools/normalized-sheet-roundtrip.mjs';
import { validateDataContract } from '../tools/validate-site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const loadSite = () => JSON.parse(fs.readFileSync(path.join(root, 'data/generated/site-data.json'), 'utf8'));
const summary = { th: 'ร่วมพัฒนา <แผนที่> และกราฟ & ตาราง', en: 'Developed <maps> and charts & tables' };

test('public summaries use the requested language, fall back to available copy and remain absent for old records', () => {
  assert.equal(contributionSummary({ summary }, 'th'), summary.th);
  assert.equal(contributionSummary({ summary }, 'en'), summary.en);
  assert.equal(contributionSummary({ summary: { th: '  ', en: summary.en } }, 'th'), summary.en);
  assert.equal(contributionSummary({ summary: { th: summary.th, en: null } }, 'en'), summary.th);
  assert.equal(contributionSummary({}, 'en'), '');
  const data = {
    people: [{ personId: 'I0045', names: { card: { th: 'คิว', en: 'Q' } } }],
    works: [{ workId: 'work-test', names: { th: 'แผนที่', en: 'Map' } }],
    contributions: [{ personId: 'I0045', workId: 'work-test', summary, role: { th: 'พัฒนาซอฟต์แวร์', en: 'Software development' }, evidenceNote: 'PRIVATE_NOTE' }]
  };
  for (const locale of ['th', 'en']) {
    assert.equal(publicDirectoryEntries(data, locale)[0].contributions[0].summary, summary[locale]);
    const html = renderPublicDirectory(data, locale);
    assert.ok(html.includes(`<p class="contribution-summary">${escapePublicHtml(summary[locale])}</p>`));
    assert.doesNotMatch(html, /PRIVATE_NOTE|<maps>|<แผนที่>/);
  }
  delete data.contributions[0].summary;
  assert.doesNotMatch(renderPublicDirectory(data), /class="contribution-summary"/);
});

test('runtime contribution detail preserves role and period before escaped summary text', () => {
  const app = fs.readFileSync(path.join(root, 'src/app.js'), 'utf8');
  const renderer = app.match(/function contributionsMarkup\(model\) \{[\s\S]*?(?=\nfunction achievementsMarkup\()/)?.[0];
  assert.ok(renderer);
  const render = Function('escapeHtml', 'message', 'detailHeadingMarkup', 'localizedContributionName', 'externalLinkIconMarkup', `${renderer}; return contributionsMarkup;`)(
    escapePublicHtml, (key, parameters) => key === 'contributionRole' ? `Role: ${parameters.role}` : key,
    () => '<h3>Contributions</h3>', (item) => item.name, () => ''
  );
  const html = render({ id: 'I0045', contributions: [{ workId: 'work-test', name: 'Map', role: 'Software development', period: 'Oct 2026', summary: summary.en }] });
  assert.ok(html.includes('<p class="contribution-meta">Role: Software development · Oct 2026</p>'));
  assert.ok(html.includes(`<p class="contribution-summary">${escapePublicHtml(summary.en)}</p>`));
  assert.ok(html.indexOf('contribution-meta') < html.indexOf('contribution-summary'));
  assert.doesNotMatch(html, /<maps>/);
  assert.match(app, /summary: contributionSummary\(contribution, state\.language\)/);
});

test('summary copies survive reviewed source, generation and appended Sheet columns without changing legacy columns', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'landom-contribution-summary-'));
  try {
    const site = loadSite();
    const target = site.contributions.find((item) => item.contributionId === 'C0001');
    target.summary = summary;
    const reviewedPath = path.join(temporary, 'reviewed.json');
    const seedPath = path.join(temporary, 'seed.json');
    const firstDir = path.join(temporary, 'generated');
    const secondDir = path.join(temporary, 'roundtrip');
    fs.writeFileSync(reviewedPath, JSON.stringify(site));
    fs.writeFileSync(seedPath, JSON.stringify({ tabs: { people_registry: { headers: ['person_id'], rows: site.people.map((person) => [person.personId]) } } }));
    execFileSync(process.execPath, [path.join(root, 'tools/normalize-data.mjs'), '--reviewed-site-data', reviewedPath, '--output-dir', firstDir], { cwd: root });
    const generatedPath = path.join(firstDir, 'site-data.json');
    const generated = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
    assert.deepEqual(generated.contributions.find((item) => item.contributionId === target.contributionId).summary, summary);
    const workbook = JSON.parse(execFileSync(process.execPath, [path.join(root, 'tools/export-sheet-tabs.mjs'), 'contributions', '--site-data', generatedPath, '--snapshot', seedPath], { cwd: root, encoding: 'utf8' }));
    assert.deepEqual(workbook.tabs.contributions.headers, [
      'contribution_id', 'person_id', 'work_id', 'engagement_id', 'role_th', 'role_en', 'period_start', 'period_end', 'period_label', 'evidence_status', 'source_ref', 'evidence_note', 'summary_th', 'summary_en'
    ]);
    const row = sheetRows(workbook, 'contributions').find((item) => item.contribution_id === target.contributionId);
    assert.equal(row.summary_th, summary.th);
    assert.equal(row.summary_en, summary.en);
    for (const [key, value] of Object.entries({ person_id: target.personId, role_en: target.role.en, source_ref: target.sourceRef, evidence_note: target.evidenceNote ?? '' })) assert.equal(row[key], value);

    const fullWorkbook = JSON.parse(execFileSync(process.execPath, [path.join(root, 'tools/export-sheet-tabs.mjs'), '--site-data', generatedPath, '--snapshot', seedPath], { cwd: root, encoding: 'utf8' }));
    const imported = importNormalizedSheetSnapshot(fullWorkbook, generated);
    assert.deepEqual(imported.contributions.find((item) => item.contributionId === target.contributionId), target);
    const workbookPath = path.join(temporary, 'workbook.json');
    fs.writeFileSync(workbookPath, JSON.stringify(fullWorkbook));
    execFileSync(process.execPath, [path.join(root, 'tools/normalize-data.mjs'), '--input', workbookPath, '--output-dir', secondDir], { cwd: root });
    const roundtrip = JSON.parse(fs.readFileSync(path.join(secondDir, 'site-data.json'), 'utf8'));
    assert.deepEqual(roundtrip.contributions.find((item) => item.contributionId === target.contributionId), target);

    const legacyWorkbook = structuredClone(fullWorkbook);
    legacyWorkbook.tabs.contributions.headers = legacyWorkbook.tabs.contributions.headers.slice(0, 12);
    legacyWorkbook.tabs.contributions.rows = legacyWorkbook.tabs.contributions.rows.map((item) => item.slice(0, 12));
    assert.ok(importNormalizedSheetSnapshot(legacyWorkbook, generated).contributions.every((item) => !Object.hasOwn(item, 'summary')));
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test('optional summary contract rejects empty or extra public fields and accepts a single available locale', () => {
  const site = loadSite();
  const target = site.contributions.find((item) => item.contributionId === 'C0001');
  const errorsFor = (value) => {
    target.summary = value;
    return validateDataContract(site).filter((error) => /C0001 summary/.test(error));
  };
  assert.deepEqual(errorsFor({ th: summary.th, en: null }), []);
  for (const value of [null, '', { th: ' ', en: null }, { th: summary.th }, { th: summary.th, en: summary.en, privateNote: 'excluded' }]) assert.equal(errorsFor(value).length, 1);
});
