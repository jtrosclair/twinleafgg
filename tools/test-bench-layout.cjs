#!/usr/bin/env node
'use strict';

// Build first. Exercises board geometry and real drag -> engine -> host updates
// in phone, embedded PrizeMap, and desktop viewports.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
require(path.join(root, 'ptcg-server/node_modules/ts-node')).register({
  project: path.join(root, 'ptcg-server/tsconfig.json'), transpileOnly: true,
});
const source = p => require(path.join(root, 'ptcg-server/src', p));
const { State, GamePhase } = source('game/store/state/state');
const { Player } = source('game/store/state/player');
const { CardList } = source('game/store/state/card-list');
const { PokemonCardList } = source('game/store/state/pokemon-card-list');
const { StateSerializer } = source('game/serializer/state-serializer');
const { Charmander } = source('sets/set-base-set/charmander');
const { Charmeleon } = source('sets/set-base-set/charmeleon');
const { Squirtle } = source('sets/set-base-set/squirtle');
const { Bulbasaur } = source('sets/set-base-set/bulbasaur');
const { Charizardex } = source('sets/set-obsidian-flames/charizard-ex');
const { AreaZeroUnderdepths } = source('sets/set-stellar-crown/area-zero-underdepths');
const { FireEnergy } = source('sets/set-base-set-energy/fire-energy');

function fixture({ expanded = true, full = true, bothExpanded = false, opponentCount, benchIndices, varied = false, prizeCount = 3, opponentDiscardCount = 3, playerDiscardCount = 3, deckCount = 6, playerLostCount = 2, opponentLostCount = 3 } = {}) {
  const variety = varied ? [source('sets/set-destined-rivals/torchic').Torchic,
    source('sets/set-twilight-masquerade/drakloak').Drakloak,
    source('sets/set-twilight-masquerade/munkidori').Munkidori,
    source('sets/set-shrouded-fable/fezandipiti-ex').Fezandipitiex,
    Bulbasaur, source('sets/set-twilight-masquerade/dreepy').Dreepy,
    Charmander, Squirtle] : null;
  const state = new State(), human = new Player(), opponent = new Player(), cards = [];
  human.id = 8; opponent.id = 13; human.name = 'Puzzle Player'; opponent.name = 'Opponent';
  const add = Card => { const card = new Card(); card.id = cards.length; cards.push(card); return card; };
  human.active.cards = [add(Charizardex)];
  opponent.active.cards = [add(bothExpanded ? Charizardex : Squirtle)];
  for (const [player, capacity] of [[human, expanded ? 8 : 5], [opponent, bothExpanded ? 8 : 5]]) {
    player.bench = Array.from({ length: capacity }, (_, i) => {
      const list = new PokemonCardList(); list.isPublic = true;
      const indices = player === opponent ? benchIndices?.opponent : benchIndices?.player;
      const occupied = indices ? indices.includes(i) : player === opponent ? i < (opponentCount === undefined ? capacity : opponentCount) : full || i === 0 || i === 2;
      if (occupied) list.cards = [add(varied ? (player === opponent ? Charmander : variety[i % variety.length]) : i === (indices?.[0] ?? 0) ? Charmander : Squirtle)];
      return list;
    });
    player.active.isPublic = true;
    player.deck.cards = Array.from({ length: deckCount }, () => add(FireEnergy));
    player.prizes = Array.from({ length: prizeCount }, () => {
      const prize = new CardList(); prize.cards = [add(FireEnergy)]; prize.isSecret = true; return prize;
    });
  }
  opponent.discard.cards = Array.from({ length: opponentDiscardCount }, (_, i) => add([Bulbasaur, FireEnergy, Squirtle][i % 3]));
  opponent.discard.isPublic = true;
  human.discard.cards = Array.from({ length: playerDiscardCount }, (_, i) => add([Squirtle, FireEnergy, Bulbasaur][i % 3]));
  human.discard.isPublic = true;
  human.lostzone.cards = Array.from({ length: playerLostCount }, () => add(FireEnergy));
  opponent.lostzone.cards = Array.from({ length: opponentLostCount }, () => add(Bulbasaur));
  human.lostzone.isPublic = opponent.lostzone.isPublic = true;
  if (expanded) { human.stadium.cards = [add(AreaZeroUnderdepths)]; human.stadium.isPublic = true; }
  human.hand.cards = [add(Bulbasaur), add(Bulbasaur), add(Charmeleon), add(FireEnergy)];
  state.players = [human, opponent]; state.phase = GamePhase.PLAYER_TURN;
  state.turn = 5; state.activePlayer = 0; state.gameSettings.timeLimit = 0;
  state.cardNames = cards.map(card => card.fullName);
  return Buffer.from(new StateSerializer().serialize(state)).toString('base64');
}

