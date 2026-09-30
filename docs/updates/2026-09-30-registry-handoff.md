# Landom registry update — 30 September 2026

The owner requested updating `montri-th/Landom` first so the development team can carry the reviewed changes to `https://landometer.com/v3/landom`. This change updates the source and its GitHub Pages preview. It does not modify the production Landometer database.

## Reviewed changes

| Person | Change |
|---|---|
| คิว / I0045 | Add CU CEDT cooperative-education participant from 1 August 2026; religious-places development and fuel-station improvement are both in progress. No finished-work claim, English-name transliteration, degree-completion claim, or profile statement is invented. |
| โซ่ / I0044 | Correct start to 18 August 2026, credit ijji support alongside Renee, retain approved education and bio, use participant-submitted portrait and LinkedIn. |
| เคน / I0030 | Add software-development credit for CityMETER Non-bank and the owner-supplied exact module destination. |
| ดาด้า / I0029 | Set MSI E0038 to 21 January–5 February 2026; preserve the separate IMP 2025 history. Do not relabel the 2026 MSI start as first-ever participation while the earlier history remains. |
| แดน / I0040 | Set E0050 to 16 May–1 September 2026, completed/alumni. |
| มุก BAScii / I0041 | Preserve the latest correction: 19 May–17 July 2026. |
| ฟรัง / I0028 | Replace portrait with the participant-submitted photograph. |
| โปเต้ / S0007 | Preserve the explicit no-portrait choice even though profile and social publication are accepted. |

Twelve participant responses are recorded as scoped consent. Nonrespondents keep their existing evidence state; publication authorization from the directory owner remains separate from individual consent. Email bodies, sender addresses, message IDs, tax-document status, and unanswered-recipient lists are not part of this public repository.

The 52 existing profile texts are unchanged. Q's statement is deferred in `data/approved/profile-copy.json`. Q has a truthful nickname fallback because no suitable verified portrait is available. Do not extract a private application-video frame or substitute a similarly named person's photograph.

## Files for integration

- `data/generated/site-data.json` is the complete reviewed public graph.
- `data/generated/people-media.json` provides governed absolute portrait URLs, revisions, and nickname fallbacks.
- `public/assets/people/I0028.jpg` and `I0044.jpg` contain the new prepared portraits. Their hashes and roles are recorded in `data/approved/portrait-assets.json` and `docs/assets-manifest.json`.
- `data/approved/profile-detail-overrides.json` records scoped identity, chronology, education, and contribution changes.
- `data/approved/publication-consent.json` applies consent independently to profile, the exact portrait hash, and exact LinkedIn/GitHub URLs. A mismatch must fail rather than approve a different asset or account.

Use canonical person, engagement, and work IDs for matching. Existing education IDs are retained; a newer Sheet export has conflicting education IDs for Sorso, Nat, Pote, and Sek, so do not replace relations by row number. This task did not write back to the Google Sheet.

## Production adapter requirements

Read the current production records and merge the reviewed changes. Preserve private fields and unrelated children; the public graph is not a complete admin-record replacement. Preserve the older local owner-confirmed timelines rather than overwriting them with stale Sheet values.

Month-precision dates are intentional. An adapter that accepts only full dates must not invent the first or last day of a month. The aggregate first-joined date for Dada and conflicting start dates for May require the existing evidence boundary to be retained.

The known production admin schema has no arbitrary work destination field. Preserve the exact Non-bank destination `https://landometer.com/v3/citymeter?d=nonBank` through a supported integration; do not guess a module slug. A successful repository build or GitHub Pages deployment does not demonstrate production-data parity.

After integration, read back the production graph, verify both new image versions, and inspect Thai/English cards and details at mobile and desktop widths. Respect Q's pending statement and Pote's no-photo choice.

## Validation

Run `npm run normalize`, then `npm run build`. The build validates the graph, publication boundaries, media hashes, UI contracts, test suite, and finished `dist/` artifact. Retain the repository's explicitly pinned Design System 0.9.1-r8/mp7 presentation; this data update does not migrate the design system.

The update passed all 85 tests and source/dist validation. Rendered portraits and profile details were reviewed at desktop and mobile widths in Thai and English. `meta.generatedAt` identifies the deterministic projection release date; `meta.source.snapshotFetchedAt` retains the original input snapshot date. Use `meta.dataUpdatedAt` for the latest reviewed data date.
