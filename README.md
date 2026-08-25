# Landom people & contribution registry

Static, privacy-aware community directory for **Landom**. The site turns an authorized Google Sheet export into a standardized public dataset, a responsive masonry board, and full profile details. It deploys to GitHub Pages without runtime credentials or a backend.

> แลนด้อมของคนที่อยากเข้าใจเมืองและช่วยกันทำให้ดีขึ้น

## Naming contract

- `Landometer` is the brand and shared portfolio/methodology layer.
- `Landom` is the community name. Use this exact case; never `LanDOM`.
- Thai member labels are `ชาว Landom` or `ชาวแลนด้อม`.
- CityMETER works use the current product naming pattern, for example `CityMETER: School`. Do not publish `CityMERE`, `Citymeter`, or a space before the colon.
- Cross-product or cross-city comparisons must use the same schema/release. If they do not, state the incompatibility instead of presenting them as directly comparable.
- Keep evidence boundaries product-specific. A capability observed in one product is not automatically a shared Landometer capability.

## Local workflow

Requires Node.js 20 or newer. There are no runtime dependencies.

```sh
npm run normalize
npm run validate
npm test
npm run build
```

- `normalize` reads an authorized local file at `data/raw/google-sheet-snapshot.json`, applies the reviewed contracts in `data/approved/` (including `profile-detail-overrides.json` and `person-identity-overrides.json`), and deterministically rewrites public files in `data/generated/`. The private `data/raw/` directory is ignored by Git. The normalizer detects either a Sheet-style `sheets` map whose values are row arrays (header row first), or an exporter-shaped `tabs` map whose values contain `headers` and `rows`.
- `validate` checks IDs, foreign keys, at least one contribution per person, Oat's two separate works, public-consent gates, asset approvals, canonical naming, privacy leaks, and required UI controls.
- `test` exercises positive and negative data/privacy contracts plus the integrated source.
- `build` validates and copies only `index.html`, `llms.txt`, `robots.txt`, `sitemap.xml`, `src/`, `public/`, and `data/generated/` into `dist/`, then creates the reviewed crawlable English entry point at `/en/`. It writes a timestamp-free SHA-256 manifest for reproducibility, then validates the finished artifact.

To use non-default local paths, pass them explicitly:

```sh
node tools/normalize-data.mjs \
  --input data/raw/google-sheet-snapshot.json \
  --output-dir data/generated

node tools/export-sheet-tabs.mjs \
  --snapshot data/raw/google-sheet-snapshot.json \
  --site-data data/generated/site-data.json \
  --output /private/tmp/landom-sheet-tabs-v3.4.0.json
```

The exporter performs the return half of the controlled Sheet roundtrip: it combines the reviewed normalized records with private social and asset candidates preserved in the ignored raw snapshot. Those candidates remain raw-only; they must not be copied into `data/generated/`, repository source, logs, or build artifacts. Use `--output` with a private path so a full payload is not printed to a terminal log. A positional tab name may be appended to export only that tab.

CI builds the reviewed, committed `data/generated/` projection only. It never reads or writes the ignored raw snapshot, contacts Google Sheets, or uses Google credentials; remote import and writeback are authorized local operations only.

To inspect the built site locally, serve `dist/` over HTTP rather than opening the HTML file directly. For example:

```sh
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173/`.

## Public data contract

The UI reads `./data/generated/site-data.json`. Its public dimensions are:

Public data schema `1.5.0` includes `institutions`, `programs`, `educationRecords`, `people`, `engagements`, `works`, `contributions`, `achievements`, external `publications`, `socialProfiles`, `assets`, and governed `certificates`. Institution and program records expose only exact verified official LinkedIn profiles through nullable `linkedinUrl` fields; a missing exact page remains `null` rather than being inferred from a faculty or similarly named organization. External publications require an exact author match and bibliographic evidence and never become Landometer works or contributions.

Person IDs have one canonical version only:

- `S0001` — full-time staff
- `P0001` — part-time staff
- `I0001` — intern

