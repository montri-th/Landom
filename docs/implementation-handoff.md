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
| `people` | `person_id` | One ID only; names, publication consent, placeholder bio |
| `engagements` | `engagement_id` | `person_id`, role type, start/end/cohort |
| `institutions` | `institution_id` | Official TH/EN names and approved short labels |
| `programs` | `program_id` | `institution_id`, official TH/EN names and approved short labels |
| `education_records` | `education_record_id` | `person_id`, `institution_id`, optional `program_id`, degree |
| `works` | `work_id` | One canonical work/product name per release |
| `contributions` | `contribution_id` | `person_id`, `work_id`, optional matching `engagement_id` |
| `achievements` | `achievement_id` | Recipient person IDs, optional related work, public evidence URL |
| `social_profiles` | `social_profile_id` | Platform, URL, verification, consent, publication status |
| `assets` | `asset_id` | Person, path, source verification, consent, rights, publication status |

Use protected lookup ranges and dropdown validation for IDs, roles, statuses, institutions, programs, works, verification, consent, rights, and publication states. Do not use display names as foreign keys. Keep audit/evidence columns beside the status they support. Prefer append-only engagement/contribution history over changing a person's canonical ID when their role changes.

Refresh sequence:

1. Export or sync only through an authorized local process into `data/raw/google-sheet-snapshot.json`.
2. Normalize explicitly (the npm shortcut uses these defaults):

   ```sh
   node tools/normalize-data.mjs \
     --input data/raw/google-sheet-snapshot.json \
     --output-dir data/generated
   ```

3. Review changes in `data/generated/`, especially IDs, renamed dimensions, contributions, social URLs, image assets, and placeholder bios.
4. Run `npm run build`. This repeats validation and tests, creates the allowlisted artifact, and validates `dist/`.
5. Commit public source/generated files only. Never add the raw snapshot, contact columns, downloaded CVs, cookies, or credentials.

For the controlled return trip to Google Sheet, run the exporter against both sides of the local boundary:

```sh
node tools/export-sheet-tabs.mjs \
  --snapshot data/raw/google-sheet-snapshot.json \
  --site-data data/generated/site-data.json
```

Append a positional `<tab-name>` to emit only one structured tab payload. The exporter merges the reviewed normalized records with private social/asset candidates and their review fields from the ignored raw snapshot, preserving those candidates across a roundtrip. The normalizer never promotes a candidate merely because it exists: private candidate URLs, handles, source URLs, evidence, permission records, and review notes remain raw-only unless the public gates explicitly produce an approved public field.

Apply an exported payload only through an authorized local Sheet session and verify the target spreadsheet before writing. A complete workbook payload can contain private social/asset candidates and internal contacts; never save it in the repository, attach it to CI logs, or publish it as an artifact. GitHub Actions must never fetch from or write to Google Sheets, and must never receive a raw snapshot or Google credentials. The detailed tab/enum contract is in `docs/data-dictionary.md`, and the public JSON contract is in `data/schema/site-data.schema.json`.

For role-aware education display:

- Full-time staff: show standardized degree/qualification plus the institution.
- Intern: show standardized program plus the institution.
- Part-time or mixed history: use the engagement relevant to the selected period and avoid implying a current role from an old education record.
- Masonry card: short institution/program labels.
- Detail dialog: official full institution/program labels.
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
| `#people-board` | masonry result board |
| `#person-dialog`, `#modal-close` | complete person detail dialog |

Cards must be keyboard-operable `.person-card` buttons. Small screens keep search compact and move secondary filters into `#filter-dialog`. Unapproved or broken person images fall back to `.avatar-initials`.

The app fetches `./data/generated/site-data.json`; keep URLs relative so project Pages works under `/Landom/`.

Discovery uses one canonical URL, `https://montri-th.github.io/Landom/`, shared by HTML, `robots.txt`, and `sitemap.xml`. The horizontal header lockup is prohibited as a favicon, compact icon, or `og:image`; leave those roles absent until separately approved assets exist.

## 6. Social and image approval gate

Current release behavior, following the owner instruction for this directory, renders all 48 core profile records. `people.publication.consentStatus=pending` does not suppress the core card or detail record; it blocks direct social links and portrait assets. Placeholder bio text remains visibly provisional and `owner_pending`. If policy later changes to require per-person opt-in for the core registry itself, update the data contract, validator, and UI filtering together rather than silently reusing the social/asset gate.

Private social and asset review columns use only these enums:

| Gate | Exact allowed values |
|---|---|
| verification | `owner_review_required`, `verified`, `rejected`, `missing` |
| consent | `granted`, `pending`, `denied` |
| rights | `cleared`, `pending`, `denied`, `revoked` |
| publication | `publishable`, `withheld_pending_*`, `withdrawn` |

`withheld_pending_*` denotes the controlled family of reason-specific pending states (for example, pending consent or rights). It never passes the publication gate. `withdrawn` is terminal for public display until a new, evidenced review changes the record; it is not interchangeable with `pending`.

Public social records require all of the following:

1. the profile is matched to the person with recorded evidence;
2. `verificationStatus` is `verified`;
3. both the profile and person have `consentStatus: granted`;
4. `publicationStatus` is `publishable`.

Do not infer consent from following/follower visibility or from an open browser session. Store no session cookie, internal follower list, private message, email, phone, Line, Discord, or CV identifier in public JSON.

Person-image records additionally require `rightsStatus: cleared` and `publicationStatus: publishable`. Copy approved images into `public/assets/people/` using the canonical person ID rather than an original social filename. Every file there must have a matching fully approved `assets[]` record. Failed, pending, revoked, missing, or broken assets render initials.

The brand lockup policy is separately recorded in `docs/assets-manifest.json`. Validate its checksum after any asset replacement.

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
- keyboard, visible focus, screen-reader labels, reduced motion, and dialog focus containment;
- final human review of institution/program canonicalization and product naming against the same CityMETER release;
- individual confirmation of placeholder bios;
- evidence, consent, and rights review for every newly published social link or person image.

Until those are checked on the released bytes, report them as open manual gates rather than passed.
