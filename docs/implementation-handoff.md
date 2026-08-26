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
- `Landom: ชาวด้อมผู้สร้าง Landometer` is a Landom work name, not a spelling variant of the brand.

Locale Insight may be described at portfolio, methodology, and product-architecture levels across Land, Location, and Living. Product-specific evidence stays attached to that product. Do not turn assumptions from ijji/F&B, retail, municipality, or CityWiki into portfolio-wide facts. Cross-product and cross-city displays need the same schema/release or an explicit incompatibility note.

## 3. Data ownership and refresh

The Google Sheet is the human-maintained registry; normalized JSON is the reviewed public projection.

Recommended sheet tabs and keys:

| Tab | Primary key | Important relations / controls |
|---|---|---|
| `people_registry` | `person_id` | One ID only; names, core publication state, materialized current bio, `current_statement_id` |
| `profile_statements` | `statement_id` | Versioned bilingual copy with distinct first-person/factual-fallback provenance, evidence boundary, approval and review state; v3.4 has 51 current statements |
| `engagements` | `engagement_id` | `person_id`, role type, start/end/cohort, explicit academic placement type |
| `institutions` | `institution_id` | Official TH/EN names, approved short labels, nullable exact official LinkedIn URL and verification status |
| `programs` | `program_id` | `institution_id`, official TH/EN names, approved short labels, nullable exact official LinkedIn URL and verification status |
| `education` | `education_record_id` | `person_id`, `institution_id`, optional `program_id`, degree program and separate personal award status |
| `works` | `work_id` | Canonical work/product name plus localized catalog route and link evidence scope |
| `contributions` | `contribution_id` | `person_id`, `work_id`, optional matching `engagement_id` |
| `achievements` | `achievement_id` | Recipient person IDs, optional related work, public evidence URL |
| `external_publications` | `publication_id` | Exact author match, bibliographic evidence and owner-authorized public link; never a Landometer work or contribution |
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
- Part-time staff: show a verified degree/qualification plus the institution when recorded; mixed-history profiles still use the engagement relevant to the selected period and must not imply a current role from an old education record.
- Masonry card: short institution/program labels.
- Inline expanded card: official full institution/program labels.
- FDI program display copy is exact: `Full-stack Developer Intern, FDI` in both UI locales.
- The Thai short label for Computer Engineering is `วิศวกรรมคอมพิวเตอร์`, not `วศ.คอมพิวเตอร์`.
- Resolve the Thai student noun from the selected education relation: use `นิสิต` only for `institutionId: inst-chula`; keep the generic noun for every other institution.
- Render `educationProgram` as the verified program or qualification context while keeping the institution visible as its own value. Do not render the literal `การศึกษาจาก`, and do not imply an earned/completed degree when `degree` is null.
- The canonical Sheet correction for `I0029` is `people_registry!I34: EDU0033 -> EDU0032`; `EDU0032` is the primary education record.
- A degree label such as `B.Eng., Computer Engineering` requires both standardized official-program nomenclature and recorded person-level status. The current release carries explicit directory-owner confirmation for `degree.awardStatus=completed` and `degree.personalAwardVerified=true` on the four existing full-time education records, Nat (`S0006`), Pote (`S0007`) and Sek (`P0001`). Nat and Sek use official program definitions for nomenclature; Pote uses the owner-supplied IEEE author biography as direct person-level evidence. Biw (`S0005`) has no supplied education evidence, so that education section stays absent rather than inventing or displaying a pending credential. Future changes must preserve this separation and may not infer an earned award from a curriculum title alone.
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

Discovery uses `https://montri-th.github.io/Landom/` as both the Thai canonical route and `x-default`, with a stable crawlable English route at `/Landom/en/`. The build produces localized initial HTML, self-canonical URLs, reciprocal `hreflang`, localized Open Graph text, truthful `CollectionPage` JSON-LD, and matching sitemap entries without a duplicate `/th/` page. `llms.txt` is navigation-only and must never be presented as permission, a license, evidence, a ranking signal, or authority for an agent to act.

