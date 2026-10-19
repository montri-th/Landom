import { isDeepStrictEqual } from 'node:util';
import { createHash } from 'node:crypto';

const SCOPE = 'owner_confirmed_citymeter_attribution_identity_only';
const CATALOG_ROOT = 'https://montri-th.github.io/CityMETER/';
const PROJECTION_URL = 'https://montri-th.github.io/Landom/data/generated/citymeter-contributors.json';
const PUBLIC_LANGUAGES = ['th', 'en'];
const HIDDEN_MODULES = new Set(['dataset-business-dynamics']);
const EXISTING_BINDING_IDENTITIES = Object.freeze({
  'CMRW-0039': ['work-citymeter-nonbank', 'C0124', 'I0030', 'dataset-non-bank', 'nonBank'],
  'CMRW-0040': ['work-citymeter-religious-places-unresolved', 'C0122', 'I0045', 'dataset-places-of-worship', 'placeOfWorship']
});
const BINDING_FIELDS = ['moduleSlug', 'type', 'authorityStatus', 'evidenceNote', 'catalogUrl', 'destinationUrl', 'linkEvidence'];

const bindingState = (work) => Object.fromEntries(BINDING_FIELDS.map((field) => [field, work[field]]));
const contributionCore = ({ summary, ...record }) => record;

/** Owner-confirmed continuation of one existing module. Retain both Ing's
 * original module credit and Earth's distinct shared-layer credit unchanged. */
export function applyLocaleInsightContinuation(siteData, contract) {
  strictObject(contract, ['contractVersion', 'reviewedAt', 'scope', 'sourceRef', 'workId', 'moduleSlug', 'expectedWorkSha256', 'preservedContributions', 'contribution'], 'Locale Insight continuation');
  const item = contract.contribution;
  strictObject(item, ['contributionId', 'personId', 'workId', 'predecessorContributionId', 'role'], 'Locale Insight credit');
  strictObject(item.role, ['th', 'en'], 'Locale Insight role');
  if (contract.contractVersion !== '1.0' || contract.scope !== 'owner_confirmed_locale_insight_continuation_only' || !/^\d{4}-\d{2}-\d{2}$/.test(contract.reviewedAt) || contract.sourceRef !== 'owner_instruction_2026-10-11_locale_insight_continuation' || contract.workId !== 'work-citymeter-locale-insights' || contract.moduleSlug !== 'dataset-locale-insights' || item.contributionId !== 'C0130' || item.personId !== 'I0034' || item.workId !== contract.workId || item.predecessorContributionId !== 'C0071' || !isDeepStrictEqual(item.role, { th: 'พัฒนาต่อ', en: 'Continued development' })) throw new Error('Unapproved Locale Insight continuation identity or role.');
  const result = structuredClone(siteData);
  const people = unique(result.people, 'personId', 'person');
  const works = unique(result.works, 'workId', 'work');
  const credits = unique(result.contributions, 'contributionId', 'contribution');
  if (people.get('I0034')?.names.full.th !== 'ไอศูรย์ ทิพย์ธนทรัพย์' || people.get('I0011')?.names.full.th !== 'อิงครัตน์ รัตนโอภา') throw new Error('Locale Insight requires the exact reviewed Earth and Ing identities.');
  const digest = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
  const work = works.get(contract.workId);
  if (!work || work.moduleSlug !== contract.moduleSlug || work.parentProduct !== 'CityMETER' || work.scopeLayer !== 'product_specific' || !/^[a-f0-9]{64}$/.test(contract.expectedWorkSha256) || digest(work) !== contract.expectedWorkSha256 || result.works.some((other) => other.workId !== work.workId && other.moduleSlug === work.moduleSlug)) throw new Error('Locale Insight work differs from the reviewed module.');
  if (!Array.isArray(contract.preservedContributions) || !isDeepStrictEqual(contract.preservedContributions.map((row) => row.contributionId), ['C0071', 'C0086'])) throw new Error('Locale Insight must preserve both existing credits.');
  for (const expected of contract.preservedContributions) {
    strictObject(expected, ['contributionId', 'sha256'], 'Preserved Locale Insight credit');
    const credit = credits.get(expected.contributionId);
    if (!credit || !/^[a-f0-9]{64}$/.test(expected.sha256) || digest(credit) !== expected.sha256) throw new Error('Existing Locale Insight credit differs from reviewed evidence.');
  }
  if (credits.get('C0071').personId !== 'I0011' || credits.get('C0071').workId !== work.workId || credits.get('C0086').personId !== 'I0034' || credits.get('C0086').workId !== 'work-locale-insight-intelligence-layer') throw new Error('Existing Locale Insight credit identity mismatch.');
  const contribution = {
    contributionId: item.contributionId, personId: item.personId, workId: item.workId,
    engagementId: null, role: structuredClone(item.role),
    period: { start: null, end: null, label: null }, evidenceStatus: 'owner_supplied',
    sourceRef: contract.sourceRef,
    evidenceNote: 'The owner confirms Earth continues Ing\'s Locale Insight work. Ing\'s original module credit and Earth\'s separate shared-layer credit are retained. No contribution date, version, engagement, leadership or completion is inferred.'
  };
  if (result.contributions.some((row) => row.personId === item.personId && row.workId === item.workId && row.contributionId !== item.contributionId)) throw new Error('Locale Insight person/work already has another contribution ID.');
  const current = credits.get(item.contributionId);
  if (current && !isDeepStrictEqual(current, contribution)) throw new Error('Existing Locale Insight continuation differs from approval.');
  if (!current) result.contributions.push(contribution);
  result.meta.counts.contributions = result.contributions.length;
  return result;
}