A person who changes role keeps one person record and one canonical ID; role periods live in `engagements`. Praewa (`I0003`), Pat (`S0003`), Mos (`I0014`) and Faze (`I0015`) retain their post-internship Part-time periods, while Pat continues to Full-time; Grace (`I0018`) keeps MSI 2025 and a separate PDI 2026 period. Team (`I0033`) completed PDI at the end of July 2026. Biw (`S0005`) is current Full-time staff from 2019; Nat (`S0006`) and Pote (`S0007`) are current Full-time staff from 2018. Cards use standardized short institution/program labels. Profile details use standardized official names. Full-time and Part-time staff profiles prioritize degree, field, and institution when evidence exists; intern profiles prioritize program and institution. `degree.awardStatus` and `degree.personalAwardVerified` keep program nomenclature separate from person-level completion evidence. The directory owner explicitly confirmed completed degrees for the four existing full-time records, Nat, Pote, and Sek; Biw retains no public degree claim because no education evidence has been supplied.

Thai education copy uses `นิสิต` only when the displayed education record has `institutionId: inst-chula`; other institutions keep the generic student noun. `educationProgram` supplies the verified program or qualification as context while the institution remains a visible value, never uses the literal `การศึกษาจาก`, and never claims degree completion when `degree` is null. The canonical Sheet FK for `I0029` is corrected at `people_registry!I34` from secondary record `EDU0033` to primary record `EDU0032`.

Internship and cooperative education are stored per engagement in `academicPlacementType`; the UI never infers them from cohort text. The current public co-op set is exactly `I0003`, `I0030`, `I0031`, `I0034`, `I0036`, and `I0039`. A seventh owner-confirmed participant remains in the private Shortlisted recruitment registry until a started engagement and at least one contribution can be verified.

Every public person must resolve to at least one contribution. `Land Portfolio` and `Lead2Loan` are separate work records and separate contributions, including for Oat.

Works expose localized `catalogUrl.th/en` only where the route was verified, keep `destinationUrl` null when no exact work destination is known, and record `linkEvidence.linkScope` so a broad product catalog is never misrepresented as a work-specific page. `DWR Water Monitoring Telemetry` / `โทรมาตร กรมทรัพยากรน้ำ` is the evidence-backed exception with the exact official destination `https://telemetry.dwr.go.th/`. FDI uses the exact UI label `Full-stack Developer Intern, FDI`; the Thai short label for Computer Engineering is `วิศวกรรมคอมพิวเตอร์` and the English short label is `CP`. FDI/PDI/MSI contributions use `Software development` / `Product development` / `Go-to-market`; IMP uses `ที่ปรึกษาธุรกิจ` in Thai and `Consulting Partner` in English; CityCell award-team contributions use `Team member`.

Developer references: [data dictionary](docs/data-dictionary.md), [public JSON Schema](data/schema/site-data.schema.json), [approved detail-override schema](data/schema/profile-detail-overrides.schema.json), [approved identity-override schema](data/schema/person-identity-overrides.schema.json), and [implementation handoff](docs/implementation-handoff.md).

## Privacy and assets

