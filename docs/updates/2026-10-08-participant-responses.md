# Participant response reconciliation — 8 October 2026

The reviewed directory retains 53 people and now records 36 individual profile consents. The new scoped replies are I0012, I0020 and I0022. Each grants the current profile and verified LinkedIn link. I0020 grants the existing portrait; I0012 and I0022 supply replacement portraits. I0012 and I0022 refuse GitHub, so those records and any refused URL are absent from the public graph.

The two participant portraits use bounded square crops, 800×800 JPEG at quality 78, with source metadata stripped. No retouching, background replacement, generation or identity alteration is applied. Only person-avatar use on Landom profile and related work pages is approved; Hero, social preview, brand and certificate reuse is excluded. The original images, correspondence and retrieval evidence remain private. Exact output hashes and byte counts are recorded in the approved inventory, asset manifest and consent contract.

This maintenance release starts from the reviewed graph at `406affcb61b06edcdee110676b61f7987da3c950` rather than the stale ignored raw snapshot. It preserves the source snapshot timestamp, names, profile text, education, engagements, works, contributions and certificates. Previous portrait and social refusals remain effective. Ham's unverified GitHub candidate stays withheld; Nine's previously approved portrait stays unchanged. The public graph contains 367 social records, 73 publishable social links and 49 publishable portraits.

The normalizer supports an explicit reviewed-graph input and a bounded portrait replacement contract. The contract binds the baseline hash, stable person ID, previous portrait hash and exact replacement bytes; the existing per-scope consent projection makes the publication decision. Determinism tests now write only isolated temporary outputs, preventing a legacy raw-data test from overwriting the reviewed release during validation.

To reproduce the projection, save the baseline `data/generated/site-data.json` from the source commit above into the ignored `data/raw/reviewed-406affc.json`, then run:

```sh
node tools/normalize-data.mjs --reviewed-site-data data/raw/reviewed-406affc.json --portrait-updates data/approved/reviewed-portrait-updates-2026-10-08.json
npm run build
```

The governed Sheet mirror is updated in bounded cells and missing pending asset/social slots are restored with stable IDs. Tax and contact records are private Sheet data and never enter the public build. The release preserves the site's explicitly pinned design system and layout. GitHub Pages publication requires provider success, matching delivered bytes and rendered Thai/English checks at desktop and narrow widths. The separate `landometer.com/v3/landom` integration is outside this release.
