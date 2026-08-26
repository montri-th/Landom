# Design QA — Community constellation Hero

Date: 2026-08-26
Status: **BLOCKED — rendered browser comparison unavailable**

## Reference and implementation scope

- Reference: owner-selected community-constellation Hero concept (option 3) and the owner-annotated follow-up showing the lower-right circular image replacement.
- Implementation: the existing Hero layout remains unchanged after the follow-up; only the image in `.hero-moment--work` changed to `public/assets/hero/landom-community-citymeter.jpg`.
- The CityMETER asset is a deterministic 960×960 sRGB crop of `S__958473.jpg`. Visual source inspection confirms that all four people and the CityMETER display remain visible in the governed square asset.

## Source-level QA completed

- Hero HTML uses one anchor photograph and three decorative circular moments with intrinsic image dimensions.
- The CityMETER replacement occupies the same element and CSS selector as the previous work-session image, so its dimensions, position, border, and responsive behavior are unchanged.
- Desktop and mobile Hero selectors keep bounded widths, declared aspect ratios, overflow clipping, and no horizontal-scroll dependency.
- Thai and English Hero copy remain unchanged.
- Asset rights, source provenance, hashes, allowed role, and prohibited roles are recorded in `docs/assets-manifest.json`.
- Source and distribution validation passed; all 62 automated tests passed.

## Blocker

The in-app browser refused the local preview URL because its admin-enforced security policy could not be verified. The security control was not bypassed. As a result, no fresh rendered desktop/mobile screenshots or pixel-level reference comparison could be produced for this release.

## Remaining visual checks

| Priority | Check | Status |
| --- | --- | --- |
| P1 | Confirm the lower-right circle shows all four people and enough of the CityMETER display at the deployed desktop crop. | Pending rendered review |
| P1 | Confirm the three circular moments and count summary do not collide at the 760–1040 px transition. | Pending rendered review |
| P2 | Confirm the mobile thumbnail row remains balanced at 320 px width and Thai/English headings do not force overflow. | Pending rendered review |

No pixel-perfect or browser-rendered design QA claim is made while this blocker remains.