async function serve() {
  const build = path.resolve(root, process.env.CLIENT_SIMULATOR_BUILD_DIR || 'ptcg-play/dist/ptcg-play');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  const server = http.createServer((req, res) => {
    let file = path.resolve(build, '.' + new URL(req.url, 'http://localhost').pathname);
    if (file !== build && !file.startsWith(build + path.sep)) return res.writeHead(403).end();
    if (!path.extname(file) || file === build) file = path.join(build, 'index.html');
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

async function load(page, origin, snapshot, embedded = false) {
  page.setDefaultTimeout(15000);
  const url = origin + '/sandbox-viewer#' + snapshot;
  let frame;
  if (embedded) {
    // Use a real host origin without mounting a second Angular app in the parent.
    await page.route(origin + '/__bench-host', route => route.fulfill({ contentType: 'text/html', body: '<meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;overflow:hidden}header{height:104px}iframe{display:block;width:100%;height:calc(100% - 104px);border:0}</style><header>PrizeMap host</header><iframe></iframe>' }));
    await page.goto(origin + '/__bench-host', { waitUntil: 'domcontentloaded' });
    await page.locator('iframe').evaluate((el, url) => el.src = url, url);
    frame = await (await page.locator('iframe').elementHandle()).contentFrame();
  } else { await page.goto(url, { waitUntil: 'domcontentloaded' }); frame = page.mainFrame(); }
  await frame.waitForSelector('.hand-card');
  await frame.waitForFunction(() => parseFloat(getComputedStyle(document.querySelector('ptcg-board')).getPropertyValue('--card-size')) > 0);
  return frame;
}

async function geometry(frame) {
  return frame.evaluate(() => {
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom }; };
    const hand = rect(document.querySelector('.hand-card'));
    return { width: innerWidth, height: innerHeight, hand,
      benches: [...document.querySelectorAll('.ptcg-board-bench')].map(bench => ({ ...rect(bench),
        color: getComputedStyle(bench).borderColor, radius: getComputedStyle(bench).borderRadius,
        slots: [...bench.children].map(rect).filter(r => r.w > 0), capacity: bench.children.length })),
      cards: [...document.querySelectorAll('.ptcg-board-active > *, .ptcg-board-bench > *')].map(rect).filter(r => r.w > 0),
      zones: [...document.querySelectorAll('.mobile-zone-grid')].filter(el => getComputedStyle(el).display !== 'none').map(rect),
      zoneButtons: [...document.querySelectorAll('.mobile-zone-grid .zone-item')].filter(el => getComputedStyle(el.parentElement).display !== 'none').map(rect),
      rails: [...document.querySelectorAll('.zone-rail')].map(el => ({ ...rect(el),
        label: el.querySelector('.zone-rail-label').textContent, count: Number(el.querySelector('.zone-rail-tab').textContent), disabled: el.disabled,
        background: getComputedStyle(el.querySelector('.zone-rail-panel')).backgroundColor, color: getComputedStyle(el).color,
        labelRect: rect(el.querySelector('.zone-rail-label')), panel: rect(el.querySelector('.zone-rail-panel')), tab: rect(el.querySelector('.zone-rail-tab')) })),
      opponentCounts: [...document.querySelectorAll('.opponent-counts [role="status"]')].map(el => ({ ...rect(el),
        label: el.querySelector('.board-hand-label').textContent.trim(), value: Number(el.querySelector('.board-hand-total').textContent),
        pointerEvents: getComputedStyle(el).pointerEvents, background: getComputedStyle(el).backgroundColor,
        tabIndex: el.tabIndex, interactive: !!el.querySelector('button, a, input, [tabindex]') })),
      opponentPanelCount: document.querySelectorAll('.ptcg-board-player.upside-down .mobile-zone-grid, .ptcg-board-player.upside-down .desktop-zones').length,
      sideLabels: [...document.querySelectorAll('.mobile-zone-grid .zone-label')].map(el => el.textContent.trim()),
      handCounts: [...document.querySelectorAll('.board-hand-count')].map(el => ({ ...rect(el),
        value: Number(el.querySelector('.board-hand-total').textContent), pointerEvents: getComputedStyle(el).pointerEvents,
        role: el.getAttribute('role'), tabIndex: el.tabIndex, inSidePanel: !!el.closest('.mobile-zone-grid') })),
      scrollWidth: document.documentElement.scrollWidth,
      boardScroll: document.querySelector('ptcg-board').scrollTop,
      boardHeight: document.querySelector('ptcg-board').scrollHeight,
      boardClientHeight: document.querySelector('ptcg-board').clientHeight,
      handSpace: parseFloat(document.querySelector('ptcg-board').style.getPropertyValue('--hand-space')),
      activeCards: [...document.querySelectorAll('.ptcg-board-active ptcg-board-card')].map(rect),
      endTurn: { ...rect(document.querySelector('.player-end-turn')), disabled: document.querySelector('.player-end-turn').disabled, background: getComputedStyle(document.querySelector('.player-end-turn')).backgroundColor },
      stadium: rect(document.querySelector('.shared-stadium')),
      lostZones: [...document.querySelectorAll('.lost-zone-button')].map(el => ({ ...rect(el),
        count: Number(el.querySelector('.field-zone-total').textContent), opponent: el.classList.contains('opponent-lost') })),
      playerDeck: (() => { const button = document.querySelector('.player-deck-count'); return { ...rect(button),
        value: Number(button.querySelector('.field-zone-total').textContent), disabled: button.disabled,
        pointerEvents: getComputedStyle(button).pointerEvents, background: getComputedStyle(button).backgroundColor }; })(),
    };
  });
}

function assertVisible(g, desktop) {
  assert(g.scrollWidth <= g.width, 'no horizontal overflow');
  assert(g.boardHeight <= g.boardClientHeight, 'board must fit without vertical scrolling');
  for (const rect of [...g.cards, ...g.benches, ...g.zones, ...g.rails, g.stadium, ...g.lostZones, g.playerDeck, g.endTurn]) {
    assert(rect.w > 0 && rect.h > 0 && rect.x >= -1 && rect.right <= g.width + 1 && rect.y + g.boardScroll >= -1,
      'every board card/zone must be fully within the viewport: ' + JSON.stringify(rect));
    assert(rect.bottom <= g.hand.y - 22 + 1,
      'every board card/zone must clear the hand stacks: ' + JSON.stringify(rect));
  }
  for (const card of g.activeCards) assert(Math.abs(card.w - (g.width <= 390 && g.height <= 600 ? 72 : 87)) < 1, 'Active size follows the compact phone rule');
  assert.equal(g.zones.length, 0, 'both side panels have been removed');
  assert.equal(g.zoneButtons.length, 0);
  assert.equal(g.rails.length, 3, 'opponent discard plus our prizes and discard');
  assert.deepEqual(g.rails.map(rail => rail.label), ['Discard', 'Prizes', 'Discard']);
  assert.equal(g.opponentPanelCount, 0);
  const opponentCards = g.benches[0].slots;
  assert(Math.abs(g.rails[0].panel.y - Math.min(...opponentCards.map(card => card.y))) < 1
    && Math.abs(g.rails[0].panel.bottom - Math.max(...opponentCards.map(card => card.bottom))) < 1,
    'opponent Discard body must align with the top and bottom of the bench cards');
  if (!desktop) {
    for (const [index, rail] of g.rails.entries()) {
      const bench = g.benches[index === 0 ? 0 : 1];
      assert.equal(rail.count, 3);
      assert(!rail.disabled);
      assert(rail.labelRect.y >= rail.panel.y - 1 && rail.labelRect.bottom <= rail.panel.bottom + 1, 'pile labels must fit their compact panel');
      if (index === 0) assert(rail.labelRect.bottom <= rail.tab.y + 1, 'opponent label must clear its count tab');
      else assert(rail.labelRect.y >= rail.tab.bottom - 1, 'player label must clear its count tab');
      if (index === 1) assert(rail.right <= bench.x + 1, 'our prizes stay to the left of our bench');
      else assert(rail.x >= bench.right - 1, 'discard buttons belong to the right of their benches');
      if (index > 0) assert(rail.y >= bench.y - 1 && rail.bottom <= bench.bottom + 1, 'player pile buttons stay within bench height');
    }
    assert(g.rails[0].tab.y > g.rails[0].panel.y, 'opponent count tabs downward');
    for (const rail of g.rails.slice(1)) assert(rail.tab.y < rail.panel.y, 'player counts tab upward');
  }
  assert.equal(g.playerDeck.value, 6);
  assert.equal(g.playerDeck.disabled, false);
  assert.equal(g.playerDeck.pointerEvents, 'auto');
  assert.equal(g.playerDeck.background, g.rails[1].background, 'Deck must match the pile-button theme');
  assert(!g.endTurn.disabled);
  assert.equal(g.endTurn.background, 'rgb(255, 255, 255)');
  for (const button of [g.playerDeck, g.endTurn]) assert(Math.abs((button.x - g.activeCards[1].right) - (g.width - button.right)) < 1, 'right-side buttons have equal space to the Active and screen edge');
  assert(Math.abs(g.endTurn.x - g.playerDeck.x) < 1 && Math.abs(g.playerDeck.y - g.endTurn.bottom - 12) < 1, 'End Turn sits above Deck with a 12px gap');
  assert(g.playerDeck.x > g.activeCards[1].right && Math.abs(g.playerDeck.y - g.activeCards[1].y - (g.width >= 700 && g.width < 990 && g.height < 500 ? 50 : 0)) < 1,
    'our interactive Deck button belongs at the top-right of our field');
  assert(g.playerDeck.right <= g.width && g.playerDeck.bottom <= g.height, 'Deck button fits inside the viewport');
  assert.equal(g.lostZones.length, 2);
  assert.deepEqual(g.lostZones.map(zone => zone.count), [3, 2]);
  assert(g.lostZones[0].bottom <= g.stadium.y - 5, 'opponent Lost sits above Stadium');
  assert(g.lostZones[1].y >= g.stadium.bottom + 5, 'our Lost sits below Stadium');
  if (!(g.width >= 700 && g.width < 990 && g.height < 500)) {
    const boundary = (g.activeCards[0].bottom + g.activeCards[1].y) / 2;
    assert(Math.abs(g.stadium.y + g.stadium.h / 2 - boundary) < 1, 'Stadium is centered on the player boundary');
  }
  for (const control of [g.stadium, ...g.lostZones, g.playerDeck, g.endTurn]) for (const rect of [...g.benches, ...g.rails, ...g.activeCards]) {
    assert(rect.y >= control.bottom - 0.1 || rect.bottom <= control.y + 0.1 || rect.right <= control.x + 0.1 || rect.x >= control.right - 0.1,
      'Stadium, Lost and Deck must not overlap cards or pile buttons: ' + JSON.stringify({ control, rect }));
  }
  assert.deepEqual(g.opponentCounts.map(count => count.label), ['Hand', 'Deck', 'Prizes']);
  assert.deepEqual(g.opponentCounts.map(count => count.value), [0, 6, 3]);
  for (const count of g.opponentCounts) {
    assert.equal(count.pointerEvents, 'none');
    assert.equal(count.tabIndex, -1);
    assert.equal(count.interactive, false);
    assert.equal(count.background, 'rgb(255, 255, 255)');
    assert(count.y <= (g.width >= 700 && g.height < 500 ? 60 : 5) && count.x >= 0 && count.right <= g.width);
    for (const rect of [...g.benches, ...g.rails, ...g.activeCards]) {
      assert(rect.y >= count.bottom + 3 || rect.bottom <= count.y - 3 || rect.right <= count.x - 3 || rect.x >= count.right + 3,
        'opponent counts must clear cards and pile buttons');
    }
  }
  assert.equal(g.handCounts.length, 2, 'each player has an independent hand count');
  for (const count of g.handCounts) {
    assert(count.y >= 0 && count.bottom <= g.height && count.w < 90 && count.h <= 24, 'hand counts must be compact and inside the viewport');
    assert.equal(count.pointerEvents, 'none');
    assert.equal(count.role, 'status');
    assert.equal(count.tabIndex, -1);
    assert.equal(count.inSidePanel, false);
  }
  assert(g.handCounts[0].y <= 5 && g.handCounts[1].bottom > g.height - 40, 'hand counts belong at the top and bottom of the board');
  assert(g.benches[0].slots[0].w <= g.benches[1].slots[0].w + 0.01, 'opponent cards must never be larger than ours');
  const [bench, count] = [g.benches[0], g.handCounts[0]];
  assert(bench.y >= count.bottom + 3 || bench.right <= count.x - 3 || bench.x >= count.right + 3,
    'opponent bench must not overlap the top hand count');
  for (const [index, bench] of g.benches.entries()) {
    assert.equal(bench.radius, '0px');
    const minimumWidth = !desktop && g.height < 568 ? (g.benches[1].slots[0].w > 36 ? 32 : Math.min(31, (g.width - 116 - 42) / 8)) : !desktop && index === 0 ? 32 : !desktop && g.height <= 600 ? Math.min(50, (g.width - 116 - 18) / 4) : 60;
    for (const slot of bench.slots) assert(slot.w >= minimumWidth,
      `bench ${index} must retain at least ${minimumWidth}px card width, got ${slot.w}`);
    const rows = new Set(bench.slots.map(slot => Math.round(slot.y)));
    if (desktop || index === 1) {
      const expectedRows = desktop ? 1 : Math.max(1, Math.ceil(bench.slots.length / Math.ceil(bench.capacity / 2)));
      if (g.height < 568 && !desktop) assert(rows.size === 1 || rows.size === expectedRows);
      else assert.equal(rows.size, expectedRows);
    } else assert(rows.size >= 1 && rows.size <= 2, 'opponent uses at most two rows');
    for (const card of bench.slots) {
      assert(card.x >= bench.x && card.right <= bench.right && card.y >= bench.y && card.bottom <= bench.bottom,
        'all cards must be inside the bench outline');
    }
  }
  assert.notEqual(g.benches[0].color, g.benches[1].color);
}

async function touchDrag(page, frame, source, destination) {
  const from = await source.boundingBox(), to = await destination();
  const cdp = await page.context().newCDPSession(page);
  const send = (type, x, y) => cdp.send('Input.dispatchTouchEvent', {
    type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, radiusX: 4, radiusY: 4, force: 1 }]
  });
  const start = { x: from.x + from.width / 2, y: from.y + 32 };
  await send('touchStart', start.x, start.y);
  await send('touchMove', start.x, start.y - 30);
  for (let step = 1; step <= 10; step++) {
    await send('touchMove', start.x + (to.x - start.x) * step / 10, start.y - 30 + (to.y - start.y + 30) * step / 10);
    await page.waitForTimeout(20);
  }
  await send('touchEnd'); await cdp.detach();
}

