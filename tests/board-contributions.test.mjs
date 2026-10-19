import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { applyBoardContributions } from '../tools/board-contributions.mjs';
import { applyCitymeterAttribution } from '../tools/citymeter-attribution.mjs';

const read = (name) => JSON.parse(fs.readFileSync(new URL('../'+name, import.meta.url), 'utf8'));
const approval = read('data/approved/board-contributions-2026-10-19.json');
const current = read('data/generated/site-data.json');
function baseline() {
  const before = structuredClone(current);
  before.contributions = before.contributions.filter(row => !approval.contributions.some(({record}) => record.contributionId === row.contributionId)).map(({summary,...row}) => row);
  before.works = before.works.filter(row => row.workId !== approval.work.workId);
  before.meta.counts.works = before.works.length;
  before.meta.counts.contributions = before.contributions.length;
  return before;
}
test('completed-task update adds exact credits and descriptions, preserves every prior core record and is idempotent', () => {
  const before=baseline(), frozen=structuredClone(before);
  const result=applyBoardContributions(before,approval);
  assert.deepEqual(before,frozen);
  assert.deepEqual(applyBoardContributions(result,approval),result);
  assert.equal(result.works.length,70);
  assert.equal(result.contributions.length,135);
  for(const row of before.contributions) {
    const {summary,...after}=result.contributions.find(item=>item.contributionId===row.contributionId);
    assert.deepEqual(after,row);
  }
  for(const key of Object.keys(before).filter(key=>!['meta','works','contributions'].includes(key))) assert.deepEqual(result[key],before[key]);
  assert.deepEqual(result.works.slice(0,before.works.length),before.works);
  for(const id of ['C0071','C0086','C0130']) assert.deepEqual(result.contributions.find(row=>row.contributionId===id),before.contributions.find(row=>row.contributionId===id));
  for(const item of approval.contributions) assert.deepEqual(result.contributions.find(row=>row.contributionId===item.record.contributionId),item.record);
});
test('descriptions contain only approved completed-task scope without excluded language or invented outcomes', () => {
  const descriptions=[...approval.summaries.map(row=>row.summary),...approval.contributions.map(row=>row.record.summary)];
  assert.equal(descriptions.length,13);
  for(const value of descriptions) {
    assert.ok(value.th.trim()&&value.en.trim());
    assert.doesNotMatch(JSON.stringify(value),/Fuel\s*Now|5\s*(บัญชี|accounts)|ผู้มุ่งหวัง|lead developer|sole author|accuracy|revenue/i);
  }
  const included=new Set([...approval.summaries,...approval.contributions].flatMap(row=>row.completedTaskRefs));
  for(const id of ['BL-180','BL-182','BL-203','BL-213','BL-220','BL-221','BL-222','BL-224','BL-227','BL-228','BL-238','BL-240','BL-242','BL-243','BL-245','BL-250','BL-251']) assert.equal(included.has(id),false,id);
});
for(const [name,mutate] of [
  ['identity drift',(_data,contract)=>{contract.contributions[0].record.personId='I0030';}],
  ['changed predecessor',(data)=>{data.contributions.find(row=>row.contributionId==='C0081').role.en='Lead';}],
  ['changed protected credit',(data)=>{data.contributions.find(row=>row.contributionId==='C0071').period.label='2026';}],
  ['invented date',(_data,contract)=>{contract.contributions[0].record.period.start='2026-10-19';}],
  ['unapproved destination',(_data,contract)=>{contract.work.destinationUrl='https://example.com';}],
  ['duplicate pair',(data)=>{data.contributions.push({...approval.contributions[0].record,contributionId:'C0999'});}],
  ['wrong engagement',(_data,contract)=>{contract.contributions[0].record.engagementId='E0040';}]
]) test('Board update rejects '+name+' without mutating the input',()=>{
  const data=baseline(),contract=structuredClone(approval);mutate(data,contract);const frozen=structuredClone(data);
  assert.throws(()=>applyBoardContributions(data,contract));assert.deepEqual(data,frozen);
});
test('older attribution contract retains independently approved summaries but still rejects altered core',()=>{
  const result=applyBoardContributions(baseline(),approval);
  const old=read('data/approved/citymeter-attribution-2026-10-10.json');
  assert.deepEqual(applyCitymeterAttribution(result,old),result);
  result.contributions.find(row=>row.contributionId==='C0125').evidenceStatus='owner_detail_required';
  assert.throws(()=>applyCitymeterAttribution(result,old),/differs from approved attribution/);
});