Browser tabs use the exact DS v0.9.0 transparent compact symbol at `https://montri-th.github.io/Landometer/assets/images/landometer-symbol-transparent.png?v=35a1496f` (PNG, 192×192, 11,001 bytes, SHA-256 `35a1496f6e8c502cef82f0a46de5dacff98718ff9f5a6c07ccc3783d76e3ae85`). That approval is favicon-only. The horizontal header lockup remains prohibited as a favicon, compact icon, person avatar, or `og:image`; the compact symbol is likewise not approved for apple-touch, maskable/install, social preview, or horizontal header roles.

The social-preview role uses the separately owner-approved, privacy-normalized collaboration photograph at `public/assets/social/landom-people-og.jpg` (JPEG, 1200×630, 211,478 bytes, SHA-256 `a7c46cf31e976e420f78eb324ed9c41cbbdb5b91be28849ec6e307cf4ca5865c`). It is derived only from owner-supplied `IMG_4522.HEIC` by applying source orientation, bounded crop `x=16, y=605, width=4000, height=2100`, Display P3 → sRGB conversion, resize, and metadata removal. The public cache-busted URL is `https://montri-th.github.io/Landom/public/assets/social/landom-people-og.jpg?v=a7c46cf31e97`, and the exact Thai social title is `LANDOM · พวกเรา ที่ช่วยกันสร้าง LANDOMETER`.

The previous single responsive Hero photograph remains governed at `public/assets/hero/landom-people-hero.jpg` (JPEG, 1600×900, 395,416 bytes, SHA-256 `bd344dcbfff2f33cb21daf7bdbea16c96f0241f5b53cdaaca90844010195b61e`), derived from owner-supplied `IMG_2091.HEIC` with source orientation, bounded crop `x=0, y=320, width=4032, height=2268`, Display P3 → sRGB conversion, resize, and metadata removal.

The current Hero uses the owner-selected community-constellation composition. Its anchor is `public/assets/hero/landom-community-anchor.jpg`; its circular moments use `landom-community-dinner.jpg`, `landom-community-gathering.jpg`, and `landom-community-citymeter.jpg`. The CityMETER moment replaces only the prior work-session circle and preserves the existing layout. Every image is an owner-supplied, deterministic crop/resize with metadata removed; exact dimensions, hashes, source filenames, and role restrictions are pinned in `docs/assets-manifest.json`. The decorative Hero motif at `public/assets/decor/landometer-hero-motif.png` (PNG, 1600×1600, 74,610 bytes, SHA-256 `0317fb8e92b974717abce15f29be72d76dbce62e1ba8ff5bd40fe453bb6b2a67`) comes from owner-supplied `Landometer.LOGO 1.png`; it is a restrained decorative layer and must not replace the approved compact symbol, horizontal header lockup, social preview, or any person identity image.

Project-path code cannot independently control the hostname-level search-result favicon or `https://montri-th.github.io/robots.txt`, and third-party preview caches can remain stale after the origin is correct.

## 6. Social and image approval gate

Current release behavior, following the owner instruction for this directory, renders all 51 core profile records with bilingual `source_backed_placeholder` copy. The existing 48 profile texts remain byte-for-byte unchanged. Twenty-five records use concise paraphrases of first-person application answers with exact roster matches. Twenty-six use `factual_fallback` copy synthesized with `bounded_inference` only from reconciled role, education, and verified-work evidence, including three bounded new-staff profiles. Each bio carries public-safe `publicationBasis`, `sourceBasis`, `sourceType`, `sourceRef`, `authorRole`, `derivationMethod`, `evidenceScope`, and `evidenceConfidence`; the two provenance paths must never be collapsed. Verification is `owner_authorized_placeholder` and review remains `pending_candidate_video_review` for both groups. This is not individual approval of final copy. Raw application text, private recruitment/application Sheet IDs or ranges, contacts, interviewer comments, scores, and unmatched applicant text remain outside the public projection. The authorized core-registry Sheet ID may remain only in `meta.source` as registry provenance.

`external_publications` is a separate evidence dimension. Each row needs an exact person match, title/outlet/year/DOI bibliographic verification, and an owner-authorized public-link basis. Never project an external paper into `works`, `contributions`, an engagement responsibility, or a Landometer product claim.

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