async function latest(frame) {
  return frame.evaluate(() => window.__benchMessages.filter(m => m.type === 'StateUpdate').at(-1).data.stateData);
}
function playerState(data) {
  const [context, state] = JSON.parse(Buffer.from(data, 'base64').toString());
  const ref = state.players[0];
  const player = ref._type === 'Ref' ? ref.path.split('.').map(Number).reduce((object, key) => object[key], [context, state]) : ref;
  return { ...player, bench: player.bench.map(slot => ({ ...slot, names: slot.cards.map(index => state.cardNames[index]) })) };
}
function pokemonName(slot) { return slot.names; }

async function visualBench(bench) {
  return bench.evaluate(element => [...element.children].map((slot, index) => {
    const bounds = slot.getBoundingClientRect();
    return { index, occupied: !slot.classList.contains('bench-slot-empty'), x: bounds.x, y: bounds.y };
  }).filter(slot => slot.occupied).sort((a, b) => Math.round(a.y - b.y) || a.x - b.x));
}

async function verifyInteractions(browser, origin, touch, viewport) {
  const context = await browser.newContext({ viewport: viewport || { width: touch ? 390 : 1280, height: 844 }, isMobile: touch, hasTouch: touch });
  try {
    const page = await context.newPage();
    await context.addInitScript(() => { window.__benchMessages = []; window.ReactNativeWebView = { postMessage: text => window.__benchMessages.push(JSON.parse(text)) }; });
    process.stderr.write(`Checking ${touch ? 'touch' : 'mouse'} bench drops\n`);
    const frame = await load(page, origin, fixture({ expanded: false, full: false, benchIndices: { player: [1,3] } }));
    assert.equal(await frame.locator('.board-hand-count-bottom .board-hand-total').textContent(), '4');
    const bench = frame.locator('.ptcg-board-bench').last();
    const initial = await latest(frame);
    const basic = frame.locator('.hand-card[aria-label^="Bulbasaur,"]');
    // Drop in padding, which has no per-card drop target.
    const padding = async () => { const r = await bench.boundingBox(); return { x: r.x + 3, y: r.y + r.height / 2 }; };
    if (touch) await touchDrag(page, frame, basic, padding);
    else {
      const from = await basic.boundingBox(), to = await padding();
      await page.mouse.move(from.x + from.width / 2, from.y + 30); await page.mouse.down();
      await page.mouse.move(to.x, to.y, { steps: 16 }); await page.mouse.up();
    }
    await frame.waitForFunction(before => window.__benchMessages.filter(m => m.type === 'StateUpdate').at(-1).data.stateData !== before, initial);
    let afterBasic = await latest(frame); const basicState = playerState(afterBasic);
    assert(pokemonName(basicState.bench[0]).includes('Bulbasaur BS'), 'padding drop should fill the first empty engine slot');
    assert.equal(basicState.bench[3].cards.length, 1, 'occupied slot must remain unchanged');
    assert.deepEqual((await visualBench(bench)).map(slot => slot.index), [1,3,0], 'the third Pokemon must append visually');
    // Repeat onto a Pokemon whose visual position differs from its engine slot.
    const occupied = bench.locator('.ptcg-board-drop-target').nth(3);
    if (touch) await touchDrag(page, frame, basic, async () => { const r = await occupied.boundingBox(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    else await basic.dragTo(occupied);
    await frame.waitForFunction(before => window.__benchMessages.filter(m => m.type === 'StateUpdate').at(-1).data.stateData !== before, afterBasic);
    afterBasic = await latest(frame);
    assert(pokemonName(playerState(afterBasic).bench[2]).includes('Bulbasaur BS'), 'occupied-card drop should fill the next open slot');
    assert.deepEqual((await visualBench(bench)).map(slot => slot.index), [1,3,0,2], 'the fourth Pokemon must append visually');
    const evolution = frame.locator('.hand-card[aria-label^="Charmeleon,"]');
    const target = bench.locator('.ptcg-board-drop-target').nth(1);
    if (touch) await touchDrag(page, frame, evolution, async () => { const r = await target.boundingBox(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    else await evolution.dragTo(target);
    await frame.waitForFunction(before => window.__benchMessages.filter(m => m.type === 'StateUpdate').at(-1).data.stateData !== before, afterBasic);
    const evolved = playerState(await latest(frame));
    assert.equal(await frame.locator('.board-hand-count-bottom .board-hand-total').textContent(), '1', 'hand count must update after playing cards');
    assert(pokemonName(evolved.bench[1]).includes('Charmeleon BS'), 'evolution must stay on its chosen engine slot after display packing');
    assert(pokemonName(evolved.bench[0]).includes('Bulbasaur BS'));
    assert(pokemonName(evolved.bench[2]).includes('Bulbasaur BS'));
    assert.equal(evolved.bench[4].cards.length, 0);
    // Host undo/restoration can change the stadium and both bench capacities.
    await frame.evaluate(stateData => window.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({ type: 'PushStateChange', data: { stateData } })
    })), fixture({ expanded: false, full: false }));
    await frame.waitForFunction(() => [...document.querySelectorAll('.ptcg-board-bench')].at(-1).children.length === 5);
    assert.equal(await bench.locator('.ptcg-board-drop-target').count(), 5);
    const standardWidth = (await bench.boundingBox()).width;
    await frame.evaluate(stateData => window.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({ type: 'PushStateChange', data: { stateData } })
    })), fixture({ bothExpanded: true }));
    await frame.waitForFunction(() => [...document.querySelectorAll('.ptcg-board-bench')].every(bench => bench.children.length === 8));
    assert((await bench.boundingBox()).width > standardWidth, 'restored capacity must stretch the bench');
    return { mode: touch ? 'touch' : 'mouse', firstAvailablePaddingDrop: true, firstAvailableOccupiedDrop: true, preciseEvolution: true, capacityRestore: true };
  } finally { await context.close(); }
}

