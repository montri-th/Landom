import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { importNormalizedSheetSnapshot, sheetRows } from '../tools/normalized-sheet-roundtrip.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'data/generated/site-data.json'), 'utf8'));
const reviewed = baseline.people.find((person) => person.personId === 'S0002');
const rows = (records) => {
  const headers = [...new Set(records.flatMap((row) => Object.keys(row)))];
  return { headers, rows: records.map((row) => headers.map((header) => row[header] ?? '')) };
};

function privateSnapshot() {
  return {
    tabs: {
      people_registry: rows([{
        person_id: 'S0002', migration_classification: reviewed.migrationClassification,
        current_statement_id: 'STAT-S0002-002', consent_public: 'granted',
        bio_status: 'owner_approved', bio_verification_status: 'owner_approved'
      }]),
      profile_statements: rows([
        { statement_id: 'STAT-S0002-001', person_id: 'S0002', text_th: 'Historical private fixture',
          source_type: 'first_person_application', source_ref: 'https://mail.google.com/mail/u/0/#all/private-history-fixture', consent_status: 'pending' },
        { statement_id: 'STAT-S0002-002', person_id: 'S0002', text_th: reviewed.bio.th, text_en: '',
          source_type: 'owner_supplied_copy', source_ref: 'https://mail.google.com/mail/u/0/#all/private-current-fixture',
          publication_basis: 'individual_consent_profile_copy', source_basis: 'participant_supplied_profile_copy',
          publication_status: 'owner_approved', person_review_status: 'owner_approved',
          supersedes_statement_id: 'STAT-S0002-001', reviewed_at: '2026-10-06' }
      ]),
      social_profiles: rows([{ social_profile_id: 'SOC-S0002-LINKEDIN', person_id: 'S0002', platform: 'linkedin' }]),
      assets: rows([{ asset_id: 'PORTRAIT-S0002', person_id: 'S0002',
        source_url: 'https://private.example/private-portrait-fixture.jpg', permission_record_id: 'gmail_message:private-permission-fixture' }])
    }
  };
}

test('reviewed participant copy uses bounded public provenance while private history and new text remain protected', () => {
  const snapshot = privateSnapshot();
  const imported = importNormalizedSheetSnapshot(snapshot, baseline);
  assert.deepEqual(imported.people[0].bio, reviewed.bio);
  const serialized = JSON.stringify(imported);
  assert.doesNotMatch(serialized, /private-(?:history|current|portrait|permission)-fixture|mail\.google\.com|gmail_message:/);
  assert.equal(imported.assets[0].sourceUrl, null);
  assert.ok(!Object.hasOwn(imported.assets[0], 'permission_record_id'));

  for (const [field, value] of [['text_th', 'An unreviewed replacement'], ['statement_id', 'STAT-S0002-003']]) {
    const changed = privateSnapshot();
    const tab = changed.tabs.profile_statements;
    tab.rows[1][tab.headers.indexOf(field)] = value;
    if (field === 'statement_id') {
      const people = changed.tabs.people_registry;
      people.rows[0][people.headers.indexOf('current_statement_id')] = value;
    }
    assert.throws(() => importNormalizedSheetSnapshot(changed, baseline), /source_ref must be a bounded public-safe reference/);
  }
});

test('Sheet exporter retains superseded private history and emits a Thai-only current participant statement', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'landom-participant-copy-'));
  try {
    const snapshotPath = path.join(temporary, 'snapshot.json');
    fs.writeFileSync(snapshotPath, JSON.stringify(privateSnapshot()), { mode: 0o600 });
    const workbook = JSON.parse(execFileSync(process.execPath,
      [path.join(root, 'tools/export-sheet-tabs.mjs'), '--snapshot', snapshotPath], { cwd: root, encoding: 'utf8' }));
    const statements = sheetRows(workbook, 'profile_statements');
    const current = statements.find((row) => row.statement_id === 'STAT-S0002-002');
    const historical = statements.find((row) => row.statement_id === 'STAT-S0002-001');
    assert.equal(statements.length, 53);
    assert.equal(current.text_th, reviewed.bio.th);
    assert.equal(current.text_en, '');
    assert.equal(current.source_language, 'th');
    assert.equal(current.source_ref, reviewed.bio.sourceRef);
    assert.equal(current.supersedes_statement_id, historical.statement_id);
    assert.equal(current.owner_approval_status, '');
    assert.equal(historical.source_ref, 'https://mail.google.com/mail/u/0/#all/private-history-fixture');
    assert.equal(historical.consent_status, 'pending');
    assert.equal(sheetRows(workbook, 'people_registry').find((row) => row.person_id === 'S0002').current_statement_id, current.statement_id);
    assert.equal(sheetRows(workbook, 'qa').find((row) => row.metric === 'profile_statements').expected, statements.length);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