/** Bind two existing, owner-confirmed contributions to the now-published public
 * catalog. This is a routing/identity amendment, never a person or work-status
 * inference. Exact reviewed predecessor states and idempotent final state only. */
export function applyExistingCitymeterBindings(siteData, contract) {
  strictObject(contract, ['contractVersion', 'reviewedAt', 'scope', 'sourceRef', 'sourceCatalog', 'bindings'], 'Existing CityMETER bindings');
  strictObject(contract.sourceCatalog, ['url', 'gitCommit', 'sourceSha256'], 'Public catalog evidence');
  if (contract.contractVersion !== '1.0' || contract.scope !== 'existing_work_catalog_identity_only' || !/^\d{4}-\d{2}-\d{2}$/.test(contract.reviewedAt) || !/^[a-z0-9_-]+$/.test(contract.sourceRef) || contract.sourceCatalog.url !== `${CATALOG_ROOT}data/catalog.json` || !/^[a-f0-9]{40}$/.test(contract.sourceCatalog.gitCommit) || !/^[a-f0-9]{64}$/.test(contract.sourceCatalog.sourceSha256) || !Array.isArray(contract.bindings) || contract.bindings.length !== 2) throw new Error('Invalid existing-work binding contract.');
  const result = structuredClone(siteData);
  const works = unique(result.works, 'workId', 'work');
  const credits = unique(result.contributions, 'contributionId', 'contribution');
  unique(contract.bindings, 'mappingId', 'binding');
  for (const item of contract.bindings) {
    strictObject(item, ['mappingId', 'workId', 'contributionId', 'personId', 'moduleSlug', 'datasetCode', 'previousPublicState', 'previousSheetStateSha256', 'nextState'], 'Existing binding');
    if (!isDeepStrictEqual(EXISTING_BINDING_IDENTITIES[item.mappingId], [item.workId, item.contributionId, item.personId, item.moduleSlug, item.datasetCode])) throw new Error('Unapproved existing-work binding identity.');
    const work = works.get(item.workId);
    const credit = credits.get(item.contributionId);
    if (!work || work.parentProduct !== 'CityMETER' || work.scopeLayer !== 'product_specific' || credit?.workId !== item.workId || credit?.personId !== item.personId || !result.people.some((person) => person.personId === item.personId)) throw new Error('Existing binding requires the confirmed work, contribution and person.');
    if (result.works.some((other) => other.workId !== item.workId && other.moduleSlug === item.moduleSlug)) throw new Error('Binding module already belongs to another work.');
    if (!/^[a-f0-9]{64}$/.test(item.previousSheetStateSha256)) throw new Error('Binding requires the reviewed Sheet predecessor digest.');
    for (const state of [item.previousPublicState, item.nextState]) {
      strictObject(state, BINDING_FIELDS, 'Binding state');
      strictObject(state.catalogUrl, ['th', 'en'], 'Binding catalog links');
      strictObject(state.linkEvidence, ['linkScope', 'sourceRef', 'evidenceUrl'], 'Binding link evidence');
    }
    const slug = item.moduleSlug.slice('dataset-'.length);
    const expectedLinks = { th: `${CATALOG_ROOT}datasets/${slug}/`, en: `${CATALOG_ROOT}en/datasets/${slug}/` };
    const next = item.nextState;
    if (next.moduleSlug !== item.moduleSlug || next.type !== 'canonical_module' || next.authorityStatus !== 'owner_confirmed_catalog_binding_identity_only' || typeof next.evidenceNote !== 'string' || !next.evidenceNote || !isDeepStrictEqual(next.catalogUrl, expectedLinks) || next.destinationUrl !== `https://landometer.com/v3/citymeter?d=${item.datasetCode}` || !isDeepStrictEqual(next.linkEvidence, { linkScope: 'exact_module', sourceRef: contract.sourceRef, evidenceUrl: expectedLinks.th })) throw new Error('Existing binding changes fields outside the approved catalog identity.');
    const current = bindingState(work);
    const sheetDigest = createHash('sha256').update(JSON.stringify(current)).digest('hex');
    if (![item.previousPublicState, next].some((state) => isDeepStrictEqual(current, state)) && sheetDigest !== item.previousSheetStateSha256) throw new Error('Existing work differs from reviewed binding states: ' + item.workId);
    Object.assign(work, structuredClone(next));
  }
  return result;
}