module.exports = { fixture, load, geometry, assertVisible, verifyInteractions, verifyPileActions, verifyEndTurn, verifyBenchPacking, verifyBenchAppend };

async function verifyBenchAppend(browser, origin, touch) {
  const results = [];
  for (const capacity of [5,8]) {
    const context = await browser.newContext({ viewport: touch ? { width:375,height:537 } : { width:1280,height:800 }, isMobile:touch, hasTouch:touch });
    try {
      await context.addInitScript(() => { window.__benchMessages=[]; window.ReactNativeWebView={ postMessage:text=>window.__benchMessages.push(JSON.parse(text)) }; });
      const page=await context.newPage();
      const frame=await load(page, origin, fixture({ expanded:capacity===8, benchIndices:{ player:[1,2,3,4] } }));
      const bench=frame.locator('.ptcg-board-bench').last();
      const initial=await latest(frame), before=await visualBench(bench);
      assert.deepEqual(before.map(slot=>slot.index), [1,2,3,4]);
      const basic=frame.locator('.hand-card[aria-label^="Bulbasaur,"]');
      if(touch) await touchDrag(page,frame,basic,async()=>{const r=await bench.boundingBox();return{x:r.x+3,y:r.y+r.height/2};});
      else await basic.dragTo(bench.locator('.ptcg-board-drop-target').nth(1));
      await frame.waitForFunction(before=>window.__benchMessages.filter(m=>m.type==='StateUpdate').at(-1).data.stateData!==before,initial);
      const played=await latest(frame), after=await visualBench(bench);
      assert(pokemonName(playerState(played).bench[0]).includes('Bulbasaur BS'));
      assert.deepEqual(after.map(slot=>slot.index), [1,2,3,4,0], 'a new fifth Pokemon must use the fifth visual spot');
      for(const slot of before){const current=after.find(item=>item.index===slot.index);assert(Math.abs(current.x-slot.x)<1&&Math.abs(current.y-slot.y)<1,'existing Pokemon must stay in their spots');}
      const evolution=frame.locator('.hand-card[aria-label^="Charmeleon,"]');
      const target=bench.locator('.ptcg-board-drop-target').nth(1);
      if(touch) await touchDrag(page,frame,evolution,async()=>{const r=await target.boundingBox();return{x:r.x+r.width/2,y:r.y+r.height/2};});
      else await evolution.dragTo(target);
      await frame.waitForFunction(before=>window.__benchMessages.filter(m=>m.type==='StateUpdate').at(-1).data.stateData!==before,played);
      assert(pokemonName(playerState(await latest(frame)).bench[1]).includes('Charmeleon BS'));
      assert.deepEqual((await visualBench(bench)).map(slot=>slot.index),[1,2,3,4,0],'evolving must preserve visual order');
      for(const [stateData,expected] of [[played,[1,2,3,4,0]],[initial,[1,2,3,4]],[played,[1,2,3,4,0]]]){
        await frame.evaluate(stateData=>window.dispatchEvent(new MessageEvent('message',{data:JSON.stringify({type:'PushStateChange',data:{stateData}})})),stateData);
        await frame.waitForFunction(expected=>[...document.querySelectorAll('.ptcg-board-bench')].at(-1).querySelectorAll(':scope > :not(.bench-slot-empty)').length===expected,expected.length);
        assert.deepEqual((await visualBench(bench)).map(slot=>slot.index),expected,'Undo/redo must restore the visual bench order');
      }
      if(touch&&capacity===5){
        await frame.waitForFunction(()=>[...document.images].filter(image=>{const r=image.getBoundingClientRect();return r.width>0&&r.top<innerHeight&&r.bottom>0;}).every(image=>image.complete));
        await page.screenshot({path:'/tmp/prizemap-fifth-bench-pokemon.png'});
      }
      results.push({capacity,fifthVisualSpot:true,existingPokemonStationary:true,evolution:true,undoRedo:true});
    } finally { await context.close(); }
  }
  return {benchAppend:touch?'touch':'mouse',results};
}

