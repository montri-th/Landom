# Design QA — DS 0.9.1, animated Landometer motifs, and Landom motion

Date: 2026-09-10

Status: **IMPLEMENTATION RECORD — source, build, rendered, accessibility, and deployed-byte gates must be rerun for the final release commit**

## Authority and conformance boundary

- Visual and interaction authority: Landometer Design System `0.9.1`, authoring revision `0.9.1-r8`, ruleset `lds-rules-0.9.1`, machine package `v0.9.1-mp7`.
- Audience color authority: exact `color-srgb-05.production.css`, SHA-256 `3bac2499df594bbf6b016b650ee7763f7ec093e33bc5f28239144e0677281d5c`. Raw provenance token, scale, and delivery CSS files are not audience assets.
- Animated-brand authority: motif release `1.2.1`, family `landometer.motif.v3`, using exact role-scoped runtime and fallback bytes recorded in `docs/assets-manifest.json`.
- The owner-supplied navbar handoff, earlier Riddim proposal, `rebuild02` comparison surface, and previous static Hero motif remain implementation lineage. They do not override the active Design System or expand asset roles.
- The owner explicitly selected the quiet variant for all six animated Landometer surfaces on this page, including the animated brand-opening logo, while retaining the existing artifact-local replay. That selection does not turn the animated logo into the official navigation identity.
- Photo parallax remains an owner-directed Landom site behavior. Design System 0.9.1 prohibits parallax and accepts no artifact exception references. Therefore the page may accurately identify the Design System release it applies, but it must not claim zero-exception v0.9.1 artifact conformance while parallax remains enabled. All other applicable resolved rules remain release requirements.

## Intended implementation

- The sticky header retains the official static Landometer horizontal lockup, `/ Landom` indicator, CityMETER and CityWiki links, one join-team CTA, and the menu trigger. Quiet animated logo assembly is separate Hero decoration, never the navbar/footer lockup, favicon, social image, or person identity.
- Every header/menu state retains a direct semantic target of at least 44 × 44 CSS px. Calm presentation may change surface and hierarchy but may not scale interactive controls into proxy-hit-area activation.
- The join-team discovery cue runs once on first eligible entry, finishes in 540 ms with `cubic-bezier(.16,1,.3,1)`, uses the governed 28% sweep band from -120% to +120%, and never flickers or loops. Reduced motion and observer failure use the complete static CTA.
- The menu retains focus containment, Escape and scrim close, focus return, real sibling-language routes, ecosystem destinations, and the single truthful `#people` page anchor. The one-item fixed bookmark rail stays removed.
- Approach motion uses the approved Riddim roles `approach.soft`, `approach.inline-start`, `approach.inline-end`, `media.arrival`, and `stagger.child`; opacity resolves in 760 ms, transform in 920 ms, media arrival in 900 ms, block/inline distances are 32/36 px, scale starts at `.985`, and stagger uses 150 ms steps capped at 450 ms. The shared observer uses threshold `.14`, bottom root margin `-12%`, a 2,400 ms watchdog, and fail-open lifecycle handling. Hero/LCP, navigation, controls, alerts/status/live regions, focused/deep-linked content, and critical proof remain final and immediately operable.
- Owner-directed photo parallax is limited to governed Hero and portrait photographs, is bounded by supplied image bleed, and fails static for reduced motion, print, save-data, unsupported APIs, page hiding, and teardown. Logos, motifs, icons, and certificates never receive photo parallax.
- The footer follows the Landometer/rebuild02 contact family without a Hello form. Corporate Facebook, Instagram, TikTok, LinkedIn, and X remain separate from person-level LinkedIn/GitHub-only controls.

## Motif inventory and lifecycle

| Release asset | Page role | Exact final-state fallback | Bytes | SHA-256 |
|---|---|---|---:|---|
| `landometer.logo.quiet` | Hero brand opening | `public/assets/landometer/svg/logo-quiet.svg` | 1,979 | `5b6798cdb6c3ada246286e6ce3386644f383c4f987a267e5c5db392809403e14` |
| `landometer.rings.quiet` | Hero spatial/depth layer | `public/assets/landometer/svg/rings-quiet.svg` | 833 | `d494be1f72e833704cd3c20d9d41f60599991d6efd5f670a86e40a7296eb566b` |
| `landometer.dial.quiet` | Directory section opener | `public/assets/landometer/svg/dial-quiet.svg` | 733 | `2e624d80b604891ad2ed3e4d5cc6268d2383f39f740ef1def5012c49aee0da1f` |
| `landometer.layers.quiet` | Profile/detail decorative hover | `public/assets/landometer/svg/layers-quiet.svg` | 1,274 | `e3e2bf65bcd38d34d0a07910bef44917eab76fdaf097131ec133d163f6a65a03` |
| `landometer.slice.quiet` | Action/map CTA decorative hover | `public/assets/landometer/svg/slice-quiet.svg` | 350 | `c72114d43b81584cbb46251a5519f768087259bf135216f6ea7933a83df4de6b` |
| `landometer.cultivate.quiet` | Footer closer | `public/assets/landometer/svg/cultivate-quiet.svg` | 1,190 | `edf8538107d30b078f0d7657bac054722ee88bdc10ddf7db00e63f44d077935f` |