function strictObject(value, fields, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(label + ' must be an object.');
  if (Object.keys(value).some((key) => !fields.includes(key)) || fields.some((key) => !(key in value))) throw new Error(label + ' has missing or unsupported fields.');
}

function unique(rows, field, label) {
  const result = new Map();
  for (const row of rows) {
    if (result.has(row[field])) throw new Error('Duplicate ' + label + ': ' + row[field]);
    result.set(row[field], row);
  }
  return result;
}

/** Add a reviewed public attribution amendment; never edit a person's facts or
 * publication state. The input is this repo's public graph, not a private API.
 * Existing exact rows are idempotent. Drift requires a new reviewed decision. */
export function applyCitymeterAttribution(siteData, contract) {
  strictObject(contract, ['contractVersion', 'reviewedAt', 'scope', 'sourceRef', 'routeCorrections', 'works', 'contributions'], 'CityMETER attribution');
  if (contract.contractVersion !== '1.0' || contract.scope !== SCOPE || !/^\d{4}-\d{2}-\d{2}$/.test(contract.reviewedAt) || typeof contract.sourceRef !== 'string' || !/^[a-z0-9_-]+$/.test(contract.sourceRef) || !Array.isArray(contract.works) || !Array.isArray(contract.contributions)) throw new Error('Invalid CityMETER attribution contract.');
  const result = structuredClone(siteData);
  if (!Array.isArray(result.people) || !Array.isArray(result.works) || !Array.isArray(result.contributions)) throw new Error('Reviewed public graph is incomplete.');
  const people = unique(result.people, 'personId', 'person');
  const works = unique(result.works, 'workId', 'work');
  const contributions = unique(result.contributions, 'contributionId', 'contribution');
  if (!Array.isArray(contract.routeCorrections)) throw new Error('Invalid historical route corrections.');
  unique(contract.routeCorrections, 'workId', 'historical route correction');
  for (const item of contract.routeCorrections) {
    strictObject(item, ['workId', 'previousCatalogUrl', 'previousDestinationUrl', 'previousLinkEvidence', 'destinationUrl', 'linkScope'], 'Historical route correction');
    strictObject(item.previousCatalogUrl, ['th', 'en'], 'Previous catalog links');
    strictObject(item.previousLinkEvidence, ['linkScope', 'sourceRef', 'evidenceUrl'], 'Previous link evidence');
    const work = works.get(item.workId);
    if (item.workId !== 'work-citymeter-business-dynamics' || work?.moduleSlug !== 'dataset-business-dynamics' || item.destinationUrl !== 'https://landometer.com/v3/citymeter?d=businessDynamics' || item.linkScope !== 'historical_direct_route') throw new Error('Unapproved historical route identity.');
    const current = { catalogUrl: work.catalogUrl, destinationUrl: work.destinationUrl, linkEvidence: work.linkEvidence };
    const previous = { catalogUrl: item.previousCatalogUrl, destinationUrl: item.previousDestinationUrl, linkEvidence: item.previousLinkEvidence };
    const corrected = { catalogUrl: { th: null, en: null }, destinationUrl: item.destinationUrl, linkEvidence: { linkScope: item.linkScope, sourceRef: contract.sourceRef, evidenceUrl: null } };
    if (!isDeepStrictEqual(current, previous) && !isDeepStrictEqual(current, corrected)) throw new Error('Existing historical work route differs from approved correction.');
    Object.assign(work, corrected);
  }
  const approvedWorks = unique(contract.works, 'workId', 'approved work');
  unique(contract.works, 'moduleSlug', 'approved module');
  unique(contract.contributions, 'contributionId', 'approved contribution');
  for (const item of contract.works) {
    strictObject(item, ['workId', 'moduleSlug', 'name', 'destinationUrl'], 'Approved work');
    if (!/^work-citymeter-[a-z0-9-]+$/.test(item.workId) || !/^dataset-[a-z0-9-]+$/.test(item.moduleSlug) || HIDDEN_MODULES.has(item.moduleSlug) || typeof item.name !== 'string' || !item.name.startsWith('CityMETER: ') || !/^https:\/\/landometer\.com\/v3\/citymeter(?:-3d)?\?d=[a-zA-Z0-9-]+$/.test(item.destinationUrl)) throw new Error('Invalid approved work identity or destination.');
    if (result.works.some((work) => work.moduleSlug === item.moduleSlug && work.workId !== item.workId)) throw new Error('Module already belongs to another work: ' + item.moduleSlug);
    const slug = item.moduleSlug.slice('dataset-'.length);
    const work = {
      workId: item.workId, parentProduct: 'CityMETER', moduleSlug: item.moduleSlug,
      names: { th: item.name, en: item.name }, shortNames: { th: item.name, en: item.name },
      type: 'canonical_module', scopeLayer: 'product_specific', authorityStatus: 'owner_confirmed_attribution_identity_only',
      evidenceNote: 'Owner confirmed contributor identity for this dataset. Dates, leadership, completion, source ownership and data rights are not established by this attribution.',
      sourceAliases: [item.name],
      catalogUrl: { th: `${CATALOG_ROOT}datasets/${slug}/`, en: `${CATALOG_ROOT}en/datasets/${slug}/` },
      destinationUrl: item.destinationUrl,
      linkEvidence: { linkScope: 'exact_module', sourceRef: contract.sourceRef, evidenceUrl: null }
    };
    const current = works.get(work.workId);
    if (current && !isDeepStrictEqual(current, work)) throw new Error('Existing work differs from approved attribution: ' + work.workId);
    if (!current) { result.works.push(work); works.set(work.workId, work); }
  }
  const pairs = new Set();
  for (const item of contract.contributions) {
    strictObject(item, ['contributionId', 'personId', 'workId'], 'Approved contribution');
    if (!/^C\d{4}$/.test(item.contributionId) || !/^[SPI]\d{4}$/.test(item.personId) || !people.has(item.personId) || !approvedWorks.has(item.workId)) throw new Error('Unknown or invalid contribution identity.');
    const pair = `${item.personId}:${item.workId}`;
    if (pairs.has(pair)) throw new Error('Duplicate approved person/work pair.');
    pairs.add(pair);
    if (result.contributions.some((row) => row.personId === item.personId && row.workId === item.workId && row.contributionId !== item.contributionId)) throw new Error('Person/work already has another contribution ID.');
    const contribution = {
      contributionId: item.contributionId, personId: item.personId, workId: item.workId,
      engagementId: null, role: { th: 'ร่วมพัฒนา', en: 'Contributor' },
      period: { start: null, end: null, label: null }, evidenceStatus: 'owner_and_sheet_confirmed',
      sourceRef: contract.sourceRef,
      evidenceNote: 'Generic contribution confirmed by the owner. No engagement, contribution dates, lead role or completion is inferred.'
    };
    const current = contributions.get(contribution.contributionId);
    if (current && !isDeepStrictEqual(contributionCore(current), contribution)) throw new Error('Existing contribution differs from approved attribution: ' + contribution.contributionId);
    if (!current) { result.contributions.push(contribution); contributions.set(contribution.contributionId, contribution); }
  }
  result.meta.counts.works = result.works.length;
  result.meta.counts.contributions = result.contributions.length;
  return result;
}