async function verifyBenchPacking(browser, origin) {
  const results = [];
  for (const [width, height] of [[375,537], [402,743], [430,828], [1280,800]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 990, hasTouch: width < 990 });
    try {
      const page = await context.newPage();
      const frame = await load(page, origin, fixture({ expanded: false,
        benchIndices: { player: [1,2,3,4], opponent: [1,3] }, varied: true }));
      for (const expanded of [false, true]) {
        if (expanded) {
          await frame.evaluate(stateData => window.dispatchEvent(new MessageEvent('message', {
            data: JSON.stringify({ type: 'PushStateChange', data: { stateData } })
          })), fixture({ bothExpanded: true, benchIndices: { player: [1,2,4,5,7], opponent: [1,3,5,6,7] }, varied: true }));
          await frame.waitForFunction(() => document.querySelector('.ptcg-board-bench').children.length === 8);
        }
        const benches = await frame.locator('.ptcg-board-bench').evaluateAll(elements => elements.map(bench => {
          const bounds = bench.getBoundingClientRect();
          return { top: bounds.top + 6, left: bounds.left + 6, columns: Number(bench.style.getPropertyValue('--bench-columns')),
            cards: [...bench.children].map((card, index) => {
              const r = card.getBoundingClientRect();
              return { index, occupied: !card.classList.contains('bench-slot-empty'), x: r.x, y: r.y, w: r.width, h: r.height };
            }).filter(card => card.occupied) };
        }));
        for (const bench of benches) {
          for (const [rank, card] of bench.cards.entries()) {
            const expectedRow = Math.floor(rank / bench.columns), expectedColumn = rank % bench.columns;
            assert(Math.abs(card.y - (bench.top + expectedRow * (card.h + (bench === benches[0] && width < 990 ? 4 : 6)))) < 1,
              'occupied cards must fill the top row before using the next row');
            assert(Math.abs(card.x - (bench.left + expectedColumn * (card.w + (bench === benches[0] && width < 990 ? 4 : 6)))) < 1,
              'occupied cards must fill each visual row from left to right');
          }
        }
        const g = await geometry(frame);
        assert(g.boardHeight <= g.boardClientHeight, 'packing must not introduce board scrolling');
        results.push({ width, height, capacity: expanded ? 8 : 5,
          ownTopRow: benches[1].cards.filter(card => Math.abs(card.y - benches[1].top) < 1).length });
      }
    } finally { await context.close(); }
  }
  return { benchPacking: true, results };
}