The exact runtime is `public/assets/landometer/landometer-motifs.css` plus `public/assets/landometer/landometer-motifs.js`. Static or generated source markup keeps the matching complete fallback visible until `<lm-motif>` upgrades and its dependencies are ready. The manifest motion mode remains `finite_once`; the existing artifact-local loop/replay cadence remains a separately owner-approved Landom page-controller decision and is not a portable Design System default. Quiet variants keep the runtime's default Energy Sky ink so runtime and exact fallback palettes agree. Quiet-logo animation reaches its authored final state at 3,360 ms; hold the complete final state from at least 3,400 ms before any replay. Do not use the historical 2,050 ms cutoff or a cyan wedge override.

One controller owns each timer and the page-level pause/resume state. A surface is eligible only when at least 14% visible, the document is visible, reduced motion is not requested, and page motion is not paused. Offscreen, `visibilitychange`, `pagehide`, reduced motion, print, runtime failure, and no JavaScript retain the exact complete SVG state. Persisted `pageshow` resumes only eligible surfaces. Automatic cycles do not announce through an ARIA live region.

## Automated release coverage required

The repository validator, tests, build manifest, and Pages smoke test must bind and verify:

- exact DS tuple and the audience-safe production-color hash;
- Thai and English initial-HTML parity, canonical routes, reciprocal language links, and truthful structured data;
- direct 44 × 44 header/menu targets, accessible menu state, and the finite once-only CTA cue with reduced-motion and observer-failure static states;
- approved Riddim roles, timings, one-observer/fail-open lifecycle, and exclusion of critical content;
- explicit recording and containment of the owner-directed photo-parallax divergence without a zero-exception conformance claim;
- exact MIME type, SHA-256, source-to-build parity, and live bytes for both motif runtime files and all six SVG fallbacks;
- one motion owner per surface, no accumulating DOM/timers/network transfer, pause/resume, visibility, BFCache, reduced-motion, print, no-JavaScript, and failed-runtime behavior;
- outline Material Symbols only at `FILL 0`, weight 300, with the unused filled `groups` record excluded from the active font manifest;
- footer destination semantics, no Hello form, five corporate social destinations, and LinkedIn/GitHub-only person controls;
- unchanged governed data, portrait, certificate, Hero-photo, social-preview, favicon, and official-lockup bytes unless a separately reviewed record says otherwise.

## Rendered and interaction gates

| Priority | Check | Required release evidence |
|---|---|---|
| P0 | Header/menu keyboard, focus containment/return, Escape/scrim close, direct 44 × 44 controls, no proxy activation, and no overflow. | Fresh source plus rendered interaction receipt |
| P0 | Reduced motion, print, no JavaScript, and failed motif runtime show complete content, actions, and exact SVG final states. | Fresh fail-open screenshots/runtime assertions |
| P0 | CTA highlight appears once, completes within 540 ms, never flickers/repeats, and leaves the label fully readable. | Fresh two-entry observation plus automated timing assertion |
| P0 | Motif CSS, JavaScript, and six fallbacks match the recorded hashes in source, build, and canonical HTTPS responses. | Build-manifest and deployed-byte receipt |
| P1 | Approach motion uses the approved roles/timings and never delays Hero/LCP, controls, live content, focused/deep-linked content, or critical proof. | Fresh normal/reduced-motion observation |
| P1 | Motif stages remain stable and unclipped at 320, 360, 390, tablet, and wide desktop widths in light/dark/system themes. | Fresh responsive screenshots |
| P1 | Thai 130%, browser 200%, and 400% reflow retain readable headings, complete CTA labels, operable controls, and no horizontal overflow. | Fresh accessibility fixtures |
| P1 | Page pause/resume, offscreen exit, `visibilitychange`, `pagehide`, and persisted `pageshow` leave no stale timer or duplicate component. | Two-cycle lifecycle trace |
| P1 | Owner-directed photo parallax remains bounded and static in reduced motion, print, save-data, and unsupported/lifecycle states; brand/evidence assets never move. | Fresh divergence-specific interaction review |
| P2 | External product, ecosystem, office-map, social, privacy, and join-team destinations resolve to their stated outcomes. | Fresh canonical-origin destination check |

Record the final commit, GitHub Pages run, canonical URL, tested time, and live hashes only after those checks pass. A previous local or live pass cannot attest a newer commit. Because photo parallax remains, the release record must continue to say that zero-exception Design System 0.9.1 conformance is not claimed.
