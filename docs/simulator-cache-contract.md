# Simulator package cache contract

The simulator is a static package. The PrizeMap native host verifies a local
package and makes it usable immediately, while checking one small deployment
manifest in the background once per app launch. A screen pins its selected
package for the entire attempt; a completed update is available to later
screens. No update polling is needed during play. Puzzle snapshots and remote
card-face images are separate from this package.

For online use, the stable public entrypoint is
[sim-static.prizemap.app/sandbox-viewer](https://sim-static.prizemap.app/sandbox-viewer).
It serves `200` HTML in place with `Cache-Control: no-store, no-transform`, preserving the
visible URL and snapshot fragment. The HTML pins its resource base to the
selected `/releases/<packageHash>/` directory before scripts load. A new
opening or reload selects the latest deployed package; the active page keeps
its existing package without polling for updates.
Internal table navigation keeps the visible `/sandbox-viewer` URL and snapshot
fragment unchanged.

## Manifest version 1

`simulator-manifest.json` has this shape. Digests below are placeholders for
64-character lowercase hexadecimal SHA-256 values.

```json
{
  "schemaVersion": 1,
  "packageHash": "<sha256 of canonical asset inventory>",
  "buildId": "<unique deployment ID>",
  "builtAt": "2026-11-06T12:00:00.000Z",
  "packageBaseUrl": "releases/<packageHash>/",
  "entrypoint": "index.html",
  "supportedSnapshotFormats": ["base64", "gz1", "gz2"],
  "assets": [
    { "path": "index.html", "sha256": "<sha256 of final file bytes>", "bytes": 1234 },
    { "path": "main.<content-hash>.js", "sha256": "<sha256 of final file bytes>", "bytes": 5678 }
  ],
  "archive": {
    "path": "simulator-package.<packageHash>.zip",
    "sha256": "<sha256 of archive bytes>",
    "bytes": 9012
  }
}
```

`buildId`, `builtAt`, `archive`, and `supportedSnapshotFormats` are optional. Each asset can also have a
`contentType`. `packageBaseUrl` resolves against the manifest response URL and
must end in `/releases/<packageHash>/`; it can instead be an absolute HTTPS CDN
URL. Asset paths, the entrypoint, and the archive path are relative to that base.
They cannot contain traversal, encoded paths, queries, or fragments. The
entrypoint must appear in the asset inventory. The archive is an alternative
transport for the inventory, so it is excluded from that inventory.

When present, `supportedSnapshotFormats` is a nonempty array of unique format
names from `base64`, `gz1`, and `gz2`. It declares the initial URL transports
that the release can decode; it does not change outgoing bridge snapshots.
The publisher writes the same declaration into the stable manifest, versioned
`package-manifest.json`, and the manifest inside the ZIP. A non-executing
`prizemap-supported-snapshot-formats` meta tag in finalized HTML binds that
declaration to inventoried bytes. Changing supported formats therefore changes
the canonical index and package hash without changing the hashing algorithm.
Do not rewrite an existing immutable release to add this metadata.

The package inventory contains **every final file required by the release**,
including its finalized HTML, executable JavaScript and card engine, CSS, static
presentation resources, card metadata, and card-metadata manifest. Hash after
all build transformations and filename rewrites. Do not include the deployment
manifest or ZIP in the asset inventory: including their own hash would create
a circular dependency.

Compute `packageHash` as follows:

```js
const inventory = assets
  .map(({ path, sha256, bytes }) => ({ path, sha256, bytes }))
  .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
const packageHash = sha256Utf8(JSON.stringify(inventory));
```

Preserve that exact object key order, compare paths using JavaScript string
ordering, and use compact JSON with no final newline. Per-file digests and byte
counts cover original uncompressed file bytes, regardless of HTTP gzip/Brotli
encoding. Changing any inventoried file, path, or length changes `packageHash`.
An identical package can retain its hash across builds. A deployment gets a new
`buildId` and timestamp even if its content is unchanged; those fields do not
invalidate the content cache.
Capability metadata itself is outside the canonical inventory, like `buildId`;
the matching finalized HTML marker is an inventoried file change.

## HTTP check and cache decision

The mutable deployment manifest revalidates (`Cache-Control: no-cache`) through
Cloudflare's static asset handler, without invoking the custom Worker or a
PrizeMap API/database. Its native `ETag` is an opaque HTTP validator: store and
return it exactly, rather than calculating it from the manifest or package hash.
Deployment IDs can change its ETag while the reusable package hash stays the same. Immutable
`releases/<packageHash>/...` files should use long-lived immutable caching.
Expose the manifest's `ETag` in CORS response headers when a browser host reads
it across origins. A cached ETag is associated with its manifest URL.
Static `HEAD` responses can omit Content-Length; the manifest's advertised byte
counts and verified download lengths establish package size and completeness.

Compare package hashes for equality, rather than ordering timestamps. A rollback
can select an older package and `builtAt`; it still requires changing packages
when its hash differs. A new deployment of identical package bytes can change
`buildId`, timestamp and ETag while allowing the complete package to be reused.

The stable public HTML is a mutable facade, with its asset base set to the
chosen release. Its bytes can therefore differ from the inventoried index.
Verify the canonical index from the manifest's versioned `packageBaseUrl`,
along with the other inventory files. Explicit versioned viewer URLs stay
pinned on reload and do not perform the stable URL's latest-release selection.
Pinned HTML uses immutable one-year caching plus `no-transform`; this
HTML-specific policy leaves JavaScript/CSS compression unchanged.

1. Keep the manifest, its ETag, and `packageHash` only after the package is
   completely downloaded and verified. A hash alone is a claim that every
   inventoried file is available; it cannot establish that files still exist.
2. GET the manifest with `If-None-Match: <stored ETag>` when a complete cache is
   available. A `304` means reuse that complete cache.
3. On `200`, validate the schema, release prefix, inventory, and recomputed
   `packageHash`. If it matches a complete cached package, reuse the package and
   refresh stored deployment metadata.
4. For a new hash, download all listed assets, or download the optional ZIP.
   Verify byte lengths and SHA-256 digests. If using the ZIP, verify its digest,
   extract into a staging directory, then verify every extracted inventory file.
   Do not overwrite files belonging to an older package.
5. Mark the new package complete and switch the active pointer atomically only
   after verification succeeds. An interrupted download leaves the previous
   verified package usable. Retain an in-use package until its attempt finishes.

A failed manifest check never authorizes mixing old and new assets. A host may
offer its previous complete package while offline; that is an explicit stale
cache policy, separate from a successful freshness check.

Initial puzzle URLs may use the versioned [gzip transport](simulator-gzip-payload.md)
`gz1.` or the [fixed field-code revision](simulator-field-codes.md) `gz2.`.
A host that stores packages must select a release supporting the specific format
before opening these URLs, or decode the transport to legacy Base64 itself.
Support for `gz1.` alone does not imply support for `gz2.`. Do not fall back to
an older offline package with an unsupported URL format.
Require the matching `supportedSnapshotFormats` entry for an unknown future
or rollback package before selecting it for that transport. An absent field
does not establish gzip support. The native host explicitly recognizes the
legacy `6ff0b913aece399611bd2182af6b21202189bdd12e3eaea7a356da9cfffecfb1`
release as a grandfathered compatible baseline for all three formats even though its
original immutable manifest predates the field.
The stable online entrypoint selects the current decoder on a fresh load;
the native undo/reset and outgoing `StateUpdate` snapshots remain plain Base64.

## Startup metadata and artwork

The release bootstrap embeds the generated schema 3 card image metadata and
its matching hash/count manifest once, before Angular starts. Normal startup
validates that pair synchronously against the executable library and shares
the result. It does not request separate card-metadata JSON or open/read/write
the metadata IndexedDB cache. Legacy bootstraps use the older storage/HTTP path
only when both documents are absent. A partial pair, wrong schema/hash, or
incomplete payload fails with a reload message rather than mixing releases.
Package freshness remains the host's manifest/ETag decision. The native host
performs that check in the background and pins whichever verified package is
selected when a screen acquires its session.

Card-face images use ordinary image URLs and the browser's HTTP cache. The
simulator does not read or write a Blob/IndexedDB scan cache. Engine initialization
and the initial `StateUpdate` have no image-completion barrier. Rendered images
use native `loading="lazy"` and `decoding="async"`, without an all-card preload
pass. Facedown cards omit face image nodes, preventing hidden artwork requests
until a reveal or pile inspection. The browser chooses when rendered lazy images
near the viewport load; faces appear as downloads finish and failures use a local fallback.
Existing scan sizes, artwork choices and original source URLs in wire snapshots
remain unchanged.

A cached simulator package does not guarantee that a new puzzle's artwork is
cached. First use can require image downloads after the board is playable.
Published HTTP(S) deployments display supported images through the
stable same-origin `/card-images?url=...` endpoint:
`/tpci/` and `/tpc/` on the exact HTTPS Limitless host, and the supported Pokémon
TCG image host. Its URL preserves the full original artwork URL, including size
and language, and is independent of the frontend package hash. The Worker shares
its edge cache across versioned and root proxy routes and serves successful
images with a one-day browser cache lifetime and an ETag. Local/file-hosted
clients display the original remote image URLs without a CORS fetch. Browser/OS
cache eviction can require another image download. Game rules, prompts and undo
stay local, but readiness does not promise zero subsequent image traffic or
guarantee offline card faces.

See [current lazy artwork verification](simulator-lazy-artwork-results.json) for
zero preload links, hidden-face gating, unchanged 736×1024 scans, and state/undo
readiness while a visible image remains pending. Opening Phantom Maze's deck
adds 16 image elements, including nine source URLs absent from the initial board;
these on-demand requests are compatible with readiness.

See [historical background artwork verification](simulator-background-artwork-results.json)
for the previous all-card-preload release, held-image readiness checks, preserved image dimensions
and separate board/artwork timings. The earlier
[initialization comparison](simulator-initialization-results.json) profiles the
historical Blob-cache release and engine.
The earlier [setup measurements](simulator-setup-performance.json) are historical.
These results do not establish phone or first-download performance.

## Executable check helper

The Node 18+ helper issues only a read-only manifest GET. It validates metadata
and produces instructions; it does not download or verify the package files.

```sh
node tools/check-simulator-package.cjs \
  --manifestURL https://sim-static.prizemap.app/simulator-manifest.json

node tools/check-simulator-package.cjs \
  --manifestURL https://sim-static.prizemap.app/simulator-manifest.json \
  --cachedPackageHash <hash-of-complete-local-package>

node tools/check-simulator-package.cjs \
  --manifestURL https://sim-static.prizemap.app/simulator-manifest.json \
  --cached-manifest /path/to/previous-successful-check.json
```

`--cached-manifest` accepts either a raw manifest or prior successful helper
output, including its ETag. `--etag '"response-etag"'` can also be supplied with
a cached hash. Kebab-case aliases `--manifest-url` and `--cached-package-hash`
are accepted. Output is JSON with action `reuseCachedPackage` or
`downloadManifestAssets`, a reason, the selected package hash, and absolute
entrypoint/asset URLs. A download result also includes per-file digests and
lengths and the optional archive URL. A reuse result has an empty `assets`
download list. A bare hash plus ETag can yield a minimal `304` result; use the
cached manifest when the resolved entrypoint is also needed.
When declared, `supportedSnapshotFormats` is included in helper output and
preserved through cached-manifest `304` results. The helper validates the field;
the native host separately chooses a release compatible with its input format.

Exit status is nonzero for failed requests or invalid metadata. Persist output
as a complete cache descriptor only after the host has completed and verified
the indicated download. Test the decision paths without a browser:

```sh
node --test tools/check-simulator-package.spec.cjs
```

## PrizeMap native package cache

The native implementation now exists in the separate `pokepuzzles` project:
`src/services/simulatorCachePolicy.cjs` validates manifests and ZIP contents,
`simulatorCacheCore.cjs` manages verification, installation and leases, and
`simulatorCache.js` supplies native filesystem, HTTP and SHA-256 operations.
`useSimulatorSession` integrates the cache with `PuzzleScreen` and
`DraftPlayScreen`. This describes the implemented source architecture; it does
not claim a TestFlight release or completed device QA.

The current native source bundles the complete simulator package
`c0058c35aae0e94f8cd67e263433e710ff9e5dcc37932dbe988204408846d4f1`
as resources. Its manifest explicitly declares support for `base64`, `gz1` and
`gz2`; the earlier `6ff` release remains the grandfathered legacy baseline.
At startup, the cache verifies the persisted local package, recovers a verified
previous package when possible, or uses the bundled package. Local readiness
does not wait for the remote manifest check. The app starts one background
manifest GET per launch, conditional when a stored ETag is available; repeated
screen openings share that launch check.
An offline or failed check leaves the complete local package available.

On a changed hash, the host downloads the archive into staging, checks its
length and SHA-256, validates the ZIP's exact inventory and paths, and verifies
every extracted file against the manifest. It then moves the complete package
into its hash-named filesystem directory and commits the active descriptor,
ETag and previous-package pointer together in AsyncStorage. An incomplete or
invalid update never becomes active. A `200` with the same hash refreshes the
descriptor without downloading a replacement package; a different hash selects
that package even when its timestamp is older, allowing rollbacks.

Each puzzle or draft screen acquires a lease on one verified package. The
native loopback HTTP server exposes its files under exactly
`http://127.0.0.1:<port>/releases/<packageHash>/`, including SPA fallback for
`sandbox-viewer` and table routes. The WebView opens that local `sandbox-viewer`
with the original query and snapshot fragment preserved. Reset, retry and
reconnect retain the same leased package and prefix; background activation does
not change an already opened screen. The lease ends when the screen closes or
its source puzzle URL changes. Cleanup retains the active package, previous
package and any packages with live leases.

The installed package covers the simulator engine, UI and embedded metadata.
It does not make the entire PrizeMap app offline: fetching puzzle records,
authentication, submissions and other backend features still depend on their
existing services. Card faces remain lazy remote downloads and browser/OS cache
entries. The local image endpoint can redirect supported requests to the public
image proxy, but it does not bundle or persist those scans in the package.
Previously unseen or evicted artwork therefore needs a connection and can use
the local cardback fallback while unavailable. With a snapshot already supplied,
game rules, prompts, reset and undo run from the local package.

Online hosts can still open the stable public viewer URL, or explicitly select
a versioned release URL with the original snapshot fragment. HTTP caching of
those URLs alone does not guarantee filesystem availability after OS cache
eviction; the native package cache provides that separate verified local copy.

Keep the existing `StateUpdate`, `PushStateChange`, `UndoDetected`, `GameOver`,
and `TurnEnd` bridge unchanged. Cache selection changes where the simulator
package is loaded, not the puzzle snapshot or outcome protocol.

Keeping a WebView alive across different puzzles could amortize module parsing
and library initialization in a future host integration. That needs a distinct
`LoadPuzzle` command that resets presentation failures and initializes the
new engine state before publishing readiness, plus changes in the separate host. `PushStateChange` is
the existing undo protocol; sending an unrelated puzzle through it skips
attempt setup and is not a supported substitute for that future load operation.
