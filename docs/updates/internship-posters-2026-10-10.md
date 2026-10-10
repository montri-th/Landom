# Three internship programs on Landom

The section after the people directory presents Marketing Strategy Intern (MSI), Product Developer Intern (PDI) and Full-Stack Developer Intern (FDI). Each card shows the complete original Set A poster, accessible Thai or English copy, a direct application link and native inline program details. The people directory, its three loading skeletons and the canonical registry remain unchanged.

The source is Landometer's owner-supplied recruitment communication v3, Set A, dated 4 October 2026. The owner authorized these three posters for the public Landom website on 10 October 2026. The original MSI social publication and PDI/FDI scheduling are historical evidence; this change does not claim independent verification of subsequent social publication. Public website use follows the current owner instruction.

The shared terms come directly from that source: ten weeks; start date by agreement; hybrid work in Bangkok, three on-site days near MRT Hua Lamphong and two remote days; 400 THB per day. The website does not promise a permanent position or amend the current employment details of people shown in the poster. Poster scenes retain their original “Illustrative image” labels. No original artwork, portrait, credit or wording inside the PNGs was altered.

## Source and rendering

- `src/recruitment.js` owns public bilingual program copy and the shared renderer. It contains no applicant records or private HR data.
- `tools/build.mjs` embeds the complete section in both initial HTML entrypoints. It appears without JavaScript or a successful people-data fetch.
- `src/app.js` uses the same renderer when the chosen language changes. Matching initial content stays intact, and opened program details stay open across language changes.
- `src/recruitment.css` applies current LDS 0.9.7 foundation pairs only to the new section. The rest of this historically pinned site retains its truthful existing declarations.
- `public/assets/recruitment/manifest.json` records immutable source hashes, intrinsic dimensions, role, approval basis and the independently decoded QR destination. All three PNGs are byte-for-byte copies, named with source hash revisions.
- `tests/recruitment.test.mjs` checks both locale entrypoints, preserved original assets, native application/disclosure behavior, locale parity and visible no-motion styling.

The current form is [Landometer internship application](https://forms.gle/FWbukGX7X3QWZf317). All three embedded QR codes independently decode to that exact URL. Applicants select the corresponding program in the common form. Uploading application documents requires Google sign-in. No application was submitted during verification, and no form editor or response-table address is published.

## Design and verification

Scoped design release: `0.9.7`, `v0.9.7-owner.1`, standalone document `lds-0.9.7-landometer-standalone-r1`, document SHA-256 `d3085cbc0a50195f1cbf0c77b1d77c0d19b84364daf2948eb367348d65432d96`, manifest SHA-256 `0a936393fc1ab05f8b32110397546b2a87cc26e46f2661a712bdd2debaa58516`.

The section uses current foundation colors, the site's verified font assets, visible keyboard focus and minimum 44 px controls. Its three columns become two and then one as space narrows. Posters preserve their full aspect ratio in both themes. The section introduces no decorative brackets, side rails, entrance animation or hidden content.

Run `npm run build` for the repository checks, unit tests, deterministic public build and distribution validation. Review actual Thai and English output at 390 px and 1440 px in light and dark themes, at 200% zoom, with expanded program details and keyboard focus. Static checks do not establish visual approval. Merge/publication remains gated on that review; the earlier recruitment-link release remains recorded separately.

Only the allowlisted build output is deployed. Private recruitment source packages, applicant documents, response sheets and editorial notes are not copied into this repository or distribution.
