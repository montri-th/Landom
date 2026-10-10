---
document_id: landom-citymeter-attribution-2026-10-10
reviewed_at: "2026-10-10"
implementation_state: prepared_for_review_not_live_attestation
public_source_base: 07cc4c3cf390f55ea8c7b2eeb89645c31d6112dc
---

# CityMETER credits and readable public discovery

This update applies the owner's confirmed work/contributor identities to the existing public Landom repository. The source is the canonical Landom registry and the explicit owner instruction to implement these public credits. It does not import private application code, a backend migration, a private contact registry, or a new people roster.

## Approved change

| Contribution | Existing person | New work | Public CityMETER module |
| --- | --- | --- | --- |
| C0125 | I0030 — Ken | work-citymeter-grocery-retail | dataset-grocery-retail |
| C0126 | I0034 — Earth | work-citymeter-terrain-elevation | dataset-terrain-elevation |
| C0127 | I0036 — Toh | work-citymeter-government-spending | dataset-government-spending |
| C0128 | S0001 — Oat | work-citymeter-events-notices | dataset-events-notices |
| C0129 | I0034 — Earth | work-citymeter-events-notices | dataset-events-notices |

The role is only **ร่วมพัฒนา / Contributor**. Engagement, period start/end and period label are null. No leadership, completion, data ownership or reuse permission is inferred. Canonical work titles retain `CityMETER: Grocery`, `CityMETER: Terrain`, `CityMETER: Government Spending` and `CityMETER: Traffic Incident`; the last can link to the public Events & Notices description without renaming its identity.

All 53 person records and their education, engagements, profile text, portraits, social links, individual consent and owner authorization remain unchanged. Pending individual consent is not upgraded: the existing owner-authorized public core-directory policy still governs its already-public records. Explicit portrait/social refusals remain effective.

`work-citymeter-nonbank` and `work-citymeter-religious-places-unresolved` remain distinct existing works with unresolved catalog mappings (`CMRW-0039` / `CMRW-0040` in the canonical registry). Non-bank retains its existing exact operational destination and Ken credit; Q's religious-places work remains in progress with no invented module link. Existing Fuel Stations work and Draf's contribution remain separate from Q's `C0123` improvement contribution. None of these earlier records is replaced.

The sole correction to an earlier work is Business Dynamics' route. Its old `#dataset-business-dynamics` catalog anchors no longer exist in the public catalog. The approved `routeCorrections` entry clears both catalog URLs, sets `destinationUrl` to `https://landometer.com/v3/citymeter?d=businessDynamics`, and marks `linkEvidence.linkScope` as `historical_direct_route`. This destination was already present in the retained public CityMETER bundle `assets/index-qbT50gkr-v18.js`; no private application source is imported. The work ID, module identity, titles and all historical credits remain unchanged. This is an operational link from a historical work, not permission to restore public catalog discovery or a new detail page.

## Source to public output

`data/approved/citymeter-attribution-2026-10-10.json` is the narrow, reviewed input. `tools/citymeter-attribution.mjs` applies it through `tools/normalize-data.mjs` after the current publication-consent policy. All input modes use this step. The reviewed-public mode avoids reading a stale or missing ignored raw snapshot:

```sh
node tools/normalize-data.mjs --reviewed-site-data data/generated/site-data.json
npm run validate
npm test
npm run build
```

Normalization regenerates every public dimension, `site-data.json`, `people-media.json` and `citymeter-contributors.json`. It preserves the original Sheet fetch timestamp and advances only the deterministic projection review date. Repeating the same approved amendment does not duplicate rows. Unknown people, duplicate identities, role/date fields outside the approval, conflicting work/module identity, or conflicting contribution IDs fail without mutating the input object. Future conflicting facts need an explicit review; do not weaken the check merely to complete an import.

