# Landom participant updates — 6 October 2026

The reviewed public projection has 53 people and 33 individual profile consents. Thirteen newly reviewed profile consents belong to `I0001`, `S0002`, `S0003`, `S0004`, `I0014`, `I0015`, `I0017`, `I0023`, `I0026`, `I0021`, `I0009`, `I0033`, and `I0043`. The 20 earlier approvals remain unchanged. The scope is Landom profiles and related work pages only; these records do not grant new rights for CityMETER or other uses.

## Corrections

- Renee (`S0002`) supplied replacement Thai profile text. `STAT-S0002-002` supersedes `STAT-S0002-001`; the old statement remains private history. Thai text is copied exactly. English is null because no English text was supplied or approved; the existing locale fallback displays Thai. Participant copy has separate provenance and null directory-owner approval.
- Film (`S0004`) corrected her degree title to รัฐประศาสนศาสตรบัณฑิต / Bachelor of Public Administration, abbreviated รป.บ. / B.P.A. The existing field, institution, and completed-degree evidence are preserved. The English nomenclature is supported by the [official NMU programme brochure](https://imd.nmu.ac.th/wp-content/uploads/2023/05/NMU-IMD-BPA-Urban-Administration-and-Management-2023-Brochure.pdf); it is not additional person-level evidence of graduation.
- Film and Mind (`I0017`) supplied replacement portraits. Both use bounded square crops from the submitted photographs, 800×800 JPEG output, and metadata stripping. No face alteration, generated background, or retouching is used.
- Mind denied LinkedIn publication. Her LinkedIn record and URL are omitted from every current public data file. The consent contract records only person ID, platform, and denial.

## Scope preservation

The late-evening review adds Ham (`I0009`), Teema (`I0033`), and Draf (`I0043`). Draf approves the existing profile, portrait and LinkedIn, but denies GitHub. The denied GitHub record and URL are omitted entirely from the current public graph. Teema's Thai nickname is corrected to **ธีม** in the card, profile copy and portrait alternative text. His study period is **2022–2026** in both locales; degree-award status is `under_review` because no completed award was confirmed. Existing English nickname copy remains unchanged because no replacement English spelling was supplied.

Ham approves the existing profile, portrait and verified LinkedIn. A newly supplied GitHub candidate has consent but remains private and `withheld_pending_verification`: the account exists, but the required name plus university/employer match is not available. Consent and identity verification are separate gates.

Pat (`S0003`), Faze (`I0015`), Tim (`I0023`), and Film (`S0004`) have consent for their existing profile, portrait and verified social links under the owner's confirmation of their general affirmative replies. Pleng EBA (`I0021`, Nichapa Wattanachai) replied via LinkedIn; her profile, existing portrait and verified LinkedIn link are approved under the owner's confirmed scope. Private evidence distinguishes the participant's exact words from the owner's scope interpretation. Unsupplied or unverified accounts remain withheld. Pote (`S0007`) continues to have no public portrait. Explicit refusals remain in effect.

The current public portrait hashes are:

| Person | Public file | Bytes | SHA-256 |
|---|---|---:|---|
| I0017 | `public/assets/people/I0017.jpg` | 113435 | `238984377a40663e95cfc9efb64ba2d71765ce26cda7b38c4cc30ef52c874df1` |
| S0004 | `public/assets/people/S0004.jpg` | 129779 | `bc01b402dbfbab31448fac5811e06fd793f170c6c97f7c156e2810b281e79021` |

Public profile image URLs carry the hash prefix as a cache revision. The media projection, asset records, approved portrait inventory, and asset manifest refer to the same image bytes.

## Maintenance and release boundary

This update starts from the reviewed public graph at commit `6b574b5f6288ac78642c51d9a93f93cec8db88ab` and applies only the reviewed changes. No stale or missing raw snapshot is normalized. The source snapshot timestamp remains unchanged; `dataUpdatedAt` and `reviewedAt` are `2026-10-06`.

Run `npm run build` to validate source, tests, assets, public-data boundaries, and the finished deployment artifact. Private-source tests are skipped if the authorized raw snapshot is absent. GitHub Pages publication must still pass the deployed manifest and image checks. This repository updates the GitHub Pages site; production integration at `landometer.com/v3/landom` is a separate step.

Mailbox addresses, message and attachment IDs, private consent evidence, tax-document status, and document images are excluded from the repository and deployment artifact. The existing Design System binding and layout are preserved.
