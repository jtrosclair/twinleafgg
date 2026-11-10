# PrizeMap simulator contract

This contract was checked against the local `pokepuzzles` and `pokepuzzles-web`
repositories. It describes the puzzle simulator boundary; PrizeMap's own puzzle
attempt, completion, advertising, and account APIs remain the host app's concern.

## Load a snapshot

Existing published puzzles open
`https://sim-mobile.prizemap.app/sandbox-viewer#<stateData>`. The desktop host also
uses this page in an iframe. Preserve this route and fragment when changing the
simulator implementation.

The static deployment accepts the same fragment at
`https://sim-static.prizemap.app/sandbox-viewer#<stateData>`. Its public URL stays
stable while the page selects an immutable release internally.

`stateData` is a Base64-encoded `StateSerializer` JSON document. The document is
an array containing the player objects at index 0 and game state at index 1;
serialized references, card lists, markers, and card-name indexes must be restored
with the serializer. A plain `JSON.parse` does not produce a playable state.
`players[0]` is the human at the bottom of the board; `players[1]` is the opponent.
Saved player IDs are preserved: markers and card-effect state can also contain
player IDs, so changing only the top-level player objects would corrupt them.

PrizeMap's current converters emit plain rules/settings objects without serializer
type tags. The local loader hydrates those nodes before restoring references,
preserving supplied rules and filling defaults for newer options. Attached tools
use serialized `Card` references and attached energy uses a typed `energies`
`CardList`. The older auxiliary `energyCards` display field is preserved rather
than interpreted as additional attachments.

PrizeMap's current converters emit `rules` as a plain object, with
`gameSettings.rules` referring to it. Hydrate those supported rule fields into
the engine's `Rules` class while keeping that shared reference. Canonical
Pokémon attachments are represented by `cards`, an `energies` CardList, and
typed Card references in `tools`; `energyCards` is auxiliary display data.

The existing backend transport for this operation was the Socket.IO event
`core:createGameFromState`, with
`{ stateData, opponentUsername?, gameSettings?, winConditions? }`. PrizeMap's
players do not call a separate HTTP load-snapshot endpoint. The client-side
replacement must keep the public URL entry point while loading the state locally.

Snapshots can include `winConditions.selfDeckOut`, `winConditions.mustLose`, and
`winConditions.cardsInDeck`. Preserve these fields and the game engine's outcome
overrides when reporting success.

## Host bridge

The native host sends JSON using `WebView.postMessage`; Android and iOS can
deliver it on `document` or `window`. The iframe host sends the same JSON with
`contentWindow.postMessage`.

| Direction | Message | Meaning |
| --- | --- | --- |
| Simulator → host | `{ "type": "StateUpdate", "data": { "stateData": "..." } }` | Complete serialized state, including the initial loaded board. |
| Host → simulator | `{ "type": "PushStateChange", "data": { "stateData": "..." } }` | Restore a previous state for undo. |
| Host → simulator | `{ "type": "ResetGame", "data": {} }` | Restart the active puzzle from its retained initial state. |
| Simulator → host | `{ "type": "UndoDetected", "data": {} }` | Dismiss the previous result so the restored attempt can continue. |
| Simulator → host | `{ "type": "GameOver", "data": { "winner": "player1" } }` | Puzzle success. `player2` means failure. |
| Simulator → host | `{ "type": "TurnEnd", "data": {} }` | Human turn ended without success; also treated as failure. |

Completed attempts fade to the board background over 500 ms without showing a
simulator result modal. PrizeMap displays the outcome. Host history restoration
clears the fade and re-enables the board; reduced-motion settings skip the animation.

Native outbound messages are JSON strings delivered through
`window.ReactNativeWebView.postMessage`. Browser iframe outbound messages retain
the envelope `{ type: 'iframeEvent', data: message }` sent to `window.parent`.
The host recognizes `data.isError` on terminal messages as an engine error rather
than a normal puzzle failure.

Both native puzzle and draft players decode each `StateUpdate` and add it to undo
history only when `JSON.parse(atob(stateData))[1].prompts` is empty (or absent).
The initial state update is therefore necessary to undo the first move. Prompt
callbacks are live engine continuations; snapshots with pending prompts cannot
be treated as ordinary stable undo points.

## Reset the active puzzle

Wait for the initial `StateUpdate`, then send the reset command from the native
host:

```js
webViewRef.current?.postMessage(JSON.stringify({
  type: 'ResetGame',
  data: {}
}));
```

The equivalent injected helper is:

```js
webViewRef.current?.injectJavaScript('window.PrizeMapSimulator.reset(); true;');
```

The iframe host can send the same `ResetGame` message through its existing
`contentWindow.postMessage` transport. There is no visible reset button.
With no active game, reset is a no-op.