const localized = (value) => Object.fromEntries(PUBLIC_LANGUAGES.map((language) => [language, typeof value?.[language] === 'string' ? value[language] : null]));

/** Eight retained legacy works already have approved exact-module catalog
 * anchors but a null moduleSlug. Reuse those explicit links; never infer a
 * mapping from a work's name or promote a candidate with no approved route. */
export function publicCitymeterModule(work) {
  if (/^dataset-[a-z0-9-]+$/.test(work.moduleSlug ?? '')) return HIDDEN_MODULES.has(work.moduleSlug) ? null : work.moduleSlug;
  if (work.linkEvidence?.linkScope !== 'exact_module') return null;
  try {
    const th = new URL(work.catalogUrl.th);
    const en = new URL(work.catalogUrl.en);
    const slug = th.hash.slice(1);
    if (th.origin !== 'https://montri-th.github.io' || en.origin !== th.origin || th.pathname !== '/CityMETER/' || en.pathname !== '/CityMETER/en/' || en.hash !== th.hash || !/^dataset-[a-z0-9-]+$/.test(slug) || HIDDEN_MODULES.has(slug)) return null;
    return slug;
  } catch { return null; }
}

/** Narrow card-only projection of the already approved public registry and
 * governed public media. No contacts, evidence notes, consent fields, raw Sheet
 * rows, source links or internal import receipts enter this interface. */
