# Simulator static delivery

Live endpoint: [sim-static.prizemap.app/sandbox-viewer](https://sim-static.prizemap.app/sandbox-viewer).
Clients check [the package manifest](https://sim-static.prizemap.app/simulator-manifest.json).

The public viewer URL stays stable. It returns `200` HTML with
`Cache-Control: no-store, no-transform` without redirecting to a release path. Its document
asset base points to one immutable `/releases/<packageHash>/` directory. A new
opening or reload selects the latest deployment, while an already loaded
puzzle keeps its selected release for the attempt.

Use Node 24 (`nvm use`) and install with `npm ci` in `ptcg-server`,
`ptcg-play`, `tools`, and `cloudflare`. The root SDK dependency is only for the
optional developer card generator; it is never bundled into the simulator.

```sh
npm --prefix cloudflare test
npm run deploy:cloudflare
```

`npm run deploy:cloudflare` builds and then runs the guarded deployment.
Wrangler authentication uses its normal local login or a CI Cloudflare API token with the appropriate
Worker deployment scope. No credentials belong in the generated static files.
The Worker serves the custom domain `sim-static.prizemap.app`; its Workers.dev
endpoint remains available as an additional endpoint.

## Guarded deployment and clean CI

After Angular exits successfully, the build records a content fingerprint of
frontend sources/assets, engine sources, image mappings, build scripts,
configuration and dependency locks. Generated bootstrap/metadata files and
test specifications are excluded. Finalization marks the package verified only after its
inventory, ZIP and size budgets pass. The ignored
`ptcg-play/.simulator-build.json` attestation stays outside the public package.

`npm --prefix cloudflare run deploy` checks that the attestation is for a
production build, its source fingerprint is unchanged, and the selected
manifest, every inventoried file and ZIP still match their verified bytes.
Stale sources, tampered artifacts or incomplete finalization stop deployment.
Worker and domain configuration changes do not invalidate frontend build
inputs, so this command also supports deploying those changes with the same
verified frontend. Use the npm deployment scripts to run these checks.

Before publishing, deployment reads the current live manifest at
`sim-static.prizemap.app`. If that release is absent locally, it downloads the
advertised archive and package manifest, verifies their inventory/digests, and
restores the exact previous release atomically. Existing copies are verified
and kept unchanged. A failed download or integrity check stops deployment.
This automatically preserves the immediately preceding published release on a
clean CI checkout, alongside the newly built release.

Existing older local release directories are kept too. The restoration step
does not discover every historical release: retain the full prior deployment
artifact separately when older pinned URLs must remain available across
multiple clean CI deployments. Workers static assets contain the uploaded
directory rather than a permanent release archive.

## Build contents and versions

The Angular build keeps its ordinary local output in
`ptcg-play/dist/ptcg-play`. Finalization embeds the presentation resources,
deduplicates equivalent images, and rewrites lazy component resources to local
data URLs. Packaging then hashes the **final bytes**, including HTML, engine,
CSS, image bootstrap, and schema 3 card metadata. This final hash matters because
postprocessing can change a bundle after webpack assigned its filename.

`ptcg-play/cloudflare-public` contains:

- `simulator-manifest.json`: mutable release pointer, unique `buildId`, timestamp,
  content hash, per-file SHA-256/byte inventory, and ZIP SHA-256/byte count.
- `releases/<packageHash>/`: the finalized runtime files and deterministic ZIP.
- `_headers`: immutable static cache rules and CORS exposure.

The bootstrap contains presentation data and the generated schema 3 card
metadata/hash pair before Angular starts. Embedded source images, fonts,
translations and standalone metadata JSON are excluded from the downloadable
inventory, along with source maps. All 13,483 executable cards remain included.
Metadata contains an ordered image-reference array; executable cards already
provide names, rules and text. Common Limitless origins are restored when the
table is applied, preserving the exact original URLs. Both Node and browser
registration sort set export names explicitly before appending their cards.
A build-generated SHA-256 catalogue signature pins that order alongside the
executable library hash and exact card count.

On normal startup, `CardsService` validates the embedded schema, executable
hash, catalogue signature, expected count and image entries synchronously, then shares that
validated result. It makes no card-metadata HTTP request and opens no metadata
IndexedDB database. Missing, partial or incompatible embedded metadata
requires a reload; it cannot silently combine data from another package.
Existing cached complete packages retain their matching older code and data.

Identical finalized content keeps the same package hash and ZIP; build IDs
still change. A real content change creates a new directory. Packaging refuses
to overwrite different bytes at an existing immutable release URL. Deployment
retains the preceding published release as described above. Do not mix files
from different package hashes.

## Cloudflare routing and artwork

The Worker reads the mutable manifest for each public page opening.
Direct `/simulator-manifest.json` requests stay assets-first: Cloudflare serves
the static file and its conditional `304` responses without invoking the custom
Worker. Its `_headers` rule keeps `Cache-Control: no-cache`, CORS access and
ETag/Content-Length exposure. Treat the returned ETag as an opaque HTTP validator;
the package hash and SHA-256 digests in the manifest establish content identity.
The Worker retains a manifest fallback for missing assets, rather than serving
an unrelated page. Versioned files have a one-year immutable cache lifetime.
Canonical `/releases/<packageHash>/index.html` requests also run through the
Worker, which serves their original immutable bytes with one-year caching and
`no-transform`. Ordinary JavaScript, CSS and other static files stay
assets-first. Worker-generated responses set their own headers because
Cloudflare's `_headers` file applies to static asset
responses, as described in the [Cloudflare header documentation](https://developers.cloudflare.com/workers/static-assets/headers/).

The HTML-only `no-transform` policy prevents automatic Cloudflare analytics
beacon injection, as described in [Cloudflare's Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/faq/).
JavaScript and CSS retain Brotli compression and immutable caching.

Opening `/sandbox-viewer#<snapshot>` serves the selected release's HTML in
place, preserving the visible URL, query and snapshot fragment. Only the
mutable public HTML's asset base is changed to the selected release root;
scripts, styles and other relative resources use that pinned immutable base.
Angular navigates internally to the table while the visible URL remains
`/sandbox-viewer`, including its query and snapshot fragment. The page does not
poll for code updates or switch releases during play.

Direct versioned `/releases/<packageHash>/sandbox-viewer` and
`/releases/<packageHash>/table/:id`
routes remain available for explicitly pinned hosts and serve that release's
exact inventoried HTML. Their one-year immutable caching does not apply to the
stable public page. Unknown releases and missing JavaScript return 404.

The local root preview uses direct card-scan URLs. Published pages whose asset
base selects an HTTP(S) release display supported scans through the
stable same-origin `/card-images?url=...` endpoint. Its browser cache key does not
include the frontend package hash. On the known HTTPS Limitless CDN,
both `/tpci/` and `/tpc/` paths are
supported, including published Japanese M5 scans; the Pokémon TCG image host
is also supported. Other Limitless path prefixes are refused. The proxy strips
upstream cookies, refuses redirects and non-image
responses, limits image size/time, and caches successful scans for one day.
The root and versioned proxy routes share one normalized edge cache key per
original image URL. Responses include a SHA-256 ETag and one-day browser cache
lifetime. Static presentation images remain embedded data URLs.
Card scans are additional to the reusable simulator package.

Artwork uses ordinary image elements with native lazy loading and asynchronous
decoding, preserving
the original scan URL's language, size and custom artwork choices. Source URLs
in snapshots and undo stay unchanged; proxy resolution affects presentation
only. The simulator does not maintain a Blob/IndexedDB scan cache. Game setup,
the initial `StateUpdate` and board readiness do not wait for image completion.
There is no all-card preload pass. Facedown cards omit face image nodes, so
hidden artwork is requested only after reveal or pile inspection. The browser
chooses when rendered lazy images near the viewport download. Faces arrive as
needed, with a local fallback for failed images. A new
puzzle can still download artwork after the board becomes playable. Browser
HTTP caching controls reuse and eviction, so a cached frontend package does not
guarantee offline scans. Rules, prompts, undo and results run entirely locally
while image traffic may continue. Local and file-hosted pages use direct image
URLs without an application CORS fetch.

## Mobile host integration

Read the [cache contract](simulator-cache-contract.md). The checker supports
both same-hash reuse after a new deployment and ETag304 reuse:

```sh
node tools/check-simulator-package.cjs --manifestURL https://sim-static.prizemap.app/simulator-manifest.json
node tools/check-simulator-package.cjs --manifestURL https://sim-static.prizemap.app/simulator-manifest.json \
  --cached-manifest /path/to/previous-check.json
```

This repository supplies the package, archive, metadata and check helper.
A native host can make one conditional manifest GET at app launch, then reuse
its complete verified package on `304` or a matching `packageHash`. This check
uses static delivery and needs no PrizeMap API or database call. A changed hash
selects a verified replacement even when a rollback has an older `builtAt`;
timestamps are descriptive, rather than an ordering rule for updates.
Versioned URLs also allow HTTP cache reuse, subject to WebView/OS
eviction. Guaranteed offline startup requires the host's atomic download,
digest verification and local HTTP/native asset handler described in the
contract; direct file URLs need their own routing/CORS verification.

## Verification

```sh
npm test
node ptcg-play/scripts/build-attestation.cjs verify
node ptcg-play/scripts/test-card-metadata.cjs
node ptcg-play/scripts/optimize-ui-assets.spec.cjs
```

The build's UI asset check rejects oversized or unrecorded icons. Package tests
verify inventory/ZIP bytes, same-content rebuilds, content invalidation,
immutability and deep-route base selection. Attestation tests reject stale
sources and altered/unverified packages. Worker tests exercise stable public
HTML, release isolation, conditional manifests, CORS and the image allowlist/cache.
Retention tests verify restoration from the published ZIP and reject unsafe or
inconsistent releases.
The four saved published PrizeMap solution traces are replayed against the
minified ES-module engine independently of Angular.

Before generating assets, every build also audits source references and rejects
unreferenced files, missing images/fonts and unresolved dynamic asset paths.
The audit follows the finite energy-icon map, configured languages and literal
Sass maps. It scans production source references; Angular component
reachability is reviewed separately when removing old features. Font data stays
in its CSS font-face declaration, and the favicon stays a document resource;
neither is copied into the game image table.

[Remaining asset consumers](simulator-asset-audit.json) records the current
inventory. The [latest SVG simplification](simulator-svg-simplification-results.json)
records smaller energy vectors with a 95% floor for isolated glyph overlap,
canvas alpha and colors at display and enlarged sizes. The
[previous conservative SVG optimization](simulator-svg-optimization-results.json)
records pixel-identical minification and percent-encoded SVG packaging. The
[previous SVG/WebP reduction](simulator-svg-webp-results.json)
compares the official energy-vector/Twinleaf-SVG/WebP75 release with its immediate
predecessor. The [previous package reduction](simulator-package-reduction-results.json)
and [second asset audit](simulator-asset-reaudit-results.json) retain earlier measurements.

Recorded results: [bundle sizes and budgets](simulator-bundle-results.json) and
[live delivery, integrity and cache transitions](simulator-delivery-results.json).
[Domain browser verification](simulator-domain-browser-results.json) records
the unchanged viewer URL, pinned script paths, local artwork reuse, and hidden
frame controls. PrizeMap history restoration remains covered by service tests.
[Terminal presentation checks](simulator-terminal-results.json) verify live win,
loss and turn-end fades, result messages, and host Undo restoration without a modal.

[Current lazy artwork verification](simulator-lazy-artwork-results.json) records
zero image preloads, hidden faces without image nodes, and working initial
`StateUpdate`/host undo while a visible scan is pending. Scans remain 736×1024.
Opening Phantom Maze's deck adds 16 images, including nine source URLs absent
from the initial board. Three warm desktop runs had a 410.7 ms median navigation
to board paint versus 407.9 ms for the previous preload release. Post-startup
board mounting measured 36.5 ms versus 48.5 ms. This small sample shows no
full-page speedup and does not establish phone or cold-download performance.

[Historical background artwork verification](simulator-background-artwork-results.json)
records the earlier all-card-preload release `e80259…`. The live board appeared with 36 displayed images still
loading; all 50 preloads then succeeded at the same 736×1024 scan dimensions.
A controlled image response remained pending for 16 seconds while the local
board and host undo worked. Failed artwork used a fallback, and a knockout
still faded the board without a result modal. Warm board mounting improved,
but the three-run desktop sample did not show a full-page paint speedup.

[Historical initialization measurements](simulator-initialization-results.json)
identify the earlier tested release. The Blob-cache comparison for release
`f14ef8…` recorded three warm full navigations on the same desktop
Phantom Maze puzzle had a 396 ms median, down from 541 ms. Application setup to
the existing two-frame board-paint mark fell from 279 to 103 ms. All 50 artwork
scans were persistent hits, all rendered images loaded, and the visible URL was
unchanged. The first upgrade used legacy entries without downloading scans;
subsequent loads used Blob records. Those desktop observations predate native
background image loading and do not establish current lazy-loading, phone or
cold-download performance.

[Historical setup performance measurements](simulator-setup-performance.json)
record package `807153…` and its earlier data-URL implementation, with warm-cache
desktop-browser checks separate from application timing marks.
For Phantom Maze, three observed warm reloads changed from
2,123/1,718/1,581 ms to 739/705/620 ms, including browser automation overhead.
Local `boardMounted` marks were 93–153 ms; these use a different timing boundary.
The warm artwork check recorded 50/50 persistent hits and zero scan network
requests. These observations are not measurements of current lazy loading,
phones, or cold downloads.

The local engine profiler can be repeated without network or browser automation:

```sh
node tools/profile-puzzle-setup.cjs --runs 20 --warmup 3
```

It reads the four locally saved solution fixtures by default; explicit JSON or
serialized snapshot paths can be supplied instead. Output includes warm medians,
p95s, physical card counts and player IDs.

```sh
npm --prefix ptcg-play run report:bundle
node cloudflare/check-delivery.mjs \
  --origin https://sim-static.prizemap.app \
  --output docs/simulator-delivery-results.json
```