Reset restores the canonical snapshot retained after the puzzle successfully
loaded. It matches the initial `StateUpdate`, including any normalization and
initial dummy-opponent pass. Moves, `PushStateChange` and undo do not replace
this baseline; a successfully loaded new puzzle does. Reset clears local engine
history, pending attempt/prompt continuations and the result fade, then emits
`UndoDetected` followed by a fresh `StateUpdate`. There is no additional outbound
reset event. The board stays in the same page with the same URL, without
reloading or fetching game state. Artwork retains its ordinary lazy-loading and
browser-cache behavior.

Before sending reset, the native host should clear its own undo history. Seed
that history from the returned `StateUpdate` using the existing stable-snapshot
rule. Otherwise the host could offer an undo into the previous attempt even
though the simulator's local history was cleared.

[Reset verification](simulator-reset-results.json) records exact initial-state
restoration through the native-style and deployed iframe bridges, dialog cleanup,
reset after a win, and a second successful attempt after reset.

Do not emit `Reconnecting` for an intentional network disconnect: the host uses
it to remount the entire simulator. A local game must keep running offline.

## One human turn

The current host treats either `TurnEnd` or a `GameOver` loss as the end of an
attempt. Finish the attack, prize selection, replacement prompts, and resulting
engine effects before reporting the terminal result. A winning final state takes
precedence over an ordinary turn-ending failure. Allow undo to restore the
pre-result state and allow a new terminal result after restoration.

The old sandbox viewer selected the `Standard` `SimpleBot`, which uses the shared
default prompt resolvers. There is no separate named dummy CPU class in this
revision. A local dummy can reuse these resolvers to answer opponent-owned
prompts, then pass when required, without introducing multiplayer or persistence.

## Evidence in the host repositories

- `pokepuzzles/src/screens/PuzzleScreen.js`: `pushStateChange`, `handleMessage`,
  result handling, and restart/reconnect URL construction.
- `pokepuzzles/src/screens/DraftPlayScreen.js`: the corresponding draft flow.
- `pokepuzzles/tests/screens.test.cjs`: native bridge result/reconnect coverage.
- `pokepuzzles-web/app/app/play/[puzzleId]/page.tsx` and
  `app/app/play/draft/[draftId]/page.tsx`: iframe bridge handling.
- `pokepuzzles-web/app/learn/[puzzleId]/play/LearnPlayClient.tsx`: unauthenticated
  learning iframe flow.
- `pokepuzzles-web/app/app/editor/convert.ts`: generates serialized snapshot URLs.

The web editor's separate authoring validation proxy,
`pokepuzzles-web/app/api/converter/validate-state/route.ts`, still calls the
legacy server's `/v1/game/validate-state`. This simulator-only repository no
longer contains that server. Retiring the separately deployed validator also
requires migrating the editor caller; playing a supplied snapshot needs no API.

## Browser verification

The executable engine lives in `ptcg-server/src/client`, compiled with the
browser entry point into `ptcg-server/browser` before Angular builds. No running
backend or database is required. The session holds one game and bounded undo
history in memory. Normal startup uses the schema 2 image metadata and matching
hash/count manifest already embedded before Angular starts. It validates the
pair synchronously once, without metadata HTTP or IndexedDB work. Only older
bootstraps with both documents absent use the legacy metadata cache/HTTP path.
A partial or incompatible pair requests a reload. The hash covers the engine,
card implementations and checked-in image map, so rule fixes invalidate the
library too. No update polling runs during play.

Host the simulator on HTTPS (or localhost for development). Its initial download
loads a content-addressed static resource bundle containing UI images, fonts,
and translations before the board becomes interactive. Static presentation
resources use embedded data URLs. Game initialization and the initial
`StateUpdate` do not wait for card scans. Ordinary image elements use
`loading="lazy"` and `decoding="async"`; there is no all-card preload pass.
Facedown cards omit their face image nodes, so hidden deck, hand and prize faces
are requested only when revealed or opened through the UI. The browser chooses
when to download rendered lazy images near the viewport. The existing scan
sizes are preserved. An image failure uses
the local fallback and does not block game actions or the host bridge.

Card artwork uses browser HTTP caching, without a simulator Blob or IndexedDB
scan cache. Published releases resolve supported scans through the stable
same-origin `/card-images?url=...` proxy, so a frontend release change does not
change an image's browser cache key. Local and file-hosted pages use the original
image URLs. Ordinary cross-origin image display does not require a CORS fetch.
This flow has no service-worker dependency. Original serialized `imageUrl`
values and card image URLs remain unchanged in `StateUpdate` and undo snapshots;
presentation-only proxy URLs never enter that wire format. Readiness means the
game is playable, not that every image has arrived. A new puzzle can continue
downloading artwork after readiness, and offline artwork availability depends
on the browser cache rather than a guaranteed installed scan set.
Supported browser targets are Chrome/Edge 88+, Safari/iOS 14+, Firefox ESR, and
Samsung Internet 14+.