async function verifyStablePositions(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 402, height: 743 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    const frame = await load(page, origin, fixture());
    const initial = await geometry(frame);
    const restore = async (snapshot, topCapacity) => {
      await frame.evaluate(stateData => window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify({ type: 'PushStateChange', data: { stateData } })
      })), snapshot);
      await frame.waitForFunction(capacity => document.querySelector('.ptcg-board-bench').children.length === capacity, topCapacity);
      return geometry(frame);
    };
    const expanded = await restore(fixture({ bothExpanded: true }), 8);
    assertVisible(expanded, false);
    for (const [name, before, after] of [
      ['Active cards', initial.activeCards, expanded.activeCards],
      ['our pile buttons', initial.rails.slice(1), expanded.rails.slice(1)],
      ['shared Stadium', [initial.stadium], [expanded.stadium]],
      ['our Deck', [initial.playerDeck], [expanded.playerDeck]],
      ['End Turn', [initial.endTurn], [expanded.endTurn]],
      ['our bench slots', initial.benches[1].slots, expanded.benches[1].slots],
    ]) {
      assert.equal(before.length, after.length);
      before.forEach((rect, index) => {
        for (const axis of ['x', 'y', 'w', 'h']) assert(Math.abs(rect[axis] - after[index][axis]) < 1,
          `${name} must not move when the opponent expands: ${axis}`);
      });
    }
    const divider = (expanded.activeCards[0].bottom + expanded.activeCards[1].y) / 2;
    const usableHeight = expanded.height - expanded.handSpace;
    assert(divider / usableHeight >= 0.43 && divider / usableHeight <= 0.51, 'player boundary must stay near the middle above the hand');
    const sparse = await restore(fixture({ full: false, opponentCount: 2 }), 5);
    sparse.activeCards.forEach((card, index) => assert(Math.abs(card.y - initial.activeCards[index].y) < 1,
      'removing bench Pokemon must not move the Active cards'));
    assert(Math.abs(sparse.benches[1].slots[2].y - sparse.benches[1].slots[0].y) < 1,
      'occupied Pokemon must pack into the top row when there are empty engine slots');
    assert(Math.abs(sparse.benches[1].slots[2].x - initial.benches[1].slots[1].x) < 1,
      'the second occupied Pokemon must use the second visual spot');
    return { stablePositions: true, capacityChange: '5 vs 8 -> 8 vs 8', activeShift: 0, ourBenchShift: 0, dividerRatio: divider / usableHeight };
  } finally { await context.close(); }
}