export function buildCitymeterContributors(siteData, peopleMedia) {
  const people = new Map(siteData.people.map((person) => [person.personId, person]));
  const media = new Map(peopleMedia.people.map((person) => [person.personId, person]));
  const byModuleSlug = {};
  for (const work of siteData.works) {
    if (HIDDEN_MODULES.has(work.moduleSlug) && Object.values(work.catalogUrl || {}).some(Boolean)) throw new Error('Hidden historical work must not link to the public CityMETER catalog.');
    const moduleSlug = publicCitymeterModule(work);
    if (!moduleSlug) continue;
    const rows = [];
    const seen = new Set();
    for (const credit of siteData.contributions.filter((row) => row.workId === work.workId)) {
      const person = people.get(credit.personId);
      const publicMedia = media.get(credit.personId);
      if (!person || !publicMedia || seen.has(person.personId)) continue;
      seen.add(person.personId);
      const portrait = publicMedia.portrait?.status === 'publishable' ? publicMedia.portrait : null;
      rows.push({
        personId: person.personId,
        nickname: localized(person.names.nickname),
        contributionRole: credit.role ? localized(credit.role) : null,
        profileUrl: localized(publicMedia.profileUrl),
        portrait: portrait ? { url: portrait.url, versionedUrl: portrait.versionedUrl, alt: localized(portrait.alt) } : null
      });
    }
    if (rows.length) byModuleSlug[moduleSlug] = rows;
  }
  return { schemaVersion: '1.0.0', generatedAt: siteData.meta.generatedAt, canonicalUrl: PROJECTION_URL, byModuleSlug };
}
