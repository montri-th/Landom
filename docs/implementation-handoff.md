# Landom implementation handoff

## 1. Delivery shape

This repository is a static GitHub Pages site. No browser-side secret, API key, Google credential, or private contact table is required.

| Source | Built location | Purpose |
|---|---|---|
| `index.html` | `dist/index.html` | Accessible page shell and controls |
| `robots.txt`, `sitemap.xml` | same root paths in `dist/` | Single-route discovery contract |
| `src/` | `dist/src/` | CSS and browser JavaScript |
| `public/` | `dist/public/` | Approved, repository-owned assets |
| `data/generated/` | `dist/data/generated/` | Reviewed public records only |

`data/raw/` is an authorized local normalization input and is deliberately absent from the repository and build. A snapshot may use either supported shape:

- Sheet-style: `{ "sheets": { "<tab>": [["header", "..."], ["value", "..."]] } }`.
- Exporter-style: `{ "tabs": { "<tab>": { "headers": ["header", "..."], "rows": [["value", "..."]] } } }`.

The normalizer detects the shape; operators do not need to rewrite one form into the other. `dist/build-manifest.json` records stable byte counts and SHA-256 hashes without timestamps, and validation recomputes every entry. `dist/.nojekyll` prevents Jekyll from changing the static artifact.

## 2. Naming and evidence boundaries

- Brand/portfolio/methodology: `Landometer`.
- Community: `Landom` (exact case), with Thai labels `ชาว Landom` / `ชาวแลนด้อม`.
- Approved Thai tagline: `แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น`.
- Product family names follow the live CityMETER convention: `CityMETER: <work>`.
- `Landom: ด้อมผู้สร้าง Landometer` is a Landom work name, not a spelling variant of the brand.

Locale Insight may be described at portfolio, methodology, and product-architecture levels across Land, Location, and Living. Product-specific evidence stays attached to that product. Do not turn assumptions from ijji/F&B, retail, municipality, or CityWiki into portfolio-wide facts. Cross-product and cross-city displays need the same schema/release or an explicit incompatibility note.

## 3. Data ownership and refresh

The Google Sheet is the human-maintained registry; normalized JSON is the reviewed public projection.

Recommended sheet tabs and keys:

| Tab | Primary key | Important relations / controls |
|---|---|---|
| `people_registry` | `person_id` | One ID only; names, core publication state, materialized current bio, `current_statement_id` |
| `profile_statements` | `statement_id` | Versioned bilingual copy with distinct first-person/factual-fallback provenance, evidence boundary, approval and review state; v3.4 has 48 current statements |
| `engagements` | `engagement_id` | `person_id`, role type, start/end/cohort, explicit academic placement type |
| `institutions` | `institution_id` | Official TH/EN names, approved short labels, nullable exact official LinkedIn URL and verification status |
| `programs` | `program_id` | `institution_id`, official TH/EN names, approved short labels, nullable exact official LinkedIn URL and verification status |
| `education` | `education_record_id` | `person_id`, `institution_id`, optional `program_id`, degree program and separate personal award status |
| `works` | `work_id` | Canonical work/product name plus localized catalog route and link evidence scope |
| `contributions` | `contribution_id` | `person_id`, `work_id`, optional matching `engagement_id` |
| `achievements` | `achievement_id` | Recipient person IDs, optional related work, public evidence URL |
| `social_profiles` | `social_profile_id` | Platform, private candidate, public URL, verification, consent, publication basis, scoped owner approval |
| `assets` | `asset_id` | Person, governed local path, verification, consent, rights, publication basis, owner approval, hash |

Certificates are governed in the repository rather than edited through the current Sheet roundtrip. `data/approved/certificate-assets.json` is the reviewed source inventory; normalization emits `certificates[]` plus `data/generated/certificates.json`, and normalized-Sheet import preserves that reviewed baseline dimension. Do not convert a certificate QR destination into a contribution or work record.

