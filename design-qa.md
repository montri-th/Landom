# Design QA — Unified navigation, Riddim approach motion, and Community constellation Hero

Date: 2026-08-30

Status: **LOCAL PASS — source/build and browser-rendered gates pass; provider/live gates remain open**

## Reference and authority boundary

- Visual comparison surface: `https://montri-th.github.io/rebuild02/Landometer-Home-TH.dc.html`, which is being revised in parallel. Immediately before release on 2026-08-30 it exposed `data-ds-version="0.9.0"`, `og:updated_time="2026-08-30"`, the reviewed unified-header destinations, the UUID-scoped DS stylesheet plus `site.css`, and `site.js`; it did not expose a build or source-commit marker.
- Navigation input: owner-supplied `Unified navbar design handoff r7.zip`.
- Motion input: owner-supplied `landometer-design-system-v0.9.0-riddim-approach-motion.proposal.md`.
- Hero input: the previously owner-selected community-constellation concept and annotated CityMETER-circle replacement.
- The handoff and motion proposal are design evidence, not a normative Design System release. This implementation is an owner-directed local alignment for Landom; it keeps the approved horizontal logo and `data-ds-version="0.9.0"`.

## Intended implementation

- The sticky header uses the approved Landometer lockup, `/ Landom` product indicator, CityMETER and CityWiki links, one join-team CTA, and a menu trigger.
- The mobile header keeps identity plus the menu trigger. Preferences, language, the join-team CTA, ecosystem destinations, and the one truthful page anchor move into the menu.
- The desktop bookmark rail points only to `#people`; no certificate shortcut is shown because no page-level certificate section exists.
- The calm state implements the r7 76→29 px desktop and 68→27 px mobile heights, 200% row width with `scale(.5)` at 72% opacity, and 26% canvas/20% hairline glass. It restores prominence at the top, on upward scroll, pointer/focus intent, menu-open state, and reduced motion.
- The desktop and mobile join-team actions carry the owner-approved r7 exception: an `aria-hidden`, pointer-inert yellow text overlay with `lmSweep 3.7s` and `lmFlick 1.09s`, including full-word beats at 23–27%, 53–55%, and 84–89%. Reduced motion removes the loop and shows the final operable CTA immediately.
- The menu is a modal dialog with focus containment, Escape close, scrim close, and trigger-focus return.
- `src/approach-motion.js` applies once-only motion only to explicit eligible units, excludes navigation/Hero/LCP/controls/live content, and fails open to visible final content.
- The existing Hero composition and all governed image bytes remain unchanged by this navigation/motion release.

## Automated release coverage

The settled local source and distribution build passed validation on 2026-08-30. The repository validator/tests and Pages workflow enforce:

- Thai and English initial-HTML parity, canonical routes, and real sibling-language links;
- required menu, CTA, `#people`, and bookmark-rail markers, with no dead `#certificates` navigation link;
- JavaScript syntax plus delivery and manifest-hash parity for `app.js`, `navigation.js`, and `approach-motion.js`;
- delivery and manifest-hash parity for all three governed Material Symbols assets, including the seven-glyph outline navigation font and the filled active-rail glyph;
- release-SHA cache busting and equality between the live manifest digest and the manifest emitted by the same workflow build;
- required menu accessibility state and reduced-motion guards;
- exact r7 deep-calm geometry, captured per-scroller direction, CTA sweep/flick timings and full-word beats, menu geometry, and the governed filled active-rail glyph;
- the reviewed Riddim threshold, root margin, watchdog, and fail-open contract;
- unchanged governed Hero, social-preview, identity, portrait, data, and discovery assets.

Local browser QA covered 320, 360, 390, 768, 1024, 1180, 1280, and 1440 px layouts in dark mode, the Thai and English entrypoints, Escape close/focus return, prominent/calm header states, non-overlapping 44 px rendered calm-state hit areas, query-preserving `#people` focus, hydrated CTA layer preservation, horizontal overflow, console errors, and the end-of-document footer tail. A browser-discovered hydration mismatch was fixed so localization updates both CTA text layers without deleting the sweep overlay; the browser then reported the exact `lmSweep`/`lmFlick` animations in both desktop and compact-menu CTAs. The 66-test build and source/distribution validators pass.

Record the released commit and Pages run only after provider success.

## Rendered and interaction gates

| Priority | Check | Status |
| --- | --- | --- |
| P0 | Desktop header: 76 px prominent at top, 29 px deep calm on downward scroll, prominent on upward scroll, no content jump or horizontal overflow. | Local browser pass |
| P0 | Keyboard menu: visible focus, focus containment, Escape/scrim close, and focus return to the trigger. | Local browser pass |
| P0 | Reduced motion: header stays prominent and every approach target is immediately visible and operable. | Automated contract pass; native manual check remains |
| P1 | Mobile header/menu at 320–430 px: 68→27 px deep calm, identity and menu fit; CTA, locale, theme, and ecosystem links remain reachable. | Local browser pass at 320, 360, and 390 px |
| P1 | Thai 130% and page 200% zoom: no clipped header/menu labels, overlapping controls, or unreachable content. | Pending rendered review |
| P1 | Approach motion: directory/footer enter once with the reviewed timing; Hero, search, alerts, controls, and focused/deep-linked content never wait for animation. | Local browser and automated contract pass |
| P1 | Hero desktop/tablet/mobile crops remain unchanged, including all four people and enough of the CityMETER display in the lower-right circle. | Local regression pass |
| P2 | External CityMETER, CityWiki, ecosystem, Landometer, and join-team destinations resolve to the intended final pages. | Pending live review |
| P2 | BFCache restore, print preview, and disclosure/profile expansion do not leave approach targets hidden. | Pending interaction review |

Native iOS/Android browser behavior remains a separate manual gate even after desktop emulation passes.
