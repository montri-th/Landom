function text(value) {
  return value == null ? '' : String(value).trim();
}

function nullable(value) {
  const normalized = text(value);
  return normalized || null;
}

function boolean(value) {
  if (typeof value === 'boolean') return value;
  return ['true', 'yes', '1'].includes(text(value).toLowerCase());
}

function split(value) {
  return text(value).split('|').map((item) => item.trim()).filter(Boolean);
}

function localized(th, en) {
  return { th: nullable(th), en: nullable(en) };
}

function safeProfileSourceRef(value, fallback = null) {
  const normalized = nullable(value) ?? fallback;
  if (normalized && /https?:\/\/|docs\.google\.com|(?:2025|2026)![A-Z]+\d+|[A-Z]+\d+:[A-Z]+\d+|@/i.test(normalized)) {
    throw new Error('Profile statement source_ref must be a bounded public-safe reference, not a URL, Sheet range, or contact value.');
  }
  return normalized;
}

export function sheetRows(snapshot, name) {
  const source = snapshot?.tabs?.[name] ?? snapshot?.sheets?.[name];
  if (!source) return [];
  if (Array.isArray(source)) {
    const [headers, ...rows] = source;
    if (!Array.isArray(headers)) return [];
    return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
  }
  if (Array.isArray(source.headers) && Array.isArray(source.rows)) {
    return source.rows.map((row) => Object.fromEntries(source.headers.map((header, index) => [header, row[index] ?? ''])));
  }
  return [];
}

export function isNormalizedSheetSnapshot(snapshot) {
  const people = sheetRows(snapshot, 'people_registry');
  return people.length > 0 && Object.hasOwn(people[0], 'migration_classification') &&
    sheetRows(snapshot, 'social_profiles').length > 0 && sheetRows(snapshot, 'assets').length > 0;
}

export function normalizedVerification(value, fallback = 'missing') {
  const normalized = text(value).toLowerCase();
  if (normalized === 'verified' || normalized === 'approved') return 'verified';
  if (normalized === 'rejected') return 'rejected';
  if (normalized === 'missing') return 'missing';
  if (['owner_review_required', 'evidence_present_owner_review_required', 'unverified', 'pending'].includes(normalized)) return 'owner_review_required';
  return fallback;
}

export function normalizedConsent(value) {
  const normalized = text(value).toLowerCase();
  if (['granted', 'approved', 'consented', 'yes', 'true'].includes(normalized)) return 'granted';
  if (['denied', 'revoked', 'no', 'false'].includes(normalized)) return 'denied';
  return 'pending';
}

export function normalizedRights(value) {
  const normalized = text(value).toLowerCase();
  if (['cleared', 'approved', 'licensed', 'owned', 'granted'].includes(normalized)) return 'cleared';
  if (normalized === 'denied') return 'denied';
  if (normalized === 'revoked') return 'revoked';
  return 'pending';
}

function ownerApprovalFromRow(row) {
  const status = text(row.owner_approval_status).toLowerCase();
  if (status !== 'granted') return null;
  return {
    status: 'granted',
    approvedAt: nullable(row.owner_approved_at),
    scope: nullable(row.owner_approval_scope),
    sourceRef: nullable(row.owner_approval_source_ref)
  };
}

function candidateStatus(value, hasCandidate, kind) {
  if (hasCandidate) return 'candidate_present';
  const normalized = text(value).toLowerCase();
  if (kind === 'asset' && normalized === 'source_needed') return 'source_needed';
  return kind === 'asset' ? 'source_needed' : 'candidate_missing';
}

function sourceMeta(snapshot, baseline) {
  return {
    ...baseline.meta.source,
    spreadsheetId: snapshot.spreadsheetId ?? snapshot.source?.spreadsheetId ?? baseline.meta.source.spreadsheetId,
    snapshotFetchedAt: snapshot.fetchedAt ?? snapshot.source?.fetchedAt ?? baseline.meta.source.snapshotFetchedAt,
    inputSchema: 'normalized_sheet_v3_4',
    publicSheetsUsed: ['people_registry', 'profile_statements', 'engagements', 'institutions', 'programs', 'education', 'works', 'contributions', 'achievements', 'person_achievements', 'external_publications', 'social_profiles', 'assets'],
    privateContactSourcesExcluded: true
  };
}