This fallback matters for PrizeMap's existing iOS app: its checked native
configuration does not opt into App-Bound Domains. WebKit disables service
workers in ordinary iOS WKWebViews without that opt-in or a browser entitlement.
The condition is explicit in the primary
[WKWebView source](https://github.com/WebKit/WebKit/blob/main/Source/WebKit/UIProcess/API/Cocoa/WKWebView.mm)
(`setServiceWorkersEnabled(false)`). Simulator bootstrapping must support this
environment without requiring an app release.

Build the client, then run the browser harness from the repository root:

```sh
npm run build
npm --prefix tools ci
npm --prefix tools exec -- playwright install chromium
npm --prefix tools run test:client-simulator
```

The normal client build scripts run both metadata generation and static-resource
finalization. Deploy the complete `ptcg-play/dist/ptcg-play` directory; invoking
`ng build` directly omits the final offline resource transformation.

To preview the simulator locally after building:

```sh
npm --prefix tools run serve:client-simulator
```

Open `http://localhost:4200/puzzle` to start a locally selected snapshot, or
`http://localhost:4200/sandbox-viewer` for the manual loader. The server only
serves the static client, with gzip compression and SPA route fallback. Use the
`localhost` hostname for the documented preview URL. Card scans are ordinary
images, so local display does not depend on the CDN permitting a CORS fetch.
Production pages use the supported same-origin image proxy.

The `/puzzle` shortcut uses `tools/.local-prizemap-puzzle.json` when present,
otherwise opening the empty manual loader. This ignored local file stores a published
puzzle's `stateData`, `name`, and `publishedAt`; `SIMULATOR_PUZZLE` can select a
different JSON file. It never changes the published puzzle or records attempts.

Focused engine and client-service checks are also available:

```sh
npm --prefix ptcg-server run test:client
node tools/test-client-services.cjs
```

The harness serves the actual static build with no game server. It exercises the
native and iframe bridge formats, including native without service workers, a
real attack and prize-taking win, host undo
and replay, dummy replacement, and a human promotion prompt during poison
checkup. A held-image-response case verifies that the initial `StateUpdate` and
visible board arrive before artwork completes. It checks native lazy/async image
attributes, the absence of image-preload links, and a hidden deck face that is
requested only after the pile opens. Separate offline gameplay checks wait for
currently visible images, then disconnect the browser and verify
that the static HTTP host receives no gameplay requests. Image request events
are recorded separately because ordinary browser cache lookups can emit them.
The harness also checks that startup
does not call authentication or game APIs, uses embedded metadata without
separate card-data requests, bypasses stale legacy metadata records, and refuses
an incompatible embedded library. Service tests also cover the legacy metadata
fallback, lazy image bindings, facedown image gating, image fallback and unchanged
serialized artwork URLs.
It also loads the shipped 120-card snapshot through the manual form at a mobile
viewport and preserves its player IDs 43/42. With networking disabled, it uses
PrizeMap's `PushStateChange` bridge to restore snapshots, plays and replays a
winning attack, and restores the original hand/deck ordering. The simulator
frame has no Undo or End your turn buttons; PrizeMap owns those host controls.

[Live lazy artwork verification](simulator-lazy-artwork-results.json) confirms
zero image preloads and hidden faces without image nodes, while the initial
`StateUpdate` and host undo work with a visible scan still pending. Opening
Phantom Maze's deck introduces 16 images, including nine source URLs absent from
the initial board; scan dimensions remain 736×1024.

Set `CLIENT_SIMULATOR_URL` to test an already running static/dev server instead,
or `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing Chromium installation.

## Simulator-only source boundary

`ptcg-play` now loads only the snapshot viewer, board, card dialogs, game prompts,
local settings, and host bridge. Its session has one local game. GameService has
no transport or remote fallback. Account, profile, friends, messaging, lobby,
multiplayer, deck-builder, replay-viewer, and administration modules are removed.

`ptcg-server` is the historical directory name of the pure card-engine package.
Its exports are the browser-safe engine and the explicit `ptcg-server/client`
entry. The application server, persistence/ORM, email, sockets, ranking, account
models, and server startup files have been removed. Keep the client entry out
of the root engine barrel: card definitions can import engine types from that
barrel, so eagerly importing the complete card registry there creates cycles.

Recorded real-puzzle playthroughs can be repeated against the current compiled
engine without a browser or any attempt submission:

```sh
node tools/replay-puzzle-solution.cjs tools/.puzzle-playthrough/phantom-maze.solution.json 10
```

The ignored fixture files retain the exact public snapshot and record physical
card IDs for choices, so a legal shuffle does not invalidate a recorded line.
The replay runner asserts a genuine human win and completed session.
