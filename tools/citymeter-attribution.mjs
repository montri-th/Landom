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
    if (current && !isDeepStrictEqual(current, contribution)) throw new Error('Existing contribution differs from approved attribution: ' + contribution.contributionId);
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
