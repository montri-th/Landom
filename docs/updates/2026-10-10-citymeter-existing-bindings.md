# Connect two existing CityMETER works to the public catalog

Ken's Non-bank contribution and the developing religious-places contribution were already recorded, but their work records lacked public catalog links. As a result, the CityMETER credit projection omitted both. This update binds those existing identities to the now-published catalog and gives Landom's Thai and English work links their matching destinations.

| Registry mapping | Existing work | Existing contribution | Public module |
| --- | --- | --- | --- |
| CMRW-0039 | work-citymeter-nonbank | C0124 · I0030 · Software development | dataset-non-bank |
| CMRW-0040 | work-citymeter-religious-places-unresolved | C0122 · I0045 · Developing | dataset-places-of-worship |

The historical `work-citymeter-religious-places-unresolved` ID remains stable. The work's catalog identity is resolved; its contribution still says **กำลังจัดทำ / Developing**. Fuel Stations retains both Draf's C0064 and the separate **กำลังปรับปรุง / Improving** C0123. No person, contribution, role, date, engagement, biography, portrait, consent or publication-policy field changes. The counts remain **53 people, 69 works and 129 contributions**.

## Evidence and approved input

The owner confirmed these existing work/contributor relationships on 29 September and authorized the public web update. Current exact dataset identities and map URLs are reconciled against the published [Non-bank](https://montri-th.github.io/CityMETER/datasets/non-bank/) and [Places of Worship](https://montri-th.github.io/CityMETER/datasets/places-of-worship/) records at public CityMETER commit `aff0aa719f470fa48e067c1dc95929085af3625f`. The input records the source catalog SHA-256; it does not import private application implementation or source evidence.

`data/approved/citymeter-existing-work-bindings-2026-10-10.json` is the scoped approved input. The normalizer applies it after the original four-work attribution amendment. Its guarded existing-work update accepts the reviewed public predecessor, the exact reviewed Sheet predecessor digest, or the already-applied final state. An unexpected route, identity, evidence note, module collision or new field fails without mutating input data. The Sheet digest preserves a drift check without copying raw Sheet notes into the public repository.

Only the two work records' `moduleSlug`, `type`, `authorityStatus`, `evidenceNote`, `catalogUrl`, `destinationUrl` and `linkEvidence` fields change. `canonical_module` and `owner_confirmed_catalog_binding_identity_only` describe the catalog crosswalk, not completion, an operational release, data lineage, data rights or an individual's consent.

## Source and projection parity

The canonical Landom registry already contains the two existing credits and candidate mappings. Read-only inspection on 10 October found the work rows' dataset IDs and map URLs present, with missing catalog links and stale candidate states. Its governed mirror needs the same scoped binding and link values, plus matching attribution bridge statuses. Source lineage stays unproven where it was unproven; the developing work remains developing. The Sheet mirror is a separate bounded update and is not written by the normalizer.

Reviewed-public normalization regenerates `works.json`, `site-data.json` and the card-only `citymeter-contributors.json`. The projection now has **43 module keys**. All previously emitted module rows remain identical, and `dataset-business-dynamics` stays excluded. No new person record or placeholder image is created; I0045's unsupplied English nickname remains null and the existing Thai fallback remains available.

Both initial HTML and the interactive directory use the same localized public catalog URLs. CityMETER must refresh its vendored copy from the deployed Landom projection in its own release; changing this repository alone does not update CityMETER's delivered credits.

## Verification and release boundary

Run `node tools/normalize-data.mjs --reviewed-site-data data/generated/site-data.json` followed by `npm run build`. Focused regressions cover complete graph preservation, idempotence, exact public links in both initial entrypoints, identity conflicts, changed source notes, wrong aliases, invented roles/completion and hidden-module exclusion. Raw-snapshot tests retain their existing skip when the authorized ignored source is absent. Build and generated parity do not claim a live deployment; publication and live byte checks are recorded separately.
