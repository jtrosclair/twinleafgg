# PrizeMap local simulator

A browser-only Pokémon TCG puzzle simulator. The complete executable card
library runs in one in-memory game, with a human turn, a dummy opponent that
resolves prompts, local undo, and PrizeMap snapshot/host-bridge compatibility.
There is no game server, login, multiplayer, account, or chat service.

Open the live simulator at **[sim-static.prizemap.app/sandbox-viewer](https://sim-static.prizemap.app/sandbox-viewer)**.
This stable URL serves fresh, `no-store, no-transform` HTML in place. Its asset base selects
one immutable release for the loaded page. A new opening or reload selects the
latest deployed release; an active puzzle keeps its existing code and artwork choices.
The visible URL stays `/sandbox-viewer` during internal table navigation.
The frame hides Undo and End turn controls; PrizeMap controls history restoration
through the existing host bridge.
The [upstream sync ledger](docs/upstream-sync.md) records which Twinleaf changes
have been ported, deferred, or still need review, along with compatibility tests.
The host can restart the active puzzle in place with `ResetGame` or
`window.PrizeMapSimulator.reset()`; the [bridge contract](docs/client-simulator-integration.md#reset-the-active-puzzle)
describes resetting host undo history and receiving the fresh initial state.
Completed attempts fade to the board background without a result modal. PrizeMap
receives the outcome and displays win/loss; restoring history reveals the board again.

## Run locally

Use Node 24 (`nvm use`). Development dependencies stay out of the delivered
simulator package.

```sh
npm --prefix ptcg-server ci
npm --prefix ptcg-play ci
npm --prefix tools ci
npm run build
npm start
```

Open **http://localhost:4200/puzzle** for the selected local PrizeMap puzzle, or
**http://localhost:4200/sandbox-viewer** to paste another serialized state.
A selected published puzzle lives in the ignored
`tools/.local-prizemap-puzzle.json`; otherwise `/puzzle` opens the empty puzzle input.
The client loads its embedded UI and initializes the game without waiting for
card artwork. Card images use native lazy loading and asynchronous decoding;
hidden faces are not requested until revealed or opened in a pile. Faces appear
as their images arrive. Card moves, prompts, randomness, undo and results run
locally while artwork may still be downloading.

The package bootstrap supplies card image metadata and its hash before Angular
starts. Normal setup validates it synchronously, with no card-metadata HTTP or
IndexedDB work. Missing or mismatched metadata requires a reload; the complete
package supplies its own matching executable catalogue and ordered image table.
Artwork uses ordinary image URLs and the
browser's HTTP cache, without a simulator Blob or IndexedDB scan cache. A new
puzzle can require image downloads after the board is playable; network access
and cache retention determine when those faces appear. Existing image sizes and
original artwork URLs in snapshots stay unchanged. Embedded static UI images
continue to use data URLs.

Energy symbols, basic-energy attachment icons, the Twinleaf card back and loading
wordmark use small, self-contained SVGs. Other UI artwork uses WebP quality 75
with lossless alpha; the five foil-effect masks remain lossless. Display sizes
and remote card scans are unchanged. Legacy PNG and WebP image paths remain
aliases to their replacements, without storing duplicate image bytes.
The 11 energy types derive from the original vectors and colors extracted
from page 4 of the official Pokémon rulebook.
[Source and extraction provenance](docs/simulator-official-energy-provenance.json)
records the PDF digest and individual source paths. The empty-cost indicator
uses the same colorless disk without a glyph.
Energy SVG coordinates and curves are simplified within a measured visual
tolerance. Isolated glyph silhouettes, canvas alpha and foreground/background
colors must each meet a 95% fidelity floor at 24, 108 and 512 pixels wide;
empty background cannot hide a damaged glyph. The committed hashes bind these
checks to the reviewed artwork. These metrics allow small visual differences
and do not claim pixel identity. Twinleaf branding retains its reviewed bytes.
The bootstrap uses percent-encoded SVG text so download compression can reuse
repeated markup and path commands. Raster images still use Base64.
The committed asset manifest records dimensions, hashes and each conversion's
actual provenance. `npm --prefix ptcg-play run assets:check` checks these without
a native image dependency; `assets:optimize` also verifies the committed files
without reencoding them. Only packaged SVGs are accepted by the image bindings.

Builds produce the local `ptcg-play/dist/ptcg-play` and deployable
`ptcg-play/cloudflare-public`. The latter contains a SHA-256 release directory,
a verified downloadable ZIP, and a small `simulator-manifest.json` for clients
to check before opening a puzzle. Byte-identical builds reuse the content hash;
every build still gets a distinct build ID. Deployment restores and verifies
the currently published release before uploading the next one, including from
a clean CI checkout. Existing local release directories are also retained.

Cloudflare serves the package, card metadata and presentation resources as
immutable static assets. Its small Worker handles stable public HTML, the
mutable manifest, pinned release routes and an allowlisted card-scan cache. Both Limitless
`/tpci/` and `/tpc/` artwork paths use a stable same-origin `/card-images` proxy,
shared across releases. Gameplay runs
entirely in the client. Deploy with `npm run deploy:cloudflare` after installing
`cloudflare` development dependencies and authenticating Wrangler. The guarded
deployment checks that production compilation, finalization and size budgets
succeeded, source inputs are unchanged, and every packaged file and ZIP still
matches its digest. Worker/domain-only updates can deploy the same verified
frontend with `npm --prefix cloudflare run deploy`.

Both supported deployment commands also synchronize the PrizeMap web API
engine. Before publishing the simulator, they prepare an isolated checkout of
PrizeMap web's current `main`, regenerate its engine and featured-card artwork
catalogue from this exact verified simulator build, and run engine and route
tests. Artwork uses the simulator's locally attested image map; the refresh
does not contact another image-index service. After Cloudflare is published,
they check the live simulator package, push the generated files only when the
engine or artwork changed, and wait for both to be live on PrizeMap. The
existing web checkout and its uncommitted work are never committed or deployed.
This process needs Node 24, Git access to `jtrosclair/pokepuzzles-web`, network
access for a clean dependency install, and a sibling `pokepuzzles-web` checkout
whose `origin` identifies that repository. It fails visibly if any step fails;
if the simulator is already published, the error prints a command to retry the
web sync from the retained staging directory. Direct `wrangler deploy` bypasses
these safeguards and must not be used for simulator releases.

## Board background

The playmat follows the website theme: near-black with a purple hexagon grid in
dark mode, and light gray with a softer purple grid in light mode. Both use an
80px repeating tile for a tighter grid. The artwork is
[`board-background.svg`](ptcg-play/src/assets/board-background.svg) and
[`board-background-light.svg`](ptcg-play/src/assets/board-background-light.svg).
Edit those SVGs to change either grid. The background switches with the existing
`prizemap-theme-change` event and stays in place behind cards, hand and prompts,
including when a completed puzzle fades out.

The `--ptcg-board-*` properties in the shared and theme-specific blocks of
[`ptcg-play/src/theme/global.scss`](ptcg-play/src/theme/global.scss) control its
artwork, surface color, size, repeat and position. They also accept ordinary
image URLs. For example, the host can apply an SVG, PNG, JPEG or WebP playmat
without rebuilding or reloading the puzzle:

```js
const style = document.documentElement.style;
style.setProperty('--ptcg-board-background-image', 'url("https://example.com/playmat.webp")');
style.setProperty('--ptcg-board-background-size', 'cover');
style.setProperty('--ptcg-board-background-repeat', 'no-repeat');
```

Remove these inline properties to restore the grid for the current theme. A
custom inline image override stays in place across theme changes. Local artwork is
embedded in the standalone package; after editing or replacing an asset, update
its dimensions and SHA-256 entry in `ptcg-play/scripts/ui-assets-manifest.json`
and run `npm --prefix ptcg-play run assets:check` before building. Newly drawn SVGs
use the `authored-svg` conversion kind. Remote replacements need a connection.

## Verify

```sh
npm test
npm --prefix ptcg-server run test:cards
node ptcg-play/scripts/finalize-client-build.spec.cjs
npm --prefix tools run test:client-simulator
```

The broad `test:cards` command reports existing card/legacy-test failures rather
than hiding them. Browser checks need a Playwright Chromium installation.

[PrizeMap snapshot and bridge contract](docs/client-simulator-integration.md)

[Reset function verification](docs/simulator-reset-results.json)

[Mobile drag regression verification](docs/simulator-touch-drag-results.json)
reproduces the previous stuck gesture with the real Angular template and touch
backend in a Node DOM test, then checks first and repeated drops with the fix.
This is included in `npm test`; physical WebView gestures are a separate check.

[Dengo Turo → Nest Ball regression verification](docs/simulator-dengo-prompt-results.json)
uses the exact public puzzle to verify that returning Active Gholdengo and
promoting any of the five benched Pokémon releases the hand-dragging lock.
The first Nest Ball touch drag is covered by the Angular/touch backend tests.

[Client package cache contract](docs/simulator-cache-contract.md)

[Latest SVG simplification and verification](docs/simulator-svg-simplification-results.json)
records the smaller energy artwork, defined visual fidelity checks and measured
package savings. Intrinsic dimensions and card image URLs remain unchanged.
The [previous conservative SVG optimization](docs/simulator-svg-optimization-results.json)
records the earlier pixel-identical minification and SVG packaging changes.

[Previous SVG/WebP package reduction and verification](docs/simulator-svg-webp-results.json)
records a 34.16% smaller ZIP (3,428,046 → 2,257,095 bytes), official energy vector
paths, Twinleaf SVG branding, WebP75 artwork, unchanged URLs for all 13,483 cards,
301 automated tests and 40 winning puzzle replays. The live URL and immutable
package caching remain unchanged. The
[previous package reduction](docs/simulator-package-reduction-results.json)
records the earlier lossless-image and metadata cleanup.

[Puzzle startup benchmarks and next improvements](docs/simulator-startup-investigation.md)
includes paired production-release measurements, compatible loader fixes, and
payload compression/preloading experiments across five public puzzles.

[Compatible puzzle payload trimming](docs/simulator-payload-trimming.md)
documents default omission in the existing schema, measured savings and a
local tool for converting existing puzzle URLs or JSON fixtures.

[Cloudflare build, delivery and verification](docs/simulator-cloudflare.md)

[Current lazy artwork verification](docs/simulator-lazy-artwork-results.json)
confirms zero image preloads, no image nodes for hidden faces, and working
initial state/host undo while a visible image is pending. Scans retain their
736×1024 dimensions. Opening Phantom Maze's deck adds 16 images, including nine
source URLs absent from the initial board. The small desktop sample did not
show a full-page speedup.

[Historical background artwork verification](docs/simulator-background-artwork-results.json)
records the previous preload release, including a playable board and host undo while an
image response was held for 16 seconds, late image arrival and failed-image
fallback before the switch to on-demand lazy loading. Original image sizes were
preserved. Warm board mounting was faster;
the small desktop sample did not show a full-page paint speedup.

The earlier [Blob-cache comparison](docs/simulator-initialization-results.json)
recorded a desktop median warm navigation to
board paint of 396 ms versus 541 ms; those measurements predate background image
loading and do not describe current lazy-loading performance.

[Historical puzzle setup measurements](docs/simulator-setup-performance.json)
record the earlier data-URL implementation and distinguish desktop warm-cache
timings from local application marks. They are not current lazy-loading, phone or
cold-download benchmarks. Native filesystem package installation still requires
integration in the separate mobile host; that host has not been modified here.