- Current release behavior follows the owner instruction to render all 51 core registry profiles with bilingual `source_backed_placeholder` copy. The existing 48 profile texts remain byte-for-byte unchanged. Twenty-five are concise paraphrases of first-person application answers matched exactly to the core roster. The other 26 are explicitly labelled `factual_fallback` and use bounded synthesis from reconciled role, education, and verified-work evidence, including three conservative profiles for the new staff records. Both groups remain `pending_candidate_video_review`; provenance fields keep the two bases distinct. No raw application text, private recruitment/application Sheet ID or range, contact, score, or reviewer note is emitted. The public registry Sheet ID may remain in `meta.source` solely as provenance for the authorized core registry. A pending `people.publication.consentStatus` is not a UI filter for the core name/role/education/contribution card and does not become individual consent through owner authorization.
- Versioned profile text lives in the normalized `profile_statements` Sheet tab; `people_registry.current_statement_id` selects the current materialized copy. Unmatched applicants and all recruitment contacts, CV/video links, and reviewer notes stay in the separate private **Shortlisted recruitment** workbook.
- `contacts_internal`, email, phone, Line, Discord, CV file IDs, raw sheet rows, credentials, and private notes must never enter source-facing UI files or `dist/`.
- A social URL is public only when identity is verified, publication is `publishable`, and its basis is either recorded individual consent or scoped `owner_authorized_public_profile_link`. Owner authorization is recorded separately and must not be described as individual consent.
- A person image renders only through an `assets[]` record with exact identity, cleared rights, publishable status, a governed local path/hash, and either individual consent or scoped `owner_authorized_public_profile_portrait`. Expiring CDN/source URLs remain private; otherwise the UI renders the full nickname fallback.
- Private social and asset workflow fields use these exact value sets: verification `owner_review_required | verified | rejected | missing`; consent `granted | pending | denied`; rights `cleared | pending | denied | revoked`; publication `publishable | withheld_pending_* | withdrawn`. `withheld_pending_*` is the reserved family of explicit pending-reason statuses, not a publishable state.
- Approved portrait metadata lives in `data/approved/portrait-assets.json`; public hashes and role restrictions are also recorded in `docs/assets-manifest.json`. The horizontal Landometer logo remains approved only as the header lockup and is not a favicon or person avatar. Browser tabs use the exact 192×192 transparent compact symbol approved by Landometer Design System v0.9.0 for favicon duty only; its URL, hash, dimensions, alpha, source revision, and boundaries are pinned in `docs/identity-discovery.json`.
- This release replaces only the blank white, context-free backgrounds for `I0001`, `I0008`, `I0012`, `I0018`, `I0019`, `I0021`, `I0025`, `I0033`, and `I0035`. It composites approved DS gradients through a pixel-preserving foreground mask, keeps environmental portraits unchanged, records the exact approved recipe per asset, uses multiple recipes across the set, and assigns Diversity Spectrum to exactly one portrait.
- After each replacement, synchronize the public SHA-256/byte metadata and canonical Sheet `assets` columns R:T (`sha256`, `media_type`, `bytes`). There is no Google Drive portrait mirror for this release, so do not create or upload duplicate portrait files to Drive.
- CityMETER and other public clients can consume `data/generated/people-media.json` for stable absolute portrait URLs and full-nickname fallbacks without reconstructing paths or reading private source-profile URLs.
- Filled certificate images are governed separately by `data/approved/certificate-assets.json`, copied byte-for-byte under `public/assets/certificates/`, and emitted only through owner-authorized `certificates[]` records. QR destinations never become contribution evidence, and printed spelling/date conflicts remain explicit review flags.
- `/Landom/` is both the Thai canonical route and `x-default`; `/Landom/en/` is a crawlable English build. The two routes use reciprocal `hreflang`, localized initial HTML, text-only Open Graph/Twitter records, truthful `CollectionPage` JSON-LD, and matching sitemap entries without a duplicate Thai path. `llms.txt` is a public-safe navigation aid to the canonical pages and generated JSON; it is not permission, a ranking signal, a license, evidence, or agent authority. No apple-touch, maskable/install, or social-preview image is claimed because those roles do not yet have separate approval. Search-result favicon selection and hostname-root robots behavior remain controlled at `montri-th.github.io`, beyond an individual project subpath.

## Interface contract

Language and theme controls follow the interaction pattern of the Landometer reference site. The source-of-truth hooks are listed in `docs/implementation-handoff.md` and enforced by validation.

On small screens, search remains compact and the filters open in a bottom-sheet dialog instead of permanently occupying the viewport. Cards are keyboard-operable buttons; full records expand accessibly inside the masonry board, while certificate images use a dedicated high-resolution preview dialog.

## Publishing

`.github/workflows/pages.yml` validates every pull request. A successful build on `main` uploads the exact `dist/` artifact, deploys it with GitHub Pages, then smoke-tests the live HTML and generated JSON.

Repository setup required once: in **Settings → Pages**, select **GitHub Actions** as the source. A local build or a pushed commit is not proof of a live release; use the terminal deployment result and live smoke test.

See [the implementation handoff](docs/implementation-handoff.md) for data maintenance, controlled Sheet writeback, asset intake, release gates, and known manual checks.