export function importNormalizedSheetSnapshot(snapshot, baseline) {
  if (!isNormalizedSheetSnapshot(snapshot)) throw new Error('Snapshot does not match normalized Sheet schema v3.');

  const basePeople = new Map(baseline.people.map((item) => [item.personId, item]));
  const baseInstitutions = new Map(baseline.institutions.map((item) => [item.institutionId, item]));
  const basePrograms = new Map(baseline.programs.map((item) => [item.programId, item]));
  const baseEducation = new Map(baseline.educationRecords.map((item) => [item.educationRecordId, item]));
  const baseEngagements = new Map(baseline.engagements.map((item) => [item.engagementId, item]));
  const baseWorks = new Map(baseline.works.map((item) => [item.workId, item]));
  const profileStatementById = new Map(sheetRows(snapshot, 'profile_statements').map((row) => [text(row.statement_id), row]));

  const people = sheetRows(snapshot, 'people_registry').map((row) => {
    const personId = text(row.person_id);
    if (!/^[SPI]\d{4}$/.test(personId)) throw new Error('Invalid canonical person_id in normalized snapshot: ' + personId);
    const existing = basePeople.get(personId) ?? {};
    const currentStatementId = nullable(row.current_statement_id);
    const currentStatement = currentStatementId ? profileStatementById.get(currentStatementId) : null;
    if (currentStatement && text(currentStatement.person_id) !== personId) {
      throw new Error('Profile statement owner does not match people_registry: ' + currentStatementId);
    }
    const migrationClassification = text(row.migration_classification) || existing.migrationClassification;
    const consentStatus = normalizedConsent(row.consent_public);
    return {
      ...existing,
      personId,
      names: {
        full: localized(row.full_name_th, row.full_name_en),
        nickname: localized(row.nickname_th, row.nickname_en),
        card: localized(row.nickname_th || row.full_name_th, row.nickname_en || row.full_name_en)
      },
      currentStatus: text(row.current_status) === 'active' ? 'active' : 'alumni',
      firstJoined: nullable(row.first_joined),
      migrationClassification,
      canonicalIdPolicy: existing.canonicalIdPolicy ?? {
        assignedAtMigration: '2026-08-23',
        categoryAtMigration: migrationClassification,
        frozenAcrossFutureRoleChanges: true
      },
      educationDisplayMode: text(row.education_display_mode) || existing.educationDisplayMode,
      educationDisplay: {
        mode: text(row.education_display_mode) || existing.educationDisplayMode,
        card: localized(row.card_education_th, row.card_education_en),
        detail: localized(row.detail_education_th, row.detail_education_en),
        verificationStatus: text(row.verification_status) || existing.educationDisplay?.verificationStatus || 'owner_review_required'
      },
      bio: (() => {
        const currentStatus = text(currentStatement?.publication_status);
        const status = ['owner_pending', 'source_backed_placeholder', 'owner_approved'].includes(currentStatus || text(row.bio_status))
          ? currentStatus || text(row.bio_status)
          : existing.bio?.status ?? 'owner_pending';
        const verificationStatus = ['owner_pending', 'owner_authorized_placeholder', 'owner_approved'].includes(text(row.bio_verification_status))
          ? text(row.bio_verification_status)
          : existing.bio?.verificationStatus ?? 'owner_pending';
        const ownerApprovalStatus = text(currentStatement?.owner_approval_status ?? row.bio_owner_approval_status);
        const ownerApproval = ownerApprovalStatus === 'granted'
          ? {
              status: 'granted',
              approvedAt: nullable(currentStatement?.effective_from ?? row.bio_owner_approved_at),
              scope: nullable(currentStatement?.owner_approval_scope ?? row.bio_owner_approval_scope),
              sourceRef: safeProfileSourceRef(currentStatement?.owner_approval_source_ref ?? row.bio_owner_approval_source_ref)
            }
          : existing.bio?.ownerApproval ?? null;
        const publicationBasis = nullable(currentStatement?.publication_basis ?? row.bio_publication_basis) ?? existing.bio?.publicationBasis ?? null;
        const sourceBasis = nullable(currentStatement?.source_basis ?? row.bio_source_basis) ?? existing.bio?.sourceBasis ?? null;
        const sourceType = nullable(currentStatement?.source_type ?? row.bio_source_type) ?? existing.bio?.sourceType ?? null;
        const sourceRef = safeProfileSourceRef(
          currentStatement?.source_ref ?? row.bio_source_ref,
          existing.bio?.sourceRef ?? null
        );
        return {
          th: nullable(currentStatement?.text_th ?? row.bio_th ?? row.bio_placeholder_th),
          en: nullable(currentStatement?.text_en ?? row.bio_en ?? row.bio_placeholder_en),
          status,
          verificationStatus,
          publicationBasis,
          sourceBasis,
          sourceType,
          sourceRef,
          authorRole: nullable(currentStatement?.author_role ?? row.bio_author_role) ?? existing.bio?.authorRole ?? null,
          derivationMethod: nullable(currentStatement?.derivation_method ?? row.bio_derivation_method) ?? existing.bio?.derivationMethod ?? null,
          evidenceScope: nullable(currentStatement?.evidence_scope ?? row.bio_evidence_scope) ?? existing.bio?.evidenceScope ?? null,
          evidenceConfidence: nullable(currentStatement?.evidence_confidence ?? row.bio_evidence_confidence) ?? existing.bio?.evidenceConfidence ?? null,
          reviewStatus: nullable(currentStatement?.person_review_status ?? row.bio_review_status) ?? existing.bio?.reviewStatus ?? 'pending_owner_copy',
          ownerApproval
        };
      })(),
      publication: {
        consentStatus,
        profileStatus: consentStatus === 'granted' ? 'eligible' : 'withheld_pending_consent'
      },
      dataQuality: {
        profileVerificationStatus: text(row.verification_status) || 'owner_review_required',
        sourceNotePresent: Boolean(text(row.source_note))
      }
    };
  });

  const personById = new Map(people.map((item) => [item.personId, item]));
  const institutions = sheetRows(snapshot, 'institutions').map((row) => ({
    ...(baseInstitutions.get(text(row.institution_id)) ?? {}),
    institutionId: text(row.institution_id),
    names: {
      th: { formal: text(row.official_name_th), short: text(row.short_name_th) },
      en: { formal: text(row.official_name_en), short: text(row.short_name_en) }
    },
    aliases: split(row.aliases),
    verificationStatus: text(row.verification_status) || 'owner_review_required',
    linkedinUrl: nullable(row.linkedin_url ?? baseInstitutions.get(text(row.institution_id))?.linkedinUrl),
    linkedinVerificationStatus: text(row.linkedin_verification_status) ||
      baseInstitutions.get(text(row.institution_id))?.linkedinVerificationStatus || 'not_found_exact_official_page'
  }));

  const programs = sheetRows(snapshot, 'programs').map((row) => ({
    ...(basePrograms.get(text(row.program_id)) ?? {}),
    programId: text(row.program_id),
    names: {
      th: { formal: text(row.official_name_th), short: text(row.short_name_th) },
      en: { formal: text(row.official_name_en), short: text(row.short_name_en) }
    },
    qualificationLevel: nullable(row.qualification_level),
    verificationStatus: text(row.verification_status) || 'owner_review_required',
    linkedinUrl: nullable(row.linkedin_url ?? basePrograms.get(text(row.program_id))?.linkedinUrl),
    linkedinVerificationStatus: text(row.linkedin_verification_status) ||
      basePrograms.get(text(row.program_id))?.linkedinVerificationStatus || 'not_found_exact_official_page'
  }));

  const educationRecords = sheetRows(snapshot, 'education').map((row) => {
    const educationRecordId = text(row.education_record_id);
    const existing = baseEducation.get(educationRecordId) ?? {};
    const hasDegreeColumns = [
      row.degree_abbreviation_th,
      row.degree_abbreviation_en,
      row.degree_title_th,
      row.degree_title_en,
      row.degree_field_th,
      row.degree_field_en,
      row.degree_award_status,
      row.degree_program_evidence_url,
      row.degree_evidence_scope
    ].some((value) => text(value));
    const hasStudyPeriodColumns = [
      row.study_start,
      row.study_end,
      row.study_period_label_th,
      row.study_period_label_en
    ].some((value) => text(value)) || boolean(row.study_current);
    return {
      ...existing,
      educationRecordId,
      personId: text(row.person_id),
      institutionId: text(row.institution_id),
      programId: nullable(row.program_id),
      recordType: text(row.record_type) || 'education',
      isPrimary: boolean(row.is_primary),
      sourceLabel: text(row.source_label),
      qualification: localized(row.qualification_th, row.qualification_en),
      degree: hasDegreeColumns
        ? {
            abbreviation: localized(row.degree_abbreviation_th, row.degree_abbreviation_en),
            title: localized(row.degree_title_th, row.degree_title_en),
            field: localized(row.degree_field_th, row.degree_field_en),
            awardStatus: text(row.degree_award_status) || 'under_review',
            personalAwardVerified: boolean(row.degree_personal_award_verified),
            programEvidenceUrl: nullable(row.degree_program_evidence_url),
            evidenceScope: text(row.degree_evidence_scope) || 'program_level_only'
          }
        : existing.degree ?? null,
      studyPeriod: hasStudyPeriodColumns
        ? {
            start: nullable(row.study_start),
            end: nullable(row.study_end),
            current: boolean(row.study_current),
            label: localized(row.study_period_label_th, row.study_period_label_en)
          }
        : existing.studyPeriod ?? null,
      verificationStatus: text(row.verification_status) || 'owner_review_required',
      evidenceNote: nullable(row.evidence_note)
    };
  });

  const engagements = sheetRows(snapshot, 'engagements').map((row) => ({
    ...(baseEngagements.get(text(row.engagement_id)) ?? {}),
    engagementId: text(row.engagement_id),
    personId: text(row.person_id),
    category: text(row.category),
    program: { code: text(row.program_code), names: localized(row.program_name_th, row.program_name_en) },
    cohortLabel: nullable(row.cohort),
    roleTitle: localized(row.role_th, row.role_en),
    start: nullable(row.start),
    end: nullable(row.end),
    status: text(row.status),
    responsibilityWorkIds: split(row.responsibility_work_ids),
    evidenceStatus: text(row.evidence_status),
    verificationStatus: text(row.verification_status),
    sequenceHint: row.sequence_hint === '' || row.sequence_hint == null ? null : Number(row.sequence_hint),
    academicPlacementType: ['cooperative_education', 'internship', 'not_applicable'].includes(text(row.academic_placement_type))
      ? text(row.academic_placement_type)
      : baseEngagements.get(text(row.engagement_id))?.academicPlacementType ?? 'not_applicable'
  }));

  const works = sheetRows(snapshot, 'works').map((row) => ({
    ...(baseWorks.get(text(row.work_id)) ?? {}),
    workId: text(row.work_id),
    parentProduct: text(row.parent_product),
    moduleSlug: nullable(row.module_slug),
    names: localized(row.canonical_name_th, row.canonical_name_en),
    shortNames: localized(row.short_name_th, row.short_name_en),
    type: text(row.type),
    scopeLayer: text(row.scope_layer),
    authorityStatus: text(row.authority_status),
    evidenceNote: nullable(row.evidence_note),
    sourceAliases: split(row.source_aliases),
    catalogUrl: localized(
      row.catalog_url_th ?? baseWorks.get(text(row.work_id))?.catalogUrl?.th,
      row.catalog_url_en ?? baseWorks.get(text(row.work_id))?.catalogUrl?.en
    ),
    destinationUrl: nullable(row.destination_url ?? baseWorks.get(text(row.work_id))?.destinationUrl),
    linkEvidence: {
      linkScope: text(row.link_scope ?? baseWorks.get(text(row.work_id))?.linkEvidence?.linkScope) || 'unverified_no_link',
      sourceRef: nullable(row.url_source_ref ?? baseWorks.get(text(row.work_id))?.linkEvidence?.sourceRef),
      evidenceUrl: nullable(row.link_evidence_url ?? baseWorks.get(text(row.work_id))?.linkEvidence?.evidenceUrl)
    }
  }));

  const contributions = sheetRows(snapshot, 'contributions').map((row) => ({
    contributionId: text(row.contribution_id),
    personId: text(row.person_id),
    workId: text(row.work_id),
    engagementId: nullable(row.engagement_id),
    role: localized(row.role_th, row.role_en),
    period: { start: nullable(row.period_start), end: nullable(row.period_end), label: nullable(row.period_label) },
    evidenceStatus: text(row.evidence_status),
    sourceRef: text(row.source_ref),
    evidenceNote: nullable(row.evidence_note)
  }));

  const recipients = new Map();
  for (const row of sheetRows(snapshot, 'person_achievements')) {
    const values = recipients.get(text(row.achievement_id)) ?? [];
    values.push(text(row.person_id));
    recipients.set(text(row.achievement_id), values);
  }
  const achievements = sheetRows(snapshot, 'achievements').map((row) => ({
    achievementId: text(row.achievement_id),
    title: localized(row.title_th, row.title_en),
    result: localized(row.result_th, row.result_en),
    organizer: localized(row.organizer_th, row.organizer_en),
    awardedOn: nullable(row.awarded_on),
    dateVerificationStatus: text(row.date_verification_status),
    recipientPersonIds: recipients.get(text(row.achievement_id)) ?? [],
    workId: nullable(row.work_id),
    evidenceStatus: text(row.evidence_status),
    evidenceUrl: nullable(row.evidence_url),
    evidenceNote: nullable(row.evidence_note)
  }));

  const publicationRows = sheetRows(snapshot, 'external_publications');
  const publications = publicationRows.length
    ? publicationRows.map((row) => ({
        publicationId: text(row.publication_id),
        personId: text(row.person_id),
        title: localized(row.title_th, row.title_en),
        outlet: text(row.outlet),
        volume: nullable(row.volume),
        year: Number(row.year),
        doi: text(row.doi),
        publicUrl: text(row.public_url),
        ownerEvidenceUrl: nullable(row.owner_evidence_url),
        bibliographicUrl: nullable(row.bibliographic_url),
        relationship: text(row.relationship),
        scope: text(row.scope),
        verificationStatus: text(row.verification_status),
        publicationBasis: text(row.publication_basis),
        evidenceNote: nullable(row.evidence_note)
      }))
    : structuredClone(baseline.publications ?? []);

  const socialProfiles = sheetRows(snapshot, 'social_profiles').map((row) => {
    const person = personById.get(text(row.person_id));
    const candidate = nullable(row.candidate_url_or_handle);
    const requestedPublicUrl = nullable(row.public_url);
    const verificationStatus = normalizedVerification(row.verification_status, candidate ? 'owner_review_required' : 'missing');
    const consentStatus = normalizedConsent(row.consent_status);
    const requestedPublication = text(row.publication_status).toLowerCase();
    const publicationBasis = text(row.publication_basis) || null;
    const ownerApproval = ownerApprovalFromRow(row);
    const individuallyConsented = consentStatus === 'granted' && person?.publication.consentStatus === 'granted';
    const ownerAuthorized = publicationBasis === 'owner_authorized_public_profile_link' && ownerApproval?.status === 'granted';
    const canPublish = Boolean(requestedPublicUrl) && verificationStatus === 'verified' &&
      (individuallyConsented || ownerAuthorized) && requestedPublication === 'publishable';
    const publicationStatus = requestedPublication === 'withdrawn'
      ? 'withdrawn'
      : canPublish
        ? 'publishable'
        : !candidate && !requestedPublicUrl
          ? 'withheld_pending_candidate'
          : !individuallyConsented && !ownerAuthorized
            ? 'withheld_pending_consent'
            : 'withheld_pending_verification';
    return {
      socialProfileId: text(row.social_profile_id),
      personId: text(row.person_id),
      platform: text(row.platform).toLowerCase(),
      publicUrl: canPublish ? requestedPublicUrl : null,
      candidateStatus: candidateStatus(row.candidate_status, Boolean(candidate), 'social'),
      candidateValueEmitted: false,
      verificationStatus,
      consentStatus,
      publicationBasis,
      ownerApproval,
      publicationStatus,
      dataBoundary: 'private_candidates_not_emitted'
    };
  });

  const assets = sheetRows(snapshot, 'assets').map((row) => {
    const candidate = Boolean(nullable(row.source_url) || nullable(row.public_path));
    const verificationStatus = normalizedVerification(row.verification_status, candidate ? 'owner_review_required' : 'missing');
    const consentStatus = normalizedConsent(row.consent_status);
    const rightsStatus = normalizedRights(row.rights_status);
    const requestedPublication = text(row.publication_status).toLowerCase();
    const publicationBasis = text(row.publication_basis) || null;
    const ownerApproval = ownerApprovalFromRow(row);
    const ownerAuthorized = publicationBasis === 'owner_authorized_public_profile_portrait' && ownerApproval?.status === 'granted';
    const canPublish = Boolean(nullable(row.public_path)) && verificationStatus === 'verified' &&
      (consentStatus === 'granted' || ownerAuthorized) && rightsStatus === 'cleared' && requestedPublication === 'publishable';
    return {
      assetId: text(row.asset_id),
      personId: text(row.person_id),
      kind: text(row.kind) || 'profile_portrait',
      publicPath: canPublish ? nullable(row.public_path) : null,
      sourceUrl: null,
      alt: localized(row.alt_th, row.alt_en),
      candidateStatus: candidateStatus(row.candidate_status, candidate, 'asset'),
      verificationStatus,
      consentStatus,
      rightsStatus,
      publicationBasis,
      ownerApproval,
      publicationStatus: requestedPublication === 'withdrawn'
        ? 'withdrawn'
        : canPublish ? 'publishable' : 'withheld_pending_rights_consent_and_verification',
      sha256: nullable(row.sha256),
      mediaType: nullable(row.media_type),
      bytes: row.bytes === '' || row.bytes == null ? null : Number(row.bytes),
      identityVerificationEvidence: nullable(row.identity_verification_evidence)
    };
  });

  const meta = {
    ...baseline.meta,
    source: sourceMeta(snapshot, baseline),
    counts: {
      ...baseline.meta.counts,
      people: people.length,
      engagements: engagements.length,
      educationRecords: educationRecords.length,
      works: works.length,
      contributions: contributions.length,
      achievements: achievements.length,
      publications: publications.length,
      certificates: baseline.certificates.length,
      verifiedInstitutionLinkedInProfiles: institutions.filter((institution) => institution.linkedinUrl).length,
      verifiedProgramLinkedInProfiles: programs.filter((program) => program.linkedinUrl).length,
      publishedPublicSocialProfiles: socialProfiles.filter((profile) => profile.publicUrl).length
    }
  };

  return {
    meta,
    copy: baseline.copy,
    institutions,
    programs,
    educationRecords,
    people,
    engagements,
    works,
    contributions,
    achievements,
    publications,
    socialProfiles,
    assets,
    certificates: structuredClone(baseline.certificates)
  };
}