The public web and generated public datasets additionally enforce a platform allowlist: expose only LinkedIn and GitHub records that pass the gate. Facebook, Instagram, and all other social-platform links remain Sheet/private-snapshot data and are Sheet-only. Preserve those candidates during private workbook roundtrip, but never emit them into public JSON, UI, or discovery/social metadata. Passing the gate does not widen this allowlist.

Person-image records additionally require `rightsStatus: cleared`, exact identity verification, and either individual consent or `owner_authorized_public_profile_portrait` with scoped owner approval. Copy/normalize approved images into `public/assets/people/<personId>.jpg`; public data stores only the local path, SHA-256, media metadata, and bounded evidence label. Expiring CDN/source-profile URLs stay in private evidence and `sourceUrl` remains null. Every file there must have a matching publishable `assets[]` record. Failed, pending, revoked, missing, or broken assets render the full nickname as fallback.

The approved portrait inventory is `data/approved/portrait-assets.json`; the public manifest and role restrictions are in `docs/assets-manifest.json`. Normalize/check hashes after any asset replacement.

The portrait-background release is limited to `I0001`, `I0008`, `I0012`, `I0018`, `I0019`, `I0021`, `I0025`, `I0033`, and `I0035`, whose sources have blank white backgrounds and no environmental context. Preserve original foreground pixels through the governed foreground mask and replace only the background. Leave every portrait with existing context untouched. Use multiple approved DS gradient recipes, record the exact recipe on each asset, and assign Diversity Spectrum to exactly one portrait. Edge-refined v2 may adjust only the mask-boundary transition to reduce residual light fringe; it must preserve the crop, portrait interior, gradient token/CSS, identity, rights, and publication basis, with any JPEG delta described as re-encoding rather than an interior retouch. Then synchronize the public SHA-256/byte metadata and canonical Sheet `assets` columns R:T (`sha256`, `media_type`, `bytes`). No Drive portrait mirror exists, so this release creates no Drive files.

Cross-site consumers such as CityMETER should read `https://montri-th.github.io/Landom/data/generated/people-media.json` rather than reconstructing asset paths. The manifest publishes stable and revisioned absolute HTTPS portrait URLs, localized alt text, profile links, SHA-256/byte metadata, and a full-nickname fallback for every canonical person ID. A missing `portrait` is intentional: clients must render `fallback.fullNickname` and must not substitute an unverified social avatar. GitHub Pages currently serves both the JSON and governed images with `Access-Control-Allow-Origin: *`; the contract itself remains public read-only and contains no source-profile CDN URLs.

Certificate images use a separate deny-by-default inventory at `data/approved/certificate-assets.json`. Only filled, owner-authorized images may be copied byte-for-byte to `public/assets/certificates/<personId>-<credentialId>.png`. Public `certificates[]` records require `verificationStatus: verified`, `rightsStatus: cleared`, `publicationStatus: publishable`, `publicationBasis: owner_authorized_public_certificate`, and `ownerApproval.scope: public_certificate_image_and_printed_profile_facts`; keep `consentStatus: pending` unless individual consent is separately recorded. The governed 26-image release is exactly 12 FDI + 5 MSI + 8 IMP + 1 PDI. The eight Impvest certificates remain `programCode: IMP` with `Consulting Partner`; only Hana's `PDI26101` uses `programCode: PDI` with `Product development`. Credential ID is not unique (`IMP25007` appears twice), QR targets are excluded, Dada's spelling mismatch remains owner-review-required without changing the canonical registry name, and Hana's printed 2025 date may not define the 2026 PDI timeline.

## 7. CI and GitHub Pages

The Pages workflow has two phases and is intentionally public-data-only. It must not make remote Google Sheet calls in either phase:

1. `build`: checkout, Node 20, validation/tests, reproducible build, artifact upload;
2. `deploy`: GitHub Pages deployment followed by live status/MIME checks and manifest-hash parity for HTML, public JSON, JavaScript, CSS, discovery files, the approved logo, and the governed social-preview, hero-photo, and hero-motif assets.

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
- visual and metadata review of the nine background-edited portraits: foreground preservation, context exclusion, per-asset DS recipe, one Diversity Spectrum assignment, and public/Sheet hash-byte parity.

Until those are checked on the released bytes, report them as open manual gates rather than passed.
