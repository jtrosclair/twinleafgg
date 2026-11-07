#!/usr/bin/env node
'use strict';

// Run after `npm run build` from the repository root.
// Install the browser once: `cd tools && npx playwright install chromium`.
// Optional: CLIENT_SIMULATOR_URL=http://localhost:4200
//           PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome-headless-shell
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const zlib = require('node:zlib');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
require(path.join(root, 'ptcg-server/node_modules/ts-node')).register({
  project: path.join(root, 'ptcg-server/tsconfig.json'),
  transpileOnly: true,
});
const source = p => require(path.join(root, 'ptcg-server/src', p));
const { State, GamePhase } = source('game/store/state/state');
const { SpecialCondition } = source('game/store/card/card-types');
const { Player } = source('game/store/state/player');
const { CardList } = source('game/store/state/card-list');
const { PokemonCardList } = source('game/store/state/pokemon-card-list');
const { StateSerializer } = source('game/serializer/state-serializer');
const { CARD_LIBRARY_SCHEMA_VERSION } = source('client/card-metadata');
const { Charmander } = source('sets/set-base-set/charmander');
const { Squirtle } = source('sets/set-base-set/squirtle');
const { Bulbasaur } = source('sets/set-base-set/bulbasaur');
const { FireEnergy } = source('sets/set-base-set-energy/fire-energy');

function fixture(lethal = true, humanPrizeCount = 1, humanCheckupKO = false, hiddenDeckFace = false) {
  const state = new State();
  const human = new Player();
  const opponent = new Player();
  human.id = 8;
  human.name = 'Puzzle Player';
  opponent.id = 13;
  opponent.name = 'Dummy Opponent';
  human.bench = Array.from({ length: 5 }, () => new PokemonCardList());
  opponent.bench = Array.from({ length: 5 }, () => new PokemonCardList());
  const cards = [];
  const add = Card => {
    const card = new Card();
    card.id = cards.length;
    cards.push(card);
    return card;
  };
  const energy = () => add(FireEnergy);
  human.active.cards = [add(Charmander), energy()];
  if (humanCheckupKO) {
    human.active.damage = 40;
    human.active.specialConditions = [SpecialCondition.POISONED];
    const humanReplacement = new PokemonCardList();
    humanReplacement.cards = [add(Squirtle)];
    human.bench[0] = humanReplacement;
  }
  opponent.active.cards = [add(Squirtle)];
  opponent.active.damage = lethal ? 30 : 0;
  // Require the dummy opponent to answer replacement selection after the KO.
  const replacement = new PokemonCardList();
  replacement.cards = [add(Squirtle)];
  opponent.bench[0] = replacement;
  for (const player of [human, opponent]) {
    for (const zone of [player.active, ...player.bench, player.discard, player.lostzone, player.stadium]) {
      zone.isPublic = true;
    }
    player.deck.cards = Array.from({ length: 4 }, energy);
    if (hiddenDeckFace && player === human) { player.deck.cards[0] = add(Bulbasaur); }
    player.prizes = Array.from({ length: player === human ? humanPrizeCount : 3 }, () => {
      const prize = new CardList();
      prize.cards = [energy()];
      prize.isSecret = true;
      return prize;
    });
  }
  state.players = [human, opponent];
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = 3;
  state.activePlayer = 0;
  state.rules.attackFirstTurn = true;
  state.gameSettings.timeLimit = 0;
  state.cardNames = cards.map(card => card.fullName);
  return Buffer.from(new StateSerializer().serialize(state)).toString('base64');
}