Use protected lookup ranges and dropdown validation for IDs, roles, statuses, institutions, programs, works, verification, consent, rights, and publication states. Do not use display names as foreign keys. Keep audit/evidence columns beside the status they support. Prefer append-only engagement/contribution history over changing a person's canonical ID when their role changes.

Refresh sequence:

1. Export or sync only through an authorized local process into `data/raw/google-sheet-snapshot.json`.
2. Normalize explicitly (the npm shortcut uses these defaults):

   ```sh
   node tools/normalize-data.mjs \
     --input data/raw/google-sheet-snapshot.json \
     --output-dir data/generated
   ```

3. Review changes in `data/generated/`, especially IDs, academic placement, degree program versus personal award status, contributions, work routes, approved public social URLs, governed image assets, and governed profile statements.
4. Run `npm run build`. This repeats validation and tests, creates the allowlisted artifact, and validates `dist/`.
5. Commit public source/generated files only. Never add the raw snapshot, contact columns, downloaded CVs, cookies, or credentials.

For the controlled return trip to Google Sheet, run the exporter against both sides of the local boundary:

```sh
node tools/export-sheet-tabs.mjs \
  --snapshot data/raw/google-sheet-snapshot.json \
  --site-data data/generated/site-data.json \
  --output /private/tmp/landom-sheet-tabs-v3.4.0.json
```

Append a positional `<tab-name>` to emit only one structured tab payload. Always use `--output` with a private path for a full workbook so private candidates are not written to terminal/CI logs. The exporter merges the reviewed normalized records with private social/asset candidates and their review fields from the ignored raw snapshot, preserving those candidates across a roundtrip. The normalizer never promotes a candidate merely because it exists: private candidate URLs, handles, source URLs, evidence, permission records, and review notes remain raw-only unless the public gates explicitly produce an approved public field.

Apply an exported payload only through an authorized local Sheet session and verify the target spreadsheet before writing. A complete workbook payload can contain private social/asset candidates and internal contacts; never save it in the repository, attach it to CI logs, or publish it as an artifact. GitHub Actions must never fetch from or write to Google Sheets, and must never receive a raw snapshot or Google credentials. The detailed tab/enum contract is in `docs/data-dictionary.md`, and the public JSON contract is in `data/schema/site-data.schema.json`.

For role-aware education display:

- Full-time staff: show standardized degree/qualification plus the institution.
- Intern: show standardized program plus the institution.
- Part-time or mixed history: use the engagement relevant to the selected period and avoid implying a current role from an old education record.
- Masonry card: short institution/program labels.
- Inline expanded card: official full institution/program labels.
- FDI program display copy is exact: `Full-stack Developer Intern, FDI` in both UI locales.
- The Thai short label for Computer Engineering is `วิศวกรรมคอมพิวเตอร์`, not `วศ.คอมพิวเตอร์`.
- A degree label such as `B.Eng., Computer Engineering` requires both standardized official-program nomenclature and recorded person-level status. The current release carries explicit directory-owner confirmation for `degree.awardStatus=completed` and `degree.personalAwardVerified=true` on all four staff records. Future changes must preserve this separation and may not infer an earned award from a curriculum title alone.
- `academicPlacementType` is required on every engagement: `internship`, `cooperative_education`, or `not_applicable`. It is never parsed from `cohortLabel`. The public co-op set is exactly `I0003`, `I0030`, `I0031`, `I0034`, `I0036`, and `I0039`; Q stays private until a started engagement and contribution are verified.
- If a required program or qualification is still unknown, show an explicit pending-confirmation label beside the verified institution; never repeat an institution name as though it were the program.

## 4. Public IDs and relationships

Person IDs must match `^[SPI][0-9]{4}$`: `S` full-time, `P` part-time, `I` intern. A multi-role person has one canonical person ID and multiple engagement rows; do not create a second person record or expose legacy IDs.

Validation rejects:

- duplicate/legacy person IDs;
- duplicate canonical people;
- orphan person, engagement, institution, program, work, asset, or achievement relations;
- contributions linked to another person's engagement;
- any person with zero contributions;
- Oat without separate `Land Portfolio` and `Lead2Loan` works;
- noncanonical `LanDOM`, `CityMERE`, `Citymeter`, `CityMETER :`, or `Visual Guidlines` work labels.

## 5. UI hooks

The static shell owns these required IDs; changes require updating the validator and tests in the same review:

| Hook | Contract |
|---|---|
| `#language-toggle` | TH/EN switch; updates document language and visible copy |
| `#theme-toggle` | light/dark/system behavior; updates `data-theme`, `color-scheme`, and theme color |
| `#search-input` | compact text search |
| `#filter-open` | mobile filter bottom-sheet trigger |
| `#filter-dialog`, `#filter-form` | accessible filter dialog and form |
| `#filter-role`, `#filter-cohort`, `#filter-status`, `#filter-work` | filter dimensions |
| `#filter-clear` | reset filters without page reload |
| `#people-board` | masonry result board and one-at-a-time inline profile expansion |
| `.person-card-shell`, `.person-inline-detail` | accessible inline detail state and cascading masonry reflow |
| `#certificate-dialog`, `#certificate-close`, `#certificate-download` | governed high-resolution certificate preview and download |

Cards must be keyboard-operable `.person-card` buttons. Profile details expand inside the selected masonry card rather than opening a person modal; only one profile is expanded at a time, and reduced-motion preferences disable decorative cascade motion. Small screens keep search compact and move secondary filters into `#filter-dialog`. Unapproved or broken person images fall back to the full nickname in `.avatar-name`; do not derive initials.

The app fetches `./data/generated/site-data.json`; keep URLs relative so project Pages works under `/Landom/`.

Discovery uses one canonical URL, `https://montri-th.github.io/Landom/`, shared by HTML, `robots.txt`, and `sitemap.xml`. The horizontal header lockup is prohibited as a favicon, compact icon, or `og:image`; leave those roles absent until separately approved assets exist.

## 6. Social and image approval gate

Current release behavior, following the owner instruction for this directory, renders all 48 core profile records with bilingual `source_backed_placeholder` copy. Twenty-five records use concise paraphrases of first-person application answers with exact roster matches. Twenty-three use `factual_fallback` copy synthesized with `bounded_inference` only from reconciled role, education, and verified-work evidence. Each bio carries public-safe `publicationBasis`, `sourceBasis`, `sourceType`, `sourceRef`, `authorRole`, `derivationMethod`, `evidenceScope`, and `evidenceConfidence`; the two provenance paths must never be collapsed. Verification is `owner_authorized_placeholder` and review remains `pending_candidate_video_review` for both groups. This is not individual approval of final copy. Raw application text, private recruitment/application Sheet IDs or ranges, contacts, interviewer comments, scores, and unmatched applicant text remain outside the public projection. The authorized core-registry Sheet ID may remain only in `meta.source` as registry provenance.

Keep profile copy versioned in `profile_statements`; do not overwrite an old statement when a person's video transcript is reviewed. Add a new statement, link `supersedes_statement_id`, then move `people_registry.current_statement_id` after review. The separate private **Shortlisted recruitment** workbook owns unmatched applicants, contacts, CV/video URLs, screening stages, and reviewer notes; none of those fields belong in the repository or public projection.

Private social and asset review columns use only these enums:

| Gate | Exact allowed values |
|---|---|
| verification | `owner_review_required`, `verified`, `rejected`, `missing` |
| consent | `granted`, `pending`, `denied` |
| rights | `cleared`, `pending`, `denied`, `revoked` |
| social publication basis | `individual_consent`, `owner_authorized_public_profile_link`, null |
| portrait publication basis | `individual_consent`, `owner_authorized_public_profile_portrait`, null |
| publication | `publishable`, `withheld_pending_*`, `withdrawn` |