async function verifyPileActions(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 402, height: 743 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    const frame = await load(page, origin, fixture({ full: true }), false);
    for (const count of await frame.locator('.opponent-counts [role="status"]').all()) {
      const bounds = await count.boundingBox();
      await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      assert.equal(await frame.locator('.mat-dialog-container').count(), 0, 'opponent counts cannot open hidden cards');
    }
    await frame.locator('.opponent-lost').tap();
    await frame.locator('ptcg-card-info-list-popup').waitFor();
    assert.equal(await frame.locator('ptcg-card-list-pane ptcg-card').count(), 3, 'opponent Lost opens its public pile');
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    await frame.locator('.player-lost').tap();
    await frame.locator('ptcg-card-info-list-popup').waitFor();
    assert.equal(await frame.locator('ptcg-card-list-pane ptcg-card').count(), 2, 'our Lost opens our pile');
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    await frame.locator('.shared-stadium').tap();
    await frame.locator('ptcg-card-info-popup').waitFor();
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    await frame.locator('.player-deck-count').tap();
    await frame.locator('ptcg-card-info-list-popup').waitFor();
    assert.equal(await frame.locator('ptcg-card-list-pane ptcg-card').count(), 6, 'our Deck badge opens our deck');
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    await frame.locator('.player-prizes .zone-rail').tap();
    await frame.locator('ptcg-card-info-list-popup').waitFor();
    assert.equal(await frame.locator('ptcg-card-list-pane ptcg-card').count(), 3, 'own prize button opens all remaining prizes');
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    await frame.locator('.opponent-discard .zone-rail').tap();
    await frame.locator('ptcg-card-info-list-popup').waitFor();
    assert.equal(await frame.locator('ptcg-card-list-pane ptcg-card').count(), 3, 'opponent discard button shows its public cards');
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    await frame.locator('.player-discard .zone-rail').tap();
    await frame.locator('ptcg-card-info-list-popup').waitFor();
    assert.equal(await frame.locator('ptcg-card-list-pane ptcg-card').count(), 3, 'our Discard rail opens our discard pile');
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    const stadiumAnchor = await frame.locator('.shared-stadium').boundingBox();
    const empty = fixture({ full: true, prizeCount: 0, opponentDiscardCount: 0, playerDiscardCount: 0, deckCount: 0, playerLostCount: 0, opponentLostCount: 0 });
    await frame.evaluate(snapshot => window.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({ type: 'PushStateChange', data: { stateData: snapshot } })
    })), empty);
    await frame.waitForFunction(() => [...document.querySelectorAll('.zone-rail')].every(button => button.disabled));
    assert.deepEqual(await frame.locator('.zone-rail-tab').allTextContents(), ['0', '0', '0']);
    assert.equal(await frame.locator('.lost-zone-button').count(), 0, 'empty Lost zones have no button');
    assert(await frame.locator('.player-deck-count').isDisabled(), 'empty deck must be disabled');
    await frame.waitForFunction(() => document.querySelector('.opponent-counts [aria-label="Opponent prizes: 0"]'));
    await frame.evaluate(stateData => window.dispatchEvent(new MessageEvent('message', {
      data: JSON.stringify({ type: 'PushStateChange', data: { stateData } })
    })), fixture({ playerLostCount: 1, opponentLostCount: 0 }));
    await frame.waitForFunction(() => document.querySelector('.player-lost .field-zone-total')?.textContent.trim() === '1'
      && !document.querySelector('.opponent-lost'));
    const singleStadium = await frame.locator('.shared-stadium').boundingBox();
    for (const axis of ['x', 'y', 'width', 'height']) assert(Math.abs(singleStadium[axis] - stadiumAnchor[axis]) < 1,
      'Lost buttons must appear independently without moving Stadium');
    return { pileActions: true, stadiumInspector: true, conditionalLostZones: true, ownPrizeCount: 3, ownDeckCount: 6, ownDiscardCards: 3, opponentDiscardCards: 3, hiddenCountsReadOnly: true, emptyPilesDisabled: true };
  } finally { await context.close(); }
}

