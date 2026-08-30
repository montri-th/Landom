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
- The calm state uses bounded height changes and restores prominence at the top, on upward scroll, pointer/focus intent, menu-open state, and reduced motion. It intentionally omits `scale(.5)` and looping CTA animation.
- The menu is a modal dialog with focus containment, Escape close, scrim close, and trigger-focus return.
- `src/approach-motion.js` applies once-only motion only to explicit eligible units, excludes navigation/Hero/LCP/controls/live content, and fails open to visible final content.
- The existing Hero composition and all governed image bytes remain unchanged by this navigation/motion release.

## Automated release coverage

The settled local source and distribution build passed validation on 2026-08-30, including all 65 automated tests. The repository validator/tests and Pages workflow enforce:

- Thai and English initial-HTML parity, canonical routes, and real sibling-language links;
- required menu, CTA, `#people`, and bookmark-rail markers, with no dead `#certificates` navigation link;
- JavaScript syntax plus delivery and manifest-hash parity for `app.js`, `navigation.js`, and `approach-motion.js`;
- delivery and manifest-hash parity for both Material Symbols subsets, including the seven-glyph navigation font;
- release-SHA cache busting and equality between the live manifest digest and the manifest emitted by the same workflow build;
- required menu accessibility state and reduced-motion guards;
- the reviewed Riddim threshold, root margin, watchdog, and fail-open contract;
- unchanged governed Hero, social-preview, identity, portrait, data, and discovery assets.

Local browser QA covered desktop, 390 px, and 320 px layouts in dark mode, the Thai and English entrypoints, menu focus wrapping in both directions, Escape close/focus return, prominent/calm header states, horizontal overflow, console errors, and the once-only motion settle state. A browser-discovered end-of-document threshold edge case was fixed so the final footer peer cannot remain hidden when the page cannot scroll far enough to cross the observer's shortened root.

Record the released commit and Pages run only after provider success.

## Rendered and interaction gates

| Priority | Check | Status |
| --- | --- | --- |
| P0 | Desktop header: prominent at top, calm on downward scroll, prominent on upward scroll, no content jump or horizontal overflow. | Local browser pass |
| P0 | Keyboard menu: visible focus, focus containment, Escape/scrim close, and focus return to the trigger. | Local browser pass |
| P0 | Reduced motion: header stays prominent and every approach target is immediately visible and operable. | Automated contract pass; native manual check remains |
| P1 | Mobile header/menu at 320–430 px: identity and menu fit; CTA, locale, theme, and ecosystem links remain reachable. | Local browser pass at 320 and 390 px |
| P1 | Thai 130% and page 200% zoom: no clipped header/menu labels, overlapping controls, or unreachable content. | Pending rendered review |
| P1 | Approach motion: directory/footer enter once with the reviewed timing; Hero, search, alerts, controls, and focused/deep-linked content never wait for animation. | Local browser and automated contract pass |
| P1 | Hero desktop/tablet/mobile crops remain unchanged, including all four people and enough of the CityMETER display in the lower-right circle. | Local regression pass |
| P2 | External CityMETER, CityWiki, ecosystem, Landometer, and join-team destinations resolve to the intended final pages. | Pending live review |
| P2 | BFCache restore, print preview, and disclosure/profile expansion do not leave approach targets hidden. | Pending interaction review |

Native iOS/Android browser behavior remains a separate manual gate even after desktop emulation passes.
