// Exact approved identity facts only. This layer cannot grant publication or media consent.
const fields = { fullNameTh: ['full', 'th'], fullNameEn: ['full', 'en'], nicknameTh: ['nickname', 'th'], nicknameEn: ['nickname', 'en'] };
const allowed = new Set(['personId', ...Object.keys(fields), 'expectedThaiFullName', 'verificationStatus', 'evidenceBasis', 'sourceRef', 'reviewedAt']);
const statuses = new Set(['owner_confirmed', 'sheet_exact', 'verified_exact_linkedin_profile']);
export function applyPersonIdentityOverrides(siteData, contract) {
  if (contract?.contractVersion !== '1.0' || !contract.sourceBoundary || !Array.isArray(contract.overrides)) throw Error('Invalid person-identity override contract.');
  const result = structuredClone(siteData);
  const byId = new Map(result.people.map((person) => [person.personId, person]));
  const seen = new Set();
  for (const override of contract.overrides) {
    if (Object.keys(override).some((key) => !allowed.has(key))) throw Error('Unknown person-identity override field.');
    if (seen.has(override.personId)) throw Error('Duplicate person-identity override: ' + override.personId);
    seen.add(override.personId);
    const person = byId.get(override.personId);
    if (!person) throw Error('Unknown person in identity override: ' + override.personId);
    if (override.expectedThaiFullName && person.names.full.th !== override.expectedThaiFullName) throw Error('Identity match guard failed: ' + override.personId);
    if (!statuses.has(override.verificationStatus) || !override.evidenceBasis?.trim() || !override.sourceRef?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(override.reviewedAt ?? '')) throw Error('Incomplete person-identity evidence: ' + override.personId);
    const changes = Object.keys(fields).filter((key) => Object.hasOwn(override, key));
    if (!changes.length) throw Error('Person-identity override has no governed name.');
    for (const key of changes) {
      const value = override[key];
      const [field, language] = fields[key];
      if (typeof value !== 'string' || !value.trim() || (language === 'en' ? (!/[A-Za-z]/.test(value) || /[ก-๙]/.test(value)) : !/[ก-๙]/.test(value))) throw Error('Invalid exact identity text: ' + key);
      person.names[field][language] = value.trim();
      if (field === 'nickname') person.names.card[language] = value.trim();
    }
  }
  return result;
}
