import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const core = ({ summary, ...record }) => record;
const summaries = ['C0051', 'C0081', 'C0083', 'C0121', 'C0122', 'C0123', 'C0125', 'C0126'];
const additions = [
  ['C0131', 'I0039', 'work-citymeter-rugon', 'E0049'],
  ['C0132', 'I0030', 'work-citymeter-population', 'E0040'],
  ['C0133', 'I0030', 'work-citymeter-schools', 'E0040'],
  ['C0134', 'I0030', 'work-dwr-telemetry', 'E0040'],
  ['C0135', 'I0036', 'work-citymeter-yolk', 'E0046']
];
function unique(rows, key) {
  const map = new Map(rows.map(row => [row[key], row]));
  if (map.size !== rows.length) throw new Error('Duplicate Board update identity: ' + key);
  return map;
}
function validSummary(value) {
  return value && Object.keys(value).sort().join(',') === 'en,th' && ['th', 'en'].every(lang => typeof value[lang] === 'string' && value[lang].trim() && value[lang].length <= 500);
}
function taskRefs(value) {
  return Array.isArray(value) && value.length && new Set(value).size === value.length && value.every(id => /^BL-\d+$/.test(id));
}

/** A scoped owner-approved addition after the earlier identity contracts. Only
 * optional public summaries may extend previous credits; their core is frozen. */
export function applyBoardContributions(siteData, approval) {
  if (approval?.contractVersion !== '1.0' || approval.reviewedAt !== '2026-10-19' || approval.scope !== 'owner_approved_completed_task_contributions_only' || approval.sourceRef !== 'owner_instruction_2026-10-19_board_contributions' || !isDeepStrictEqual(approval.summaries?.map(row => row.contributionId), summaries) || !isDeepStrictEqual(approval.contributions?.map(({record}) => [record.contributionId, record.personId, record.workId, record.engagementId]), additions)) throw new Error('Invalid approved Board contribution scope.');
  const result = structuredClone(siteData);
  const people = unique(result.people, 'personId');
  const works = unique(result.works, 'workId');
  const credits = unique(result.contributions, 'contributionId');
  const engagements = unique(result.engagements, 'engagementId');
  if (!isDeepStrictEqual(approval.preservedContributions?.map(row => row.contributionId), ['C0071', 'C0086', 'C0130'])) throw new Error('Missing preserved Locale Insight credits.');
  for (const frozen of approval.preservedContributions) if (digest(credits.get(frozen.contributionId)) !== frozen.sha256) throw new Error('Preserved Locale Insight credit changed: ' + frozen.contributionId);
  const work = approval.work;
  if (work?.workId !== 'work-citymeter-yolk' || work.parentProduct !== 'CityMETER' || work.scopeLayer !== 'product_specific' || work.moduleSlug !== null || work.destinationUrl !== null || work.catalogUrl?.th !== null || work.catalogUrl?.en !== null || work.linkEvidence?.linkScope !== 'unverified_no_link') throw new Error('Board Yolk work exceeds approved product boundary.');
  if (works.has(work.workId) && !isDeepStrictEqual(works.get(work.workId), work)) throw new Error('Existing Yolk work differs from approval.');
  if (!works.has(work.workId)) { result.works.push(structuredClone(work)); works.set(work.workId, work); }
  for (const item of approval.summaries) {
    const current = credits.get(item.contributionId);
    if (!current || current.personId !== item.personId || digest(core(current)) !== item.expectedCoreSha256 || !validSummary(item.summary) || !taskRefs(item.completedTaskRefs)) throw new Error('Board summary differs from reviewed predecessor: ' + item.contributionId);
    if (current.summary && !isDeepStrictEqual(current.summary, item.summary)) throw new Error('Existing Board summary differs from approval.');
    current.summary = structuredClone(item.summary);
  }
  for (const item of approval.contributions) {
    const record = item.record;
    if (!people.has(record.personId) || !works.has(record.workId) || engagements.get(record.engagementId)?.personId !== record.personId || record.sourceRef !== approval.sourceRef || record.evidenceStatus !== 'owner_supplied' || !isDeepStrictEqual(record.role, {th:'Software development',en:'Software development'}) || !isDeepStrictEqual(record.period, {start:null,end:null,label:null}) || !validSummary(record.summary) || !taskRefs(item.completedTaskRefs)) throw new Error('Invalid completed-task Board credit: ' + record.contributionId);
    if (result.contributions.some(row => row.personId === record.personId && row.workId === record.workId && row.contributionId !== record.contributionId)) throw new Error('Duplicate Board person/work credit.');
    if (credits.has(record.contributionId) && !isDeepStrictEqual(credits.get(record.contributionId), record)) throw new Error('Existing Board credit differs from approval.');
    if (!credits.has(record.contributionId)) { const added=structuredClone(record); result.contributions.push(added); credits.set(added.contributionId, added); }
  }
  result.meta.counts.works = result.works.length;
  result.meta.counts.contributions = result.contributions.length;
  return result;
}
