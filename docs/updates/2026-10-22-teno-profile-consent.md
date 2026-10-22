# Teno profile and social consent — 22 October 2026

The participant reply dated 21 October was reviewed for the existing I0006 profile, the exact current LinkedIn URL, and the newly supplied GitHub profile. The publication contract now records those three scopes with individual consent. The exact reply and private mailbox references remain outside this public repository.

- I0006: `consentStatus=granted`, `profileStatus=eligible`.
- LinkedIn: retain `https://www.linkedin.com/in/akkaranat-thanathammanan-a4356a332/`; verified, granted, and publishable through `individual_consent`.
- GitHub: add `https://github.com/TenoSocub` to the existing stable social record; direct participant identity evidence, granted, and publishable through `individual_consent`.
- Portrait: no new individual permission was stated. Preserve the existing owner-authorized portrait, exact bytes/hash, and pending participant consent. Do not infer image consent from profile or social consent.

The approved consent record intentionally has no `portrait` entry. It does not change the existing biography, English wording, credentials, role periods, contribution credits, certificates, or other people. The public graph retains 53 people, 70 works, and 135 contributions. Profile consent totals become 40 granted and 13 pending; the public LinkedIn/GitHub link count becomes 76.

## Regeneration

The reviewed input is the exact predecessor projection at `2d688113331ac81164612ba74beee81f380e1c14`, SHA-256 `b4887052e2082fccb604e551591f645305ade591603990c54dcbc41202771599`. Preserve it outside the repository, then run:

```sh
node tools/normalize-data.mjs \
  --reviewed-site-data /private/tmp/landom-reviewed-before-2026-10-22.json \
  --social-updates data/approved/reviewed-social-updates-2026-10-22.json
npm run build
```

The existing reviewed normalizer fills only the untouched missing GitHub slot, then applies the separately scoped consent contract and regenerates all public splits. It does not import the stale ignored raw Sheet snapshot.

## Verification and delivery boundary

All 210 project tests and source/distribution validation pass. The retained portrait consent and hash have an explicit regression assertion. Comparison with the exact predecessor graph confirms that only I0006 publication, its LinkedIn/GitHub rows, and deterministic release metadata changed.

GitHub Pages delivery uses the existing pull-request validation and main-branch workflow. Provider completion, released source identity, live byte parity, and actual rendered Thai/English profile checks are separate release evidence.

The canonical Google Sheet and `https://landometer.com/v3/landom` are separate stores. A Pages release alone establishes neither a Sheet write nor a production database update. Production directory checks must read its own API and page; do not infer production parity from this repository.
