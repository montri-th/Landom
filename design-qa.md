# Design QA — Unified navigation, photo parallax, footer, and Community constellation Hero

Date: 2026-08-31

Status: **RELEASE CANDIDATE — local source/build gates and bounded desktop/mobile footer review passed on 2026-08-31; provider/live and named manual gates remain release-owned evidence**

## Reference and authority boundary

- Visual comparison surface: `https://montri-th.github.io/rebuild02/Landometer-Home-TH.dc.html`, which is being revised in parallel. Immediately before release on 2026-08-30 it exposed `data-ds-version="0.9.0"`, `og:updated_time="2026-08-30"`, the reviewed unified-header destinations, the UUID-scoped DS stylesheet plus `site.css`, and `site.js`; it did not expose a build or source-commit marker.
- Navigation input: owner-supplied `Unified navbar design handoff r7.zip`.
- Motion input: owner-supplied `landometer-design-system-v0.9.0-riddim-approach-motion.proposal.md`.
- Hero input: the previously owner-selected community-constellation concept and annotated CityMETER-circle replacement.
- Footer comparison surface: the contact/footer treatment on `rebuild02`, adapted locally without its Hello form.
- The handoff, motion proposal, parallax treatment, and footer adaptation are design evidence and owner-directed local decisions, not a normative Design System release. The implementation keeps the approved horizontal logo and `data-ds-version="0.9.0"`.

## Intended implementation

- The sticky header uses the approved Landometer lockup, `/ Landom` product indicator, CityMETER and CityWiki links, one join-team CTA, and a menu trigger.
- The mobile header keeps identity plus the menu trigger. Preferences, language, the join-team CTA, ecosystem destinations, and the one truthful page anchor move into the menu.
- The fixed desktop bookmark rail is removed because it duplicated the single truthful page shortcut. `#people` remains available in the menu; no certificate shortcut is shown because no page-level certificate section exists.
- The calm state implements the r7 76→29 px desktop and 68→27 px mobile heights, 200% row width with `scale(.5)` at 72% opacity, and 26% canvas/20% hairline glass. It restores prominence at the top, on upward scroll, pointer/focus intent, menu-open state, and reduced motion.
- The desktop and mobile join-team actions carry the owner-approved r7 exception: an `aria-hidden`, pointer-inert yellow text overlay with `lmSweep 3.7s` and `lmFlick 1.09s`, including full-word beats at 23–27%, 53–55%, and 84–89%. Reduced motion removes the loop and shows the final operable CTA immediately.
- The menu is a modal dialog with focus containment, Escape close, scrim close, and trigger-focus return.
- `src/approach-motion.js` applies once-only motion only to explicit eligible units, excludes navigation/Hero/LCP/controls/live content, and fails open to visible final content.
- `src/media-parallax.js` adds bounded, component-local parallax only to explicitly marked Hero photographs and governed person portraits. It uses `IntersectionObserver`, a passive scroll listener, and one `requestAnimationFrame` update; reduced motion, print, save-data, and unsupported paths remain static. Logos, icons, the Hero motif, and certificate/evidence images are excluded.
- The active filled `groups` rail font is no longer used or preloaded. The outline navigation-symbol subset remains the only navigation icon font used by the page.
- The footer follows the `rebuild02` visual family without the Hello form and exposes all five verified corporate profiles: Facebook, Instagram, TikTok, LinkedIn, and X. Person-level social controls remain restricted to approved LinkedIn and GitHub records.
- Governed image bytes and the existing Hero composition remain unchanged; parallax changes only presentation transforms on eligible photographs.

## Automated release coverage

The 2026-08-30 baseline passed source, build, and rendered validation. The current 2026-08-31 delta passed a fresh full build, source/dist validation, all 73 automated tests, and `git diff --check`. The repository validator/tests and Pages workflow enforce:

- Thai and English initial-HTML parity, canonical routes, and real sibling-language links;
- required menu, CTA, and menu-owned `#people` marker, with no fixed bookmark rail and no dead `#certificates` navigation link;
- JavaScript syntax plus delivery and manifest-hash parity for `app.js`, `navigation.js`, `approach-motion.js`, and `media-parallax.js`;
- delivery and manifest-hash parity for runtime icon assets, including the seven-glyph outline navigation font, without requiring or preloading the retired filled active-rail font;
- release-SHA cache busting and equality between the live manifest digest and the manifest emitted by the same workflow build;
- required menu accessibility state and reduced-motion guards;
- exact r7 deep-calm geometry, captured per-scroller direction, CTA sweep/flick timings and full-word beats, and menu geometry;
- the reviewed Riddim threshold, root margin, watchdog, and fail-open contract;
- bounded photo-parallax selectors and reduced-motion/print/save-data fail-static behavior, with no certificate, logo, icon, or motif opt-in;
- footer contact/link semantics, no Hello form, and the five verified corporate social destinations;
- unchanged governed Hero, social-preview, identity, portrait, data, and discovery asset bytes.

Baseline browser QA covered 320, 360, 390, 768, 1024, 1180, 1280, and 1440 px layouts in dark mode, the Thai and English entrypoints, Escape close/focus return, prominent/calm header states, non-overlapping 44 px rendered calm-state hit areas, query-preserving `#people` focus, hydrated CTA layer preservation, horizontal overflow, console errors, and the end-of-document footer tail. The 2026-08-31 delta received a fresh desktop and 390 px mobile check for the Hero heading and full footer tail. Wider breakpoint, zoom, native-device, reduced-motion, save-data, print, and lifecycle observations remain named manual gates; automated fail-static coverage does not convert those observations into passes.

Record the released commit and Pages run only after provider success.

## Rendered and interaction gates

| Priority | Check | Status |
| --- | --- | --- |
| P0 | Desktop header: 76 px prominent at top, 29 px deep calm on downward scroll, prominent on upward scroll, no content jump or horizontal overflow. | Baseline local browser pass; current regression pending |
| P0 | Keyboard menu: visible focus, focus containment, Escape/scrim close, and focus return to the trigger. | Baseline local browser pass; current regression pending |
| P0 | Reduced motion: header stays prominent, approach targets remain visible, and photo parallax remains static. | Current automated and native regression pending |
| P1 | Mobile header/menu at 320–430 px: 68→27 px deep calm, identity and menu fit; CTA, locale, theme, and ecosystem links remain reachable. | Baseline pass at 320, 360, and 390 px; current regression pending |
| P1 | Thai 130% and page 200% zoom: no clipped header/menu labels, overlapping controls, or unreachable content. | Pending rendered review |
| P1 | Approach motion: directory/footer enter once with the reviewed timing; Hero, search, alerts, controls, and focused/deep-linked content never wait for animation. | Baseline pass; current footer regression pending |
| P1 | Photo parallax: eligible Hero/portrait media move within their clipping frames; logos, icons, motif, and certificates stay static; reduced motion, print, and save-data fail static. | Pending fresh rendered review |
| P1 | Hero desktop/tablet/mobile crops remain legible under bounded parallax, including all four people and enough of the CityMETER display in the lower-right circle. | Pending fresh rendered review |
| P1 | Footer: no Hello form, complete contact/navigation semantics, and five verified corporate social links at desktop and mobile widths. | Fresh desktop and 390 px mobile render passed; exact destinations pass automated validation |
| P2 | External CityMETER, CityWiki, ecosystem, Landometer, and join-team destinations resolve to the intended final pages. | Pending live review |
| P2 | BFCache restore, print preview, and disclosure/profile expansion do not leave approach targets hidden. | Pending interaction review |

Native iOS/Android browser behavior remains a separate manual gate even after desktop emulation passes.