const mimeTypes = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};
async function serveBuild() {
  const build = path.join(root, 'ptcg-play/dist/ptcg-play');
  assert.ok(fs.existsSync(path.join(build, 'index.html')), 'Build ptcg-play before running browser verification');
  const requests = [];
  const server = http.createServer((req, res) => {
    requests.push(req.url);
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(build, '.' + pathname);
    if (!file.startsWith(build + path.sep) && file !== build) {
      res.writeHead(403).end();
      return;
    }
    if (!path.extname(file) || file === build) file = path.join(build, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { url: `http://127.0.0.1:${server.address().port}`, requests,
    close: () => new Promise(resolve => server.close(resolve)) };
}

function terminal(message) {
  return message.type === 'GameOver' || message.type === 'TurnEnd';
}
function serverApiRequest(requestUrl) {
  return /^https?:/.test(requestUrl) && /\/(?:v1|socket\.io)(?:\/|\?|$)/.test(new URL(requestUrl).pathname);
}
function cardImageRequest(requestUrl) {
  if (!/^https?:/.test(requestUrl)) return false;
  const url = new URL(requestUrl);
  return /^(?:\/releases\/[a-f0-9]{64})?\/card-images$/.test(url.pathname)
    || url.hostname === 'images.pokemontcg.io'
    || /^limitlesstcg\.nyc3(?:\.cdn)?\.digitaloceanspaces\.com$/.test(url.hostname);
}
function originalImageUrl(requestUrl) {
  const url = new URL(requestUrl);
  return /^(?:\/releases\/[a-f0-9]{64})?\/card-images$/.test(url.pathname)
    ? url.searchParams.get('url') : url.href;
}
async function waitVisibleArtwork(page) {
  // This is an optional offline-test checkpoint, not simulator readiness.
  // Offscreen lazy images may never load until scrolled into view, and future
  // reveals can start new requests. Wait only for currently visible images.
  await page.waitForFunction(() => [...document.querySelectorAll('img')].filter(image => {
    const rect = image.getBoundingClientRect();
    const style = getComputedStyle(image);
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0
      && rect.top < innerHeight && rect.left < innerWidth
      && style.visibility !== 'hidden' && style.display !== 'none' && style.opacity !== '0';
  }).every(image => image.complete), undefined, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
}
async function messages(page) {
  return page.evaluate(() => window.__simulatorMessages);
}
async function waitMessage(page, type, count = 1) {
  await page.waitForFunction(({ type, count }) =>
    window.__simulatorMessages.filter(message => message.type === type).length >= count,
  { type, count }, { timeout: 30000 });
}
async function restore(page, stateData, count) {
  await page.evaluate(stateData => window.dispatchEvent(new MessageEvent('message', {
    data: JSON.stringify({ type: 'PushStateChange', data: { stateData } }),
  })), stateData);
  await waitMessage(page, 'UndoDetected', count);
}
async function assertResultFade(page, complete) {
  await page.waitForFunction(complete => {
    const table = document.querySelector('.ptcg-table');
    const board = table?.querySelector('ptcg-board');
    return table && board && table.classList.contains('is-complete') === complete
      && Number(getComputedStyle(board).opacity) === (complete ? 0 : 1);
  }, complete);
  assert.equal(await page.locator('ptcg-prompt-game-over').count(), 0,
    'PrizeMap handles results; the simulator must not render its own game-over dialog');
}
async function attack(page) {
  // Use the same visible card/attack controls as a player. Do not call Angular
  // components or engine services from the test.
  const active = page.locator('.ptcg-board-player').last()
    .locator('.ptcg-board-active ptcg-board-card .ptcg-board-card > ptcg-card').last();
  await active.click();
  await page.locator('mat-dialog-container .attack-name', { hasText: 'Scratch' }).click();
}
async function promoteHuman(page) {
  await page.locator('.ptcg-board-selection-overlay').waitFor({ state: 'visible' });
  await page.locator('.ptcg-board-player').last()
    .locator('.ptcg-board-bench ptcg-board-card .ptcg-board-card > ptcg-card').first().click();
  await page.locator('.ptcg-board-selection-overlay .confirm-button').click();
}

async function verify(browser, url, mode, staticServer) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 },
    serviceWorkers: mode === 'native-no-service-worker' ? 'block' : 'allow' });
  await context.addInitScript(mode => {
    window.__simulatorMessages = [];
    // Ordinary PrizeMap WKWebViews do not opt into App-Bound Domains, so WebKit
    // does not expose Service Workers. The same simulator must still work there.
    if (mode === 'native-no-service-worker') delete Navigator.prototype.serviceWorker;
    if (mode.startsWith('native')) {
      window.ReactNativeWebView = {
        postMessage: message => window.__simulatorMessages.push(JSON.parse(message)),
      };
    } else {
      window.addEventListener('message', event => {
        if (event.data && event.data.type === 'iframeEvent') {
          window.__simulatorMessages.push(event.data.data);
        }
      });
    }
  }, mode);
  const page = await context.newPage();
  const errors = [];
  const consoleErrors = [];
  const afterVisibleArtworkRequests = [];
  const allRequests = [];
  let offline = false;
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  context.on('request', request => {
    allRequests.push(request.url());
    if (offline && /^https?:/.test(request.url())) afterVisibleArtworkRequests.push(request);
  });
  page.on('websocket', socket => errors.push(`Unexpected WebSocket: ${socket.url()}`));
  try {
    await page.goto(`${url}/sandbox-viewer#${fixture()}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await waitMessage(page, 'StateUpdate');
    await page.locator('ptcg-board .ptcg-board-player').last().waitFor({ state: 'visible' });
    await waitVisibleArtwork(page);
    const initial = (await messages(page)).find(message => message.type === 'StateUpdate').data.stateData;
    const initialState = JSON.parse(Buffer.from(initial, 'base64').toString())[1];
    assert.equal(initialState.prompts.length, 0, 'Initial undo snapshot must be stable');
    assert.equal((await messages(page)).filter(terminal).length, 0, 'Loading a snapshot must not end the attempt');
    assert.deepEqual(allRequests.filter(serverApiRequest), [],
      'Startup must not request authentication, config, game, or socket APIs');
    const visibleArtworkScreenshot = `/tmp/twinleaf-client-simulator-${mode}-visible-artwork.png`;
    await page.screenshot({ path: visibleArtworkScreenshot, fullPage: true });
    const boardImages = await page.locator('ptcg-board img').evaluateAll(images => ({
      count: images.length,
      remote: images.filter(image => /^https?:/.test(image.currentSrc)).length,
      placeholders: images.filter(image => image.currentSrc.startsWith('data:image/svg+xml')).length,
      failed: images.filter(image => image.complete && !image.naturalWidth).length,
    }));
    assert.equal(boardImages.failed, 0, 'The visible-artwork board must have no broken card or UI images');
    assert.ok(boardImages.remote > 0, 'Card faces must use browser-native image URLs');

    const serverMarker = staticServer?.requests.length;
    offline = true;
    await context.setOffline(true);
    await attack(page);
    await waitMessage(page, 'GameOver');
    let results = (await messages(page)).filter(terminal);
    assert.equal(results.length, 1, 'A win must emit one terminal event');
    assert.equal(results[0].data.winner, 'player1');
    await assertResultFade(page, true);

    // Host undo has to rebuild engine continuations, clear the prior result and
    // retain a playable table while all network is disabled.
    await restore(page, initial, 1);
    await assertResultFade(page, false);
    await attack(page);
    await page.waitForFunction(() => window.__simulatorMessages.filter(m =>
      m.type === 'GameOver' && m.data.winner === 'player1').length === 2);
    results = (await messages(page)).filter(terminal);
    assert.equal(results.length, 2, 'An undone attempt must be allowed to finish again');
    await assertResultFade(page, true);

    await restore(page, fixture(true, 2), 2);
    await assertResultFade(page, false);
    await attack(page);
    await page.waitForFunction(() => window.__simulatorMessages.filter(m =>
      m.type === 'GameOver' || m.type === 'TurnEnd').length >= 3);
    results = (await messages(page)).filter(terminal);
    assert.equal(results.length, 3, 'A nonwinning KO must finish after replacement and prizes');
    assert.ok(results[2].type === 'TurnEnd' || results[2].data.winner === 'player2');
    await assertResultFade(page, true);
    const replacementSnapshot = (await messages(page)).filter(m => m.type === 'StateUpdate').pop().data.stateData;
    const replacedOpponent = JSON.parse(Buffer.from(replacementSnapshot, 'base64').toString())[0][1];
    assert.equal(replacedOpponent.bench.filter(slot => slot.cards.length > 0).length, 0);
    assert.equal(replacedOpponent.active.cards.length, 1, 'Dummy must promote its remaining bench Pokemon');

    await restore(page, fixture(false, 1, true), 3);
    await assertResultFade(page, false);
    await attack(page);
    // Poison checkup KOs the human active. The engine must wait for a real
    // human-owned replacement prompt before reporting the turn-ending loss.
    await page.locator('.ptcg-board-selection-overlay').waitFor({ state: 'visible' });
    assert.equal((await messages(page)).filter(terminal).length, 3, 'Pending human prompt must delay the terminal event');
    await assertResultFade(page, false);
    await page.screenshot({ path: `/tmp/twinleaf-client-simulator-${mode}-human-prompt.png`, fullPage: true });
    await promoteHuman(page);
    await page.waitForFunction(() => window.__simulatorMessages.filter(m =>
      m.type === 'GameOver' || m.type === 'TurnEnd').length >= 4);
    results = (await messages(page)).filter(terminal);
    assert.equal(results.length, 4, 'Nonlethal attack must end the one-turn attempt once');
    assert.ok(results[3].type === 'TurnEnd' || results[3].data.winner === 'player2');
    await assertResultFade(page, true);
    assert.equal(await page.locator('ptcg-content > mat-progress-bar').count(), 0,
      'A finished one-turn attempt must stop the waiting indicator');
    await page.screenshot({ path: `/tmp/twinleaf-client-simulator-${mode}-turn-complete.png`, fullPage: true });
    // Cached ordinary <img> bindings may still emit browser request events.
    // Game logic must remain local even when the browser cannot reach artwork.
    const imageRequestsAfterVisibleArtwork = afterVisibleArtworkRequests
      .filter(request => request.resourceType() === 'image').map(request => request.url());
    const nonImageRequestsAfterVisibleArtwork = afterVisibleArtworkRequests
      .filter(request => request.resourceType() !== 'image').map(request => request.url());
    assert.deepEqual(nonImageRequestsAfterVisibleArtwork, [],
      'Playing and undoing must not request non-image resources or server APIs');
    if (staticServer) {
      assert.deepEqual(staticServer.requests.slice(serverMarker), [], 'Static host must receive zero gameplay requests');
    }
    assert.deepEqual(errors, [], 'No runtime errors or sockets are permitted');

    // Immutable releases carry both metadata documents in their bootstrap.
    // Neither cold nor warm startup needs card-data HTTP or IndexedDB work.
    offline = false;
    await context.setOffline(false);
    const payload = requestUrl => /\/cards\.[a-f0-9]{64}\.json(?:\?|$)/.test(requestUrl);
    const manifest = requestUrl => /\/cards\.hash\.json(?:\?|$)/.test(requestUrl);
    assert.equal(allRequests.filter(payload).length, 0, 'Cold startup must use embedded card metadata');
    assert.equal(allRequests.filter(manifest).length, 0, 'Cold startup must use the embedded metadata manifest');
    let marker = allRequests.length;
    await page.goto(`${url}/sandbox-viewer?verify=warm#${fixture()}`, { waitUntil: 'domcontentloaded' });
    await waitMessage(page, 'StateUpdate');
    assert.equal(allRequests.slice(marker).filter(manifest).length, 0, 'Pinned warm startup must not recheck immutable metadata over HTTP');
    assert.equal(allRequests.slice(marker).filter(payload).length, 0, 'Warm startup must reuse embedded metadata');

    // A stale prior-build IndexedDB record must neither delay nor replace the
    // already validated metadata in this package.
    await page.evaluate(schemaVersion => new Promise((resolve, reject) => {
      const open = indexedDB.open('cards', schemaVersion);
      open.onupgradeneeded = () => {
        if (!open.result.objectStoreNames.contains('cards')) open.result.createObjectStore('cards');
      };
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const db = open.result;
        const transaction = db.transaction('cards', 'readwrite');
        const store = transaction.objectStore('cards');
        store.put({ schemaVersion, hash: 'deliberately-stale-cache', cards: [] }, 'data');
        transaction.oncomplete = () => { db.close(); resolve(); };
        transaction.onerror = () => { db.close(); reject(transaction.error); };
      };
    }), CARD_LIBRARY_SCHEMA_VERSION);
    marker = allRequests.length;
    await page.goto(`${url}/sandbox-viewer?verify=stale-cache#${fixture()}`, { waitUntil: 'domcontentloaded' });
    await waitMessage(page, 'StateUpdate');
    assert.equal(allRequests.slice(marker).filter(manifest).length, 0);
    assert.equal(allRequests.slice(marker).filter(payload).length, 0, 'An old IndexedDB library must not trigger a redundant payload download');

    // Reject an incompatible embedded pair before opening the board. The helper
    // tests separately cover manifest/package freshness across deployments.
    await page.route('**/simulator-static.*.js', async route => {
      const response = await route.fetch();
      const source = await response.text();
      await route.fulfill({ status: 200, contentType: 'text/javascript', body: source +
        '\n;globalThis.__SIMULATOR_STATIC__.json["assets/simulator/cards.hash.json"].hash = "' + 'f'.repeat(64) + '";\n' });
    });
    marker = allRequests.length;
    await page.goto(`${url}/sandbox-viewer?verify=published-update#${fixture()}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.card-data-download-title', { hasText: 'Reload this page' }).waitFor();
    assert.equal((await messages(page)).filter(m => m.type === 'StateUpdate').length, 0);
    assert.equal(await page.locator('ptcg-board').count(), 0);
    assert.equal(allRequests.slice(marker).filter(payload).length, 0);
    assert.equal(allRequests.slice(marker).filter(manifest).length, 0);
    assert.deepEqual(allRequests.filter(serverApiRequest), [],
      'The complete snapshot flow must not request server APIs');
    return { mode, initialSnapshot: true, realAttack: true, prizesTaken: true, humanPrompt: true,
      opponentReplacement: true, undoAndReplay: true, oneTurnFailure: true,
      completionFadeAndHostRestore: true,
      offlineGameplayAfterVisibleArtwork: true,
      nonImageRequestsAfterVisibleArtwork: nonImageRequestsAfterVisibleArtwork.length,
      imageRequestsAfterVisibleArtwork: imageRequestsAfterVisibleArtwork.length,
      embeddedMetadataSkipsCardDataRequests: true,
      staleIndexedDBCacheBypassed: true, mismatchedEmbeddedMetadataRequiresReload: true,
      visibleArtworkScreenshot, boardImages };
  } catch (error) {
    await page.screenshot({ path: `/tmp/twinleaf-client-simulator-${mode}-failure.png`, fullPage: true });
    fs.writeFileSync(`/tmp/twinleaf-client-simulator-${mode}-failure.html`, await page.content());
    const diagnosticMessages = (await messages(page)).map(message => {
      if (message.type !== 'StateUpdate') return message;
      const state = JSON.parse(Buffer.from(message.data.stateData, 'base64').toString())[1];
      return { type: message.type, turn: state.turn, phase: state.phase,
        activePlayer: state.activePlayer, winner: state.winner, prompts: state.prompts };
    });
    console.error(JSON.stringify({ mode, url: page.url().split('#')[0],
      messages: diagnosticMessages, errors, consoleErrors,
      afterVisibleArtworkRequests: afterVisibleArtworkRequests.map(request => request.url()) }, null, 2));
    throw error;
  } finally {
    await context.close();
  }
}

async function verifyLazyArtwork(browser, url) {
  const hiddenArtworkUrl = 'https://images.pokemontcg.io/base1/44.png?simulator-lazy-deck=1';
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
  await context.addInitScript(hiddenArtworkUrl => {
    window.__simulatorMessages = [];
    window.ReactNativeWebView = { postMessage: value => window.__simulatorMessages.push(JSON.parse(value)) };
    localStorage.setItem('customCardImages', JSON.stringify({ 'BS 44': hiddenArtworkUrl }));
  }, hiddenArtworkUrl);
  let releaseImages;
  const imageGate = new Promise(resolve => { releaseImages = resolve; });
  let firstHeldImage;
  const imageStarted = new Promise(resolve => { firstHeldImage = resolve; });
  let heldScanRequests = 0;
  let closing = false;
  const errors = [];
  const requests = [];
  await context.route('**/*', async route => {
    if (route.request().resourceType() === 'image' && cardImageRequest(route.request().url())) {
      heldScanRequests++;
      firstHeldImage();
      await imageGate;
      if (originalImageUrl(route.request().url()) === hiddenArtworkUrl) {
        // Only this test-specific custom face is stubbed. The assertion concerns
        // its first request after a real pile interaction, not image quality.
        await route.fulfill({ status: 200, contentType: 'image/png',
          body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64') });
        return;
      }
    }
    try { await route.continue(); }
    catch (error) { if (!closing) errors.push(String(error)); }
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  page.on('websocket', socket => errors.push(`Unexpected WebSocket: ${socket.url()}`));
  let imageTimeout;
  try {
    await page.goto(`${url}/sandbox-viewer?verify=lazy-artwork#${fixture(true, 1, false, true)}`,
      { waitUntil: 'domcontentloaded', timeout: 120000 });
    await Promise.race([imageStarted, new Promise((_resolve, reject) => {
      imageTimeout = setTimeout(() => reject(new Error('No browser-native card image request was started')), 30000);
    })]);
    clearTimeout(imageTimeout);
    // All scan responses remain held here. Await-all artwork startup would
    // deadlock this assertion instead of publishing the playable game.
    await waitMessage(page, 'StateUpdate');
    await page.locator('ptcg-board .ptcg-board-player').last().waitFor({ state: 'visible' });
    assert.ok(heldScanRequests > 0);
    assert.equal((await messages(page)).filter(terminal).length, 0);
    assert.equal(await page.locator('link[rel="preload"][as="image"]').count(), 0,
      'Lazy artwork must not create all-card image preload links');
    const imageAttributes = await page.locator('ptcg-card img.ptcg-card-scan').evaluateAll(images =>
      images.map(image => ({ loading: image.getAttribute('loading'), decoding: image.getAttribute('decoding') })));
    assert.ok(imageAttributes.length > 0);
    assert.ok(imageAttributes.every(image => image.loading === 'lazy' && image.decoding === 'async'),
      'Rendered card faces must use native lazy loading and async decoding');
    assert.equal(requests.filter(cardImageRequest).some(request => originalImageUrl(request) === hiddenArtworkUrl), false,
      'The Bulbasaur face, present only in the facedown deck, must not be requested initially');
    const hiddenFaceBound = await page.locator('.deck-card img').evaluateAll((images, hiddenArtworkUrl) =>
      images.some(image => decodeURIComponent(image.getAttribute('src') || '').includes(hiddenArtworkUrl)), hiddenArtworkUrl);
    assert.equal(hiddenFaceBound, false, 'A facedown deck must not bind its hidden face URL');
    const pendingImages = await page.locator('ptcg-board img').evaluateAll(images =>
      images.filter(image => /^https?:/.test(image.src) && !image.complete).length);
    assert.ok(pendingImages > 0, 'The board must be visible while scan responses are still unresolved');
    const screenshot = '/tmp/twinleaf-client-simulator-lazy-artwork.png';
    await page.screenshot({ path: screenshot, fullPage: true });
    releaseImages();
    await waitVisibleArtwork(page);
    const revealedImageRequest = page.waitForRequest(request => cardImageRequest(request.url())
      && originalImageUrl(request.url()) === hiddenArtworkUrl);
    await page.locator('.ptcg-board-player').last().locator('.deck-click-overlay').click();
    await page.locator('ptcg-card-info-list-popup').waitFor({ state: 'visible' });
    await revealedImageRequest;
    await waitVisibleArtwork(page);
    assert.deepEqual(requests.filter(serverApiRequest), []);
    assert.deepEqual(errors, []);
    return { mode: 'lazy-artwork', initialSnapshotBeforeArtwork: true,
      visibleBoardBeforeArtwork: true, noImagePreloadLinks: true, nativeLazyAndAsync: true,
      hiddenDeckFaceDeferredUntilPileOpen: true,
      heldScanRequests, pendingImagesAtBoardReady: pendingImages, screenshot };
  } finally {
    clearTimeout(imageTimeout);
    closing = true;
    releaseImages();
    await context.close();
  }
}