`withheld_pending_*` denotes the controlled family of reason-specific pending states (for example, pending consent or rights). It never passes the publication gate. `withdrawn` is terminal for public display until a new, evidenced review changes the record; it is not interchangeable with `pending`.

Public social records require exact identity verification, a `publicUrl`, and `publicationStatus: publishable`, plus one of these explicitly recorded bases:

1. `individual_consent` with the profile/person consent statuses granted; or
2. `owner_authorized_public_profile_link` with `ownerApproval.status: granted`, approval date, scope `public_profile_link_only`, and source reference.

The second basis is a scoped directory-owner publication decision, not individual consent. Keep `consentStatus: pending` unless actual individual consent is recorded. Store no session cookie, internal follower list, private message, email, phone, Line, Discord, CV identifier, or unpublished candidate handle in public JSON.

Person-image records additionally require `rightsStatus: cleared`, exact identity verification, and either individual consent or `owner_authorized_public_profile_portrait` with scoped owner approval. Copy/normalize approved images into `public/assets/people/<personId>.jpg`; public data stores only the local path, SHA-256, media metadata, and bounded evidence label. Expiring CDN/source-profile URLs stay in private evidence and `sourceUrl` remains null. Every file there must have a matching publishable `assets[]` record. Failed, pending, revoked, missing, or broken assets render the full nickname as fallback.

The approved portrait inventory is `data/approved/portrait-assets.json`; the public manifest and role restrictions are in `docs/assets-manifest.json`. Normalize/check hashes after any asset replacement.

Certificate images use a separate deny-by-default inventory at `data/approved/certificate-assets.json`. Only filled, owner-authorized images may be copied byte-for-byte to `public/assets/certificates/<personId>-<credentialId>.png`. Public `certificates[]` records require `verificationStatus: verified`, `rightsStatus: cleared`, `publicationStatus: publishable`, `publicationBasis: owner_authorized_public_certificate`, and `ownerApproval.scope: public_certificate_image_and_printed_profile_facts`; keep `consentStatus: pending` unless individual consent is separately recorded. The governed 26-image release is exactly 12 FDI + 5 MSI + 8 IMP + 1 PDI. The eight Impvest certificates remain `programCode: IMP` with `Consulting Partner`; only Hana's `PDI26101` uses `programCode: PDI` with `Product development`. Credential ID is not unique (`IMP25007` appears twice), QR targets are excluded, Dada's spelling mismatch remains owner-review-required without changing the canonical registry name, and Hana's printed 2025 date may not define the 2026 PDI timeline.

## 7. CI and GitHub Pages

The Pages workflow has two phases and is intentionally public-data-only. It must not make remote Google Sheet calls in either phase:

1. `build`: checkout, Node 20, validation/tests, reproducible build, artifact upload;
2. `deploy`: GitHub Pages deployment followed by live status/MIME checks and manifest-hash parity for HTML, public JSON, JavaScript, CSS, discovery files, and the approved logo.

Configure **Settings → Pages → Source: GitHub Actions**. The workflow needs standard Pages `write` and OIDC `id-token` permissions only in the deploy job. No repository secret is required.

Before merging, review the exact generated-data and asset diff. After deployment, record the deployed commit and Pages run, then verify the final URL—not an assumed preview URL.

## 8. Manual release gates

Automation does not close these checks:

- Thai and English copy/behavior review;
- responsive review at narrow mobile, tablet, and desktop widths;
- native iOS/Android bottom-sheet, scroll, focus return, and virtual-keyboard behavior;
- Thai at 130% zoom and page at 200% zoom;
- keyboard, visible focus, screen-reader labels, reduced motion, inline-detail focus return, and filter/certificate dialog focus containment;
- final human review of institution/program canonicalization and product naming against the same CityMETER release;
- candidate-video/profile-owner review of all current placeholder bios, preserving statement version history;
- evidence, consent, and rights review for every newly published social link or person image.

Until those are checked on the released bytes, report them as open manual gates rather than passed.