The source graph has 53 people, 69 works and 129 contributions. The card-only credit interface has 41 module keys. Eight retained works already have approved exact-module catalog anchors despite a null `moduleSlug`; the interface reuses those exact TH/EN links, never a guessed name match. `dataset-business-dynamics` is excluded from this new CityMETER projection. The two unresolved newer catalog mappings are not promoted.

The card interface exposes only:

```json
{
  "schemaVersion": "1.0.0",
  "canonicalUrl": "https://montri-th.github.io/Landom/data/generated/citymeter-contributors.json",
  "rowFields": ["personId", "nickname", "contributionRole", "profileUrl", "portrait"],
  "localizedFields": ["nickname", "contributionRole", "profileUrl"],
  "portraitFields": ["url", "versionedUrl", "alt"],
  "missingPortrait": null,
  "publicModuleCount": 41,
  "newWorks": 4,
  "newContributions": 5,
  "historicalRouteCorrections": 1,
  "personRecordsChanged": 0,
  "contactsOrPrivateReceiptsExposed": false
}
```

`generatedAt` accompanies the artifact and `byModuleSlug` contains the rows. Portraits reuse the governed public media manifest; there are no remote social-image sources or generated substitute images. Neither the narrow projection nor its links asserts an individual's consent beyond the canonical record. Sheet writes and deployment are separate actions; normalization performs neither.

## Links and readable HTML

New work links point to `https://montri-th.github.io/CityMETER/datasets/<slug>/` and `/CityMETER/en/datasets/<slug>/`. Existing catalog anchor links remain intact. Operational `destinationUrl` values point to the existing Landometer maps; Terrain uses `/v3/citymeter-3d?d=terrain`.

Landom profile links remain the real query routes `/Landom/?person=<ID>&lang=th` and `/Landom/en/?person=<ID>&lang=en`. No standalone profile route is invented. `src/public-directory.js` renders public people/contributions for initial HTML; the build includes it in both locales. The readable fallback survives JavaScript/data-fetch failure and is hidden only after the interactive directory renders. Native profile permalinks retain the existing expandable-card behavior.

Each page has one identity-only JSON-LD graph. Person nodes use only `@id`, `@type`, `name`, and `url`, and refer to the same people and real profile links that are readable in the page. This is discovery metadata, not a consent, employment, authorship or ownership claim. `llms.txt` links the new public interface without granting agent authority.

## Verification and release

The existing validator checks public-data/privacy rules, generated parity, identity/media assets and the exact CityMETER projection. Focused tests check all five IDs, additive/idempotent behavior, unchanged people/older works, unknown/colliding input rejection, private-field exclusion, missing portraits and candidate boundaries. Two tests requiring an authorized ignored raw snapshot remain skipped when that snapshot is absent; reviewed-public normalization and normalized roundtrip tests still run.

Older-work parity permits only the three route fields in the explicit Business Dynamics correction (`catalogUrl`, `destinationUrl`, `linkEvidence`); all other fields and contributions must match the baseline. A different existing route fails the correction without partially changing data. The public projection rejects retained catalog URLs for hidden historical works, and TH/EN fallback tests require the approved direct destination while keeping Business Dynamics out of the contributor catalog.

Before release, check TH/EN at narrow and desktop widths; open each affected profile; follow links both ways; disable JavaScript or fail the JSON request and confirm readable names/work remain. Test Q and Draf's existing separate roles, missing portraits and current withdrawn links. Preserve the pinned legacy assets, historical LDS declaration and workflow hash checks. Current LDS 0.9.7 guides this scoped content/discovery work; it does not relabel legacy signed assets or claim a full design-system migration.

Build and deploy both public repositories as one reviewed release sequence so the new CityMETER detail links and credit projection are available together. GitHub Pages' workflow must complete and its cache-busted live-byte checks must match the build manifest. Check the new JSON MIME/body and four exact module mappings at the live URL, plus native TH/EN profile/detail links. A local build or pushed commit is not live verification. Record actual release SHAs and receipts after deployment; this document is not that receipt.