async function verifyEndTurn(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 402, height: 743 }, isMobile: true, hasTouch: true });
  try {
    await context.addInitScript(() => { window.__benchMessages = []; window.ReactNativeWebView = { postMessage: text => window.__benchMessages.push(JSON.parse(text)) }; });
    const page = await context.newPage();
    const frame = await load(page, origin, fixture(), false);
    for (const theme of ['light', 'dark']) {
      await frame.evaluate(value => document.documentElement.setAttribute('data-theme', value), theme);
      const colors = await frame.evaluate(() => {
        const pile = getComputedStyle(document.querySelector('.zone-rail-panel')).backgroundColor;
        const text = getComputedStyle(document.querySelector('.zone-rail')).color;
        return { pile, text, buttons: [...document.querySelectorAll('.field-zone-button:not(.player-end-turn)')].map(button => ({ background: getComputedStyle(button).backgroundColor, color: getComputedStyle(button).color })),
          hand: [...document.querySelectorAll('.board-hand-count')].map(count => getComputedStyle(count).backgroundColor) };
      });
      for (const button of colors.buttons) assert.deepEqual(button, { background: colors.pile, color: colors.text }, theme + ': field controls match prize/discard colors');
      assert.equal((await geometry(frame)).endTurn.background, 'rgb(255, 255, 255)', theme + ': End Turn stays white');
      assert(colors.hand.every(color => color === 'rgb(255, 255, 255)'), 'Hand badges remain white');
    }
    await frame.waitForFunction(() => [...document.images].filter(image => { const rect = image.getBoundingClientRect(); return rect.width > 0 && rect.top < innerHeight && rect.bottom > 0; }).every(image => image.complete));
    const before = await latest(frame);
    const dialog = frame.getByRole('dialog', { name: 'End turn without attacking?', exact: true });
    await frame.locator('.player-end-turn').tap(); await dialog.waitFor();
    assert.equal(await latest(frame), before, 'opening confirmation must not change game state');
    await frame.waitForFunction(() => { const dialog = document.querySelector('.mat-dialog-container'); return dialog && getComputedStyle(dialog).opacity === '1' && !dialog.classList.contains('ng-animating'); });
    await page.screenshot({ path: '/tmp/prizemap-end-turn-confirmation.png' });
    await dialog.getByRole('button', { name: 'Keep playing', exact: true }).tap();
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    assert.equal(await latest(frame), before, 'Cancel must preserve the turn');
    assert.equal(await frame.evaluate(() => document.activeElement?.classList.contains('player-end-turn')), true, 'focus returns to End Turn');
    await frame.locator('.player-end-turn').tap(); await dialog.waitFor();
    await page.keyboard.press('Escape');
    await frame.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' });
    assert.equal(await latest(frame), before, 'dismissal must preserve the turn');
    await frame.locator('.player-end-turn').tap(); await dialog.waitFor();
    await dialog.getByRole('button', { name: 'End turn', exact: true }).tap();
    await frame.waitForFunction(() => window.__benchMessages.some(message => message.type === 'TurnEnd'));
    assert.equal(await frame.evaluate(() => window.__benchMessages.filter(message => message.type === 'TurnEnd').length), 1, 'one confirmed turn-end reaches the native host');
    assert.equal(await frame.locator('.ptcg-table').getAttribute('inert'), '', 'completed board stops accepting input');
    return { endTurnConfirmation: true, cancellationPreservesTurn: true, escapePreservesTurn: true, confirmedTurnEndCount: 1, themes: ['light', 'dark'], screenshot: '/tmp/prizemap-end-turn-confirmation.png' };
  } finally { await context.close(); }
}

if (require.main === module) (async () => {
  const server = process.env.CLIENT_SIMULATOR_URL ? null : await serve();
  const origin = process.env.CLIENT_SIMULATOR_URL || server.origin;
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : { channel: 'chrome' }) });
  const results = [];
  try {
    for (const [width, height, embedded, reference, bothExpanded] of [[320,568,false], [320,568,true,false,true], [375,667,false], [375,537,false,false,true], [375,537,false], [375,681,false,false,true], [390,844,true], [390,844,true,true], [390,844,true,false,true], [430,828,false,false,true], [430,932,false], [844,390,false], [844,390,false,false,true], [900,740,false], [1280,800,false]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 990, hasTouch: width < 990 });
      const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
      try {
        process.stderr.write(`Checking ${width}x${height}${embedded ? ' embedded' : ''}\n`);
        const frame = await load(page, origin, fixture(reference ? { opponentCount: 2 } : { bothExpanded }), embedded);
        const g = await geometry(frame); assertVisible(g, width >= 990);
        if (reference) {
          assert.equal(g.boardHeight, g.height, 'reference setup must fit without scrolling');
          assert(g.cards.every(card => card.bottom < g.hand.y - 22), 'reference setup must clear hand stacks');
        }
        // Resizing the real host must recalculate the layout without reloading.
        await page.setViewportSize({ width: width >= 990 ? 390 : 1280, height: 844 });
        await frame.waitForFunction(compact => document.querySelector('ptcg-board').classList.contains('compact-board') === compact, width >= 990);
        await page.setViewportSize({ width, height });
        await frame.waitForFunction(compact => document.querySelector('ptcg-board').classList.contains('compact-board') === compact, width < 990);
        assertVisible(await geometry(frame), width >= 990);
        const screenshot = `/tmp/prizemap-bench-${width}x${height}${embedded ? '-iframe' : ''}${reference ? '-reference' : ''}${bothExpanded ? '-8-vs-8' : ''}.png`;
        await frame.waitForFunction(() => [...document.querySelectorAll('img')].filter(image => {
          const rect = image.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.top < innerHeight && rect.bottom > 0 && rect.left < innerWidth && rect.right > 0;
        }).every(image => image.complete), undefined, { timeout: 30000 });
        await page.screenshot({ path: screenshot, timeout: 10000 });
        // A vertical scroll gesture must have no board content to reveal.
        await frame.locator('ptcg-board').evaluate(board => board.scrollTop = board.scrollHeight);
        const bottom = await geometry(frame);
        assert.equal(bottom.boardScroll, 0, 'board must never scroll vertically');
        assert.deepEqual(errors, []);
        results.push({ width, height, embedded, reference: !!reference, bothExpanded: !!bothExpanded,
          boardCards: g.cards.length, opponentCardWidth: g.benches[0].slots[0].w, ourCardWidth: g.benches[1].slots[0].w,
          boardScrollHeight: g.boardHeight, boardClientHeight: g.boardClientHeight, screenshot });
      } finally { await context.close(); }
    }
    results.push(await verifyEndTurn(browser, origin));
    results.push(await verifyPileActions(browser, origin));
    results.push(await verifyStablePositions(browser, origin));
    results.push(await verifyBenchPacking(browser, origin));
    results.push(await verifyBenchAppend(browser, origin, true));
    results.push(await verifyBenchAppend(browser, origin, false));
    results.push(await verifyInteractions(browser, origin, true));
    results.push(await verifyInteractions(browser, origin, false));
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } finally { await browser.close(); if (server) await server.close(); }
})().catch(error => { console.error(error.message.replace(/#[A-Za-z0-9+/=]+/g, '#[snapshot]')); process.exitCode = 1; });
