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

- `normalize` reads an authorized local file at `data/raw/google-sheet-snapshot.json` and deterministically rewrites public files in `data/generated/`. The private `data/raw/` directory is ignored by Git. The normalizer detects either a Sheet-style `sheets` map whose values are row arrays (header row first), or an exporter-shaped `tabs` map whose values contain `headers` and `rows`.
- `validate` checks IDs, foreign keys, at least one contribution per person, Oat's two separate works, public-consent gates, asset approvals, canonical naming, privacy leaks, and required UI controls.
- `test` exercises positive and negative data/privacy contracts plus the integrated source.
- `build` validates and copies only `index.html`, `robots.txt`, `sitemap.xml`, `src/`, `public/`, and `data/generated/` into `dist/`. It writes a timestamp-free SHA-256 manifest for reproducibility, then validates the finished artifact.

To use non-default local paths, pass them explicitly:

```sh
node tools/normalize-data.mjs \
  --input data/raw/google-sheet-snapshot.json \
  --output-dir data/generated

node tools/export-sheet-tabs.mjs \
  --snapshot data/raw/google-sheet-snapshot.json \
  --site-data data/generated/site-data.json
```

The exporter performs the return half of the controlled Sheet roundtrip: it combines the reviewed normalized records with private social and asset candidates preserved in the ignored raw snapshot. Those candidates remain raw-only; they must not be copied into `data/generated/`, repository source, logs, or build artifacts. A positional tab name may be appended to export only that tab.

CI builds the reviewed, committed `data/generated/` projection only. It never reads or writes the ignored raw snapshot, contacts Google Sheets, or uses Google credentials; remote import and writeback are authorized local operations only.

To inspect the built site locally, serve `dist/` over HTTP rather than opening the HTML file directly. For example:

```sh
python3 -m http.server 4173 --directory dist
```

Then open `http://localhost:4173/`.

## Public data contract

The UI reads `./data/generated/site-data.json`. Its public dimensions are:

`institutions`, `programs`, `educationRecords`, `people`, `engagements`, `works`, `contributions`, `achievements`, `socialProfiles`, and `assets`.

Person IDs have one canonical version only:

- `S0001` — full-time staff
- `P0001` — part-time staff
- `I0001` — intern

A person who changes role keeps one person record and one canonical ID; role periods live in `engagements`. Cards use standardized short institution/program labels. Profile details use standardized official names. Full-time profiles prioritize degree and institution; intern profiles prioritize program and institution. Missing academic fields are labelled as pending confirmation instead of repeating a university name as a program.

Every public person must resolve to at least one contribution. `Land Portfolio` and `Lead2Loan` are separate work records and separate contributions, including for Oat.

Developer references: [data dictionary](docs/data-dictionary.md), [JSON Schema](data/schema/site-data.schema.json), and [implementation handoff](docs/implementation-handoff.md).

## Privacy and assets

- Current release behavior follows the owner instruction to render all 48 core registry profiles. A pending `people.publication.consentStatus` is not a UI filter for the core name/role/education/contribution card; it gates direct social links and portrait assets. This does not claim individual approval of placeholder bio copy, which remains `owner_pending` until confirmed.
- `contacts_internal`, email, phone, Line, Discord, CV file IDs, raw sheet rows, credentials, and private notes must never enter source-facing UI files or `dist/`.
- A social URL is public only when its record is verified, consented, and explicitly marked for public publication. A person's publication consent must also pass.
- A person image renders only through an `assets[]` record whose source, consent, rights, and publication gates all pass. Otherwise the UI renders initials.
- Private social and asset workflow fields use these exact value sets: verification `owner_review_required | verified | rejected | missing`; consent `granted | pending | denied`; rights `cleared | pending | denied | revoked`; publication `publishable | withheld_pending_* | withdrawn`. `withheld_pending_*` is the reserved family of explicit pending-reason statuses, not a publishable state.
- The horizontal Landometer logo is approved only as the header lockup. Its checksum and role restrictions are in `docs/assets-manifest.json`; it is not a favicon or person avatar.
- `robots.txt`, `sitemap.xml`, and the HTML canonical link all resolve to the single public `/Landom/` route. No favicon or social preview image is claimed until a separate compact asset is explicitly approved.

## Interface contract

Language and theme controls follow the interaction pattern of the Landometer reference site. The source-of-truth hooks are listed in `docs/implementation-handoff.md` and enforced by validation.

On small screens, search remains compact and the filters open in a bottom-sheet dialog instead of permanently occupying the viewport. Cards are keyboard-operable buttons; full records open in an accessible detail dialog.

## Publishing

`.github/workflows/pages.yml` validates every pull request. A successful build on `main` uploads the exact `dist/` artifact, deploys it with GitHub Pages, then smoke-tests the live HTML and generated JSON.

Repository setup required once: in **Settings → Pages**, select **GitHub Actions** as the source. A local build or a pushed commit is not proof of a live release; use the terminal deployment result and live smoke test.

See [the implementation handoff](docs/implementation-handoff.md) for data maintenance, controlled Sheet writeback, asset intake, release gates, and known manual checks.