async function verifySavedSnapshot(browser, url, staticServer) {
  const saved = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,
    'tools/fixtures/deck-out-with-dengo.snapshot.json.gz'))).toString('utf8'));
  const savedStateData = saved.stateData;
  const original = JSON.parse(Buffer.from(savedStateData, 'base64').toString());
  const playerIds = original[0].map(player => player.id);
  assert.equal(new Set(playerIds).size, 2);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  await context.addInitScript(() => {
    delete Navigator.prototype.serviceWorker;
    window.__simulatorMessages = [];
    window.ReactNativeWebView = { postMessage: value => window.__simulatorMessages.push(JSON.parse(value)) };
  });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  const gameplayRequests = [];
  const gameplayImageRequests = [];
  let offline = false;
  context.on('request', request => {
    requests.push(request.url());
    if (offline && /^https?:/.test(request.url())) {
      (request.resourceType() === 'image' ? gameplayImageRequests : gameplayRequests).push(request.url());
    }
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('websocket', socket => errors.push(`Unexpected WebSocket: ${socket.url()}`));
  try {
    await page.goto(`${url}/sandbox-viewer?verify=saved-snapshot`, { waitUntil: 'domcontentloaded' });
    await page.locator('.sandbox-viewer-status.success').waitFor({ state: 'visible' });
    assert.equal(await page.locator('textarea').inputValue(), '');
    await page.locator('textarea').fill(savedStateData);
    await page.locator('.sandbox-viewer-actions button').first().click();
    await page.waitForFunction(() => window.__simulatorMessages.some(message => message.type === 'StateUpdate')
      || Boolean(document.querySelector('.sandbox-viewer-error')),
    undefined, { timeout: 120000 });
    const initialMessage = (await messages(page)).find(message => message.type === 'StateUpdate');
    assert.ok(initialMessage, `The saved published snapshot must load: ${(await page.locator('.sandbox-viewer-error').allTextContents()).join(' ')}`);
    await page.locator('ptcg-board').waitFor({ state: 'visible' });
    await waitVisibleArtwork(page);
    const initial = initialMessage.data.stateData;
    const decoded = JSON.parse(Buffer.from(initial, 'base64').toString());
    assert.deepEqual(decoded[0].map(player => player.id), playerIds, 'Legacy player IDs must remain intact');
    assert.equal(decoded[1].activePlayer, 0, 'The imported puzzle must be playable by the human');
    assert.equal((await messages(page)).filter(terminal).length, 0);
    assert.equal(await page.getByRole('button', { name: 'End your turn', exact: true }).count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Undo', exact: true }).count(), 0);

    // PrizeMap owns undo. Use its native snapshot message, then play and replay
    // a genuine winning attack through visible controls without a frame toolbar.
    // Keep the imported player IDs so this remains the same host/session identity.
    const winningFixture = JSON.parse(Buffer.from(fixture(), 'base64').toString());
    winningFixture[0].forEach((player, index) => { player.id = decoded[0][index].id; });
    await restore(page, Buffer.from(JSON.stringify(winningFixture)).toString('base64'), 1);
    const playable = (await messages(page)).filter(message => message.type === 'StateUpdate').pop().data.stateData;
    // This unrelated compatibility fixture can introduce new artwork. Let its
    // currently visible images finish before the optional offline game check.
    await waitVisibleArtwork(page);
    const serverMarker = staticServer?.requests.length;
    offline = true;
    await context.setOffline(true);
    await attack(page);
    await waitMessage(page, 'GameOver');
    assert.equal((await messages(page)).filter(terminal).length, 1);
    assert.equal((await messages(page)).filter(terminal)[0].data.winner, 'player1');
    await assertResultFade(page, true);
    await restore(page, playable, 2);
    await assertResultFade(page, false);
    await attack(page);
    await waitMessage(page, 'GameOver', 2);
    assert.deepEqual((await messages(page)).filter(terminal).map(message => message.data.winner), ['player1', 'player1']);
    await assertResultFade(page, true);

    // Restore the original legacy snapshot as well, including its unnormalized
    // physical card IDs, hand/deck ordering and initial dummy-pass result.
    await restore(page, initial, 3);
    await assertResultFade(page, false);
    const rewound = (await messages(page)).filter(message => message.type === 'StateUpdate').pop().data.stateData;
    const rewoundState = JSON.parse(Buffer.from(rewound, 'base64').toString());
    assert.equal(rewoundState[1].turn, decoded[1].turn, 'Host undo must restore the playable human turn');
    assert.equal(rewoundState[1].activePlayer, 0);
    assert.deepEqual(rewoundState[0].map(player => player.id), playerIds);
    assert.deepEqual(rewoundState[0].map(player => player.hand.cards), decoded[0].map(player => player.hand.cards));
    assert.deepEqual(rewoundState[0].map(player => player.deck.cards), decoded[0].map(player => player.deck.cards));
    assert.deepEqual(gameplayRequests, [], 'Legacy imported gameplay must not request non-image resources or APIs');
    assert.deepEqual(requests.filter(serverApiRequest), []);
    assert.deepEqual(errors, []);
    if (staticServer) assert.deepEqual(staticServer.requests.slice(serverMarker), []);
    return { mode: 'saved-snapshot-native-no-service-worker', viewport: '390x844',
      cards: original[1].cardNames.length, playerIds: decoded[0].map(player => player.id),
      initialDummyPass: original[1].activePlayer !== decoded[1].activePlayer,
      manualLoad: true, hostUndo: true, winningReplay: true, frameToolbarAbsent: true,
      offlineGameplayAfterVisibleArtwork: true,
      nonImageRequestsAfterVisibleArtwork: gameplayRequests.length,
      imageRequestsAfterVisibleArtwork: gameplayImageRequests.length };
  } catch (error) {
    await page.screenshot({ path: '/tmp/twinleaf-client-simulator-saved-snapshot-failure.png', fullPage: true });
    console.error(JSON.stringify({ mode: 'saved-snapshot', url: page.url().split('#')[0], errors, gameplayRequests }, null, 2));
    throw error;
  } finally {
    await context.close();
  }
}

if (process.argv.includes('--print-fixture')) {
  console.log(fixture());
  process.exit(0);
}

(async () => {
  const staticServer = process.env.CLIENT_SIMULATOR_URL ? null : await serveBuild();
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}),
    });
    const results = [];
    const modes = (process.env.CLIENT_SIMULATOR_MODES || 'lazy-artwork,native,iframe,native-no-service-worker,saved-snapshot').split(',');
    for (const mode of modes) {
      const url = process.env.CLIENT_SIMULATOR_URL || staticServer.url;
      results.push(mode === 'lazy-artwork' ? await verifyLazyArtwork(browser, url)
        : mode === 'saved-snapshot' ? await verifySavedSnapshot(browser, url, staticServer)
        : await verify(browser, url, mode, staticServer));
    }
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } finally {
    if (browser) await browser.close();
    if (staticServer) await staticServer.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
