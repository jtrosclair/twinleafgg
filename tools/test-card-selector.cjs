#!/usr/bin/env node
'use strict';

// Run after npm run build. Exercises Ultra Ball through the real client UI.
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
require(path.join(root, 'ptcg-server/node_modules/ts-node')).register({
  project: path.join(root, 'ptcg-server/tsconfig.json'), transpileOnly: true
});
const source = p => require(path.join(root, 'ptcg-server/src', p));
const { State, GamePhase } = source('game/store/state/state');
const { Player } = source('game/store/state/player');
const { CardList } = source('game/store/state/card-list');
const { PokemonCardList } = source('game/store/state/pokemon-card-list');
const { StateSerializer } = source('game/serializer/state-serializer');
const { UltraBall } = source('sets/set-scarlet-and-violet/ultra-ball');
const { SecretBox } = source('sets/set-twilight-masquerade/secret-box');
const { Potion } = source('sets/set-scarlet-and-violet/potion');
const { BraveryCharm } = source('sets/set-paldea-evolved/bravery-charm');
const { ProfessorsResearch } = source('sets/set-scarlet-and-violet/professors-research');
const { Artazon } = source('sets/set-paldea-evolved/artazon');
const { Charmander } = source('sets/set-base-set/charmander');
const { Squirtle } = source('sets/set-base-set/squirtle');
const { FireEnergy } = source('sets/set-base-set-energy/fire-energy');
const { WaterEnergy } = source('sets/set-base-set-energy/water-energy');
const { GrassEnergy } = source('sets/set-base-set-energy/grass-energy');
const { LightningEnergy } = source('sets/set-base-set-energy/lightning-energy');

function fixture(typed = false) {
  const state = new State();
  const players = [new Player(), new Player()];
  const cards = [];
  const add = Type => { const card = new Type(); card.id = cards.length; cards.push(card); return card; };
  for (const [index, player] of players.entries()) {
    player.id = index + 8;
    player.name = index ? 'Opponent' : 'Player';
    player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
    player.active.cards = [add(Charmander)];
    player.deck.cards = [add(Squirtle), add(Squirtle), add(Charmander), ...Array.from({ length: 8 }, () => add(FireEnergy))];
    player.prizes = Array.from({ length: 3 }, () => {
      const list = new CardList(); list.cards = [add(FireEnergy)]; list.isSecret = true; return list;
    });
    for (const zone of [player.active, ...player.bench, player.discard, player.stadium, player.lostzone]) zone.isPublic = true;
  }
  if (typed) players[0].deck.cards.push(add(Potion), add(Potion), add(BraveryCharm), add(ProfessorsResearch), add(Artazon));
  players[0].hand.cards = [add(typed ? SecretBox : UltraBall), ...Array.from({ length: 8 }, () => add(FireEnergy)),
    add(WaterEnergy), add(GrassEnergy), add(LightningEnergy)];
  state.players = players;
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = 3;
  state.activePlayer = 0;
  state.gameSettings.timeLimit = 0;
  state.cardNames = cards.map(card => card.fullName);
  return Buffer.from(new StateSerializer().serialize(state)).toString('base64');
}

async function dragCard(page, source, target, useTouch, expectPreview = true) {
  await source.scrollIntoViewIfNeeded();
  if (!useTouch && expectPreview) assert(await source.evaluate(element => element.draggable), 'Mouse drag source must retain its draggable connection');
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  assert(from && to, 'Drag endpoints are visible');
  const start = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const end = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  const lift = { x: start.x, y: start.y + (Math.sign(end.y - start.y) || -1) * 24 };
  if (useTouch) {
    const cdp = await page.context().newCDPSession(page);
    const touch = (type, point) => cdp.send('Input.dispatchTouchEvent', {
      type, touchPoints: type === 'touchEnd' ? [] : [{ ...point, radiusX: 4, radiusY: 4, force: 1 }]
    });
    await touch('touchStart', start);
    await touch('touchMove', lift);
    await page.waitForTimeout(20);
    for (let step = 1; step <= 10; step++) {
      await touch('touchMove', { x: lift.x + (end.x - lift.x) * step / 10,
        y: lift.y + (end.y - lift.y) * step / 10 });
      await page.waitForTimeout(20);
    }
    if (expectPreview) await page.locator('.selector-drag-preview').waitFor();
    await touch('touchEnd');
    await cdp.detach();
  } else {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(lift.x, lift.y, { steps: 3 });
    await page.mouse.move(end.x, end.y, { steps: 12 });
    if (expectPreview) await page.locator('.selector-drag-preview').waitFor();
    await page.mouse.up();
  }
  await page.locator('.selector-drag-preview').waitFor({ state: 'detached' });
  await page.evaluate(() => new Promise(requestAnimationFrame));
  assert.equal(await page.locator('mat-dialog-container').count(), 0, 'Dragging must not open details');
}

async function inspectCard(page, card, useTouch) {
  // A drag or swipe's compatibility click is suppressed for 350ms.
  await page.waitForTimeout(400);
  if (useTouch) await card.tap();
  else await card.click();
  await page.locator('mat-dialog-container').waitFor();
  const close = page.getByRole('button', { name: 'Close', exact: true });
  if (useTouch) await close.tap();
  else await close.click();
  await page.locator('mat-dialog-container').waitFor({ state: 'detached' });
}

async function readCardAffordances(stack, faceSelector, copySelector) {
  return stack.evaluate((element, { faceSelector, copySelector }) => {
    function styles(node, properties, pseudo) {
      if (!node) return null;
      const computed = getComputedStyle(node, pseudo);
      return Object.fromEntries(properties.map(property => [property, computed[property]]));
    }
    const face = element.querySelector(faceSelector);
    return {
      face: styles(face, ['borderRadius', 'filter']),
      outline: styles(face, ['content', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius',
        'boxShadow', 'top', 'right', 'bottom', 'left', 'pointerEvents'], '::after'),
      arrow: styles(element.querySelector('.playable-arrow'), ['width', 'height', 'backgroundColor',
        'clipPath', 'top', 'transform', 'pointerEvents', 'zIndex']),
      badge: styles(element.querySelector('.stack-count'), ['minWidth', 'height', 'paddingLeft', 'paddingRight',
        'boxSizing', 'borderColor', 'borderWidth', 'borderRadius', 'backgroundColor', 'color', 'fontFamily',
        'fontSize', 'fontWeight', 'lineHeight', 'boxShadow', 'top', 'transform', 'pointerEvents', 'zIndex']),
      copies: [...element.querySelectorAll(copySelector)].map(copy => styles(copy,
        ['display', 'top', 'left', 'right', 'zIndex', 'filter', 'pointerEvents']))
    };
  }, { faceSelector, copySelector });
}

async function verify(browser, viewport, theme, origin, reducedMotion = false) {
  const useTouch = viewport.width < 1000;
  const context = await browser.newContext({ viewport, isMobile: viewport.width < 768, hasTouch: true,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(theme => {
    localStorage.setItem('prizemap:theme', theme);
    window.__selectorFades = [];
    const seen = new WeakSet();
    function recordFades() {
      for (const animation of document.getAnimations()) {
        const target = animation.effect?.target;
        if (seen.has(animation) || !target?.matches?.(
          'ptcg-prompt-choose-cards,.selector-panel,.selector-scrim,.source-preview')) continue;
        seen.add(animation);
        const frames = animation.effect.getKeyframes();
        const record = { part: target.tagName === 'PTCG-PROMPT-CHOOSE-CARDS' ? 'host' : target.classList[0],
          from: Number(frames[0].opacity), to: Number(frames[frames.length - 1].opacity),
          duration: animation.effect.getTiming().duration, started: performance.now() };
        window.__selectorFades.push(record);
        animation.finished.then(() => { record.finished = performance.now(); }, () => { record.cancelled = true; });
      }
      requestAnimationFrame(recordFades);
    }
    requestAnimationFrame(recordFades);
    window.__selectorMessages = [];
    window.ReactNativeWebView = { postMessage: message => window.__selectorMessages.push(JSON.parse(message)) };
  }, theme);
  try {
    await page.goto(origin + '/sandbox-viewer#' + fixture());
    await page.locator('.hand-card[aria-label^="Ultra Ball"]').waitFor();
    const handStack = page.locator('.hand-stack').filter({ has: page.locator('.hand-card[aria-label^="Fire Energy"]') });
    const handAffordances = await readCardAffordances(handStack, '.hand-card', '.hand-stack-copy');
    assert(handAffordances.arrow && handAffordances.badge && handAffordances.copies.length === 2);
    const card = await page.locator('.hand-card[aria-label^="Ultra Ball"]').boundingBox();
    const target = await page.locator('.ptcg-board-player').last().locator('.ptcg-board-active').boundingBox();
    assert(target, 'Board active target is visible');
    await page.mouse.move(card.x + card.width / 2, card.y + 30);
    await page.mouse.down();
    await page.mouse.move(target.x + target.width / 2, target.y + 8, { steps: 15 });
    await page.mouse.up();
    const selector = page.locator('ptcg-prompt-choose-cards');
    const fire = () => selector.getByRole('button', { name: /^Inspect Fire Energy/ });
    const slot = index => selector.locator('.selection-slot').nth(index);
    await selector.locator('.discard-selector').waitFor();
    await waitSelectorFades(page);
    assert.equal(await selector.locator('.instruction-bar h2').innerText(), 'Choose 2 cards to discard.');
    assert.equal(await selector.locator('.selection-slot').count(), 2);
    assert.deepEqual(await selector.locator('.slot-label').allTextContents(), ['any', 'any']);
    assert.equal(await selector.locator('.playable-arrow').count(), 4);
    assert.equal(await selector.locator('.card-choice').count(), 4);
    assert.equal(await selector.locator('.stack-count').innerText(), '8');
    const selectorAffordances = await readCardAffordances(fire().locator('..'), '.choice-card', '.stack-copy');
    assert.deepEqual(selectorAffordances, handAffordances, 'Selector outlines, arrows, badges, and stacked copies match the actual hand');
    assert(await selector.getByRole('button', { name: 'Done', exact: true }).isDisabled());
    await inspectCard(page, fire(), useTouch);
    assert.equal(await selector.locator('.selected-card').count(), 0, 'Tapping opens details without selecting');
    assert.equal(await selector.locator('.stack-count').innerText(), '8');

    if (useTouch && viewport.width === 390) {
      const cdp = await context.newCDPSession(page);
      const row = await selector.locator('.card-row').boundingBox();
      const y = row.y + row.height / 2;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 320, y }] });
      for (const x of [290, 250, 200, 150, 90]) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 2 }] });
        await page.waitForTimeout(20);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForFunction(() => document.querySelector('.card-row').scrollLeft > 20);
      assert.equal(await selector.locator('.selected-card').count(), 0);
      assert.equal(await page.locator('mat-dialog-container').count(), 0, 'Swiping must not open details');
      await cdp.detach();
    }
    await visibleArtworkReady(page);
    await page.screenshot({ path: `/tmp/twinleaf-selector-discard-${theme}-${viewport.width}.png` });

    await dragCard(page, fire(), selector.locator('.instruction-bar'), useTouch);
    assert.equal(await selector.locator('.selected-card').count(), 0, 'Cancelled drags preserve the stack');
    await dragCard(page, fire(), slot(1), useTouch);
    assert.equal(await slot(0).locator('.selected-card').count(), 0, 'Drop fills the addressed slot');
    assert.equal(await slot(1).locator('.selected-card').count(), 1);
    assert.equal(await selector.locator('.stack-count').innerText(), '7');
    await inspectCard(page, slot(1).locator('.selected-card'), useTouch);
    assert.equal(await selector.locator('.selected-card').count(), 1, 'Tapping a selected card does not remove it');
    await dragCard(page, slot(1).locator('.selected-card'), selector.locator('.card-row'), useTouch);
    assert.equal(await selector.locator('.selected-card').count(), 0);
    assert.equal(await selector.locator('.stack-count').innerText(), '8');
    await dragCard(page, fire(), slot(0), useTouch);
    const scrollLeft = await selector.locator('.card-row').evaluate(element => element.scrollLeft);
    await selector.getByRole('button', { name: 'Inspect board', exact: true }).click();
    await selector.locator('.selector-panel').waitFor({ state: 'hidden' });
    await waitSelectorFades(page);
    assert(await selector.locator('.source-preview').isHidden());
    assert(await selector.locator('.selector-scrim').isHidden());
    await selector.getByRole('button', { name: 'Return to selection' }).click();
    await waitSelectorFades(page);
    assert.equal(await selector.locator('.selected-card').count(), 1);
    assert.equal(await selector.locator('.card-row').evaluate(element => element.scrollLeft), scrollLeft);
    await dragCard(page, fire(), slot(1), useTouch);
    assert.equal(await selector.locator('.selected-card').count(), 2);
    assert.equal(await selector.locator('.stack-count').innerText(), '6');
    assert.equal(await selector.locator('.playable-arrow').count(), 0);
    const atLimit = await readCardAffordances(fire().locator('..'), '.choice-card', '.stack-copy');
    assert.equal(atLimit.outline.content, 'none', 'At the selection limit the playable outline is removed');
    assert.deepEqual(atLimit.badge, handAffordances.badge, 'Copy badges retain the hand styling at the limit');
    await inspectCard(page, fire(), useTouch);
    assert.equal(await selector.locator('.selected-card').count(), 2, 'Details remain available at the selection limit');
    await visibleArtworkReady(page);
    await page.screenshot({ path: `/tmp/twinleaf-selector-selected-${theme}-${viewport.width}.png` });
    await selector.getByRole('button', { name: 'Done', exact: true }).click();
    await waitSelectorFades(page);

    await selector.locator('.selector-tabs').waitFor();
    assert.deepEqual(await selector.locator('.slot-label').allTextContents(), ['Pokémon']);
    assert.equal(await selector.locator('.choice-card').count(), 2);
    assert(await selector.getByRole('button', { name: 'Confirm', exact: true }).isEnabled());
    await selector.getByRole('tab', { name: 'All', exact: true }).click();
    assert.equal(await selector.locator('.unavailable').count(), 1);
    const unavailable = await readCardAffordances(selector.locator('.unavailable'), '.choice-card', '.stack-copy');
    assert.equal(unavailable.outline.content, 'none');
    assert.equal(unavailable.arrow, null);
    assert.deepEqual(unavailable.badge, handAffordances.badge, 'Unavailable stacks keep the same count badge');
    await inspectCard(page, selector.locator('.unavailable .choice-card'), useTouch);
    await dragCard(page, selector.locator('.unavailable .choice-card'), slot(0), useTouch, false);
    assert.equal(await selector.locator('.selected-card').count(), 0, 'Blocked cards cannot be dropped into selection');
    await selector.getByRole('tab', { name: 'Valid', exact: true }).click();
    await visibleArtworkReady(page);
    await page.screenshot({ path: `/tmp/twinleaf-selector-search-${theme}-${viewport.width}.png` });
    const squirtle = () => selector.getByRole('button', { name: 'Inspect Squirtle, 2 copies remaining', exact: true });
    await dragCard(page, squirtle(), slot(0), useTouch);
    assert.equal(await selector.locator('.stack-count').count(), 0);
    await selector.getByRole('tab', { name: 'All', exact: true }).click();
    assert.equal(await selector.locator('.selected-card').count(), 1);
    assert.equal(await selector.locator('.card-choice').count(), 3);
    await dragCard(page, selector.locator('.selected-card'), selector.locator('.card-row'), useTouch);
    await selector.getByRole('tab', { name: 'Valid', exact: true }).click();
    await dragCard(page, squirtle(), slot(0), useTouch);
    await selector.getByRole('button', { name: 'Confirm', exact: true }).click();
    await waitSelectorFades(page);
    await selector.waitFor({ state: 'detached' });
    await page.waitForFunction(() => document.querySelector('.hand-card[aria-label^="Squirtle"]'));
    assert.deepEqual(errors, []);
    const fades = await page.evaluate(() => window.__selectorFades);
    if (reducedMotion) {
      assert(fades.every(fade => fade.duration === 0), 'Reduced motion skips selector fades');
    } else {
      const hostFades = fades.filter(fade => fade.part === 'host' && fade.finished !== undefined && !fade.cancelled);
      assert(hostFades.filter(fade => fade.from === 0 && fade.to === 1).length >= 2, 'Both prompts fade in');
      assert(hostFades.filter(fade => fade.to === 0).length >= 2, 'Both prompts fade out before removal');
      assert(fades.some(fade => fade.part === 'selector-panel' && fade.from === 1 && fade.to === 0), 'Inspect Board fades out');
      assert(fades.some(fade => fade.part === 'selector-panel' && fade.from === 0 && fade.to === 1), 'Returning fades in');
      assert(fades.every(fade => fade.duration === 100), 'Selector fades last 100ms');
    }
    return { viewport, theme, input: useTouch ? 'native touch' : 'mouse', tapInspects: true, matchesHandAffordances: true,
      dragSelectsAndReturns: true, repeatedStackDrags: true, cancelledDrag: true, fadeDurationMs: reducedMotion ? 0 : 100, errors };
  } catch (error) {
    await page.screenshot({ path: `/tmp/twinleaf-selector-failure-${theme}-${viewport.width}.png` });
    console.error('Browser errors:', errors);
    console.error('Fades:', JSON.stringify(await page.evaluate(() => window.__selectorFades)));
    console.error('Context:', JSON.stringify({ viewport, theme, reducedMotion }));
    throw error;
  } finally { await context.close(); }
}

async function waitSelectorFades(page) {
  await page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    const animations = document.getAnimations().filter(animation => animation.effect?.target?.matches?.(
      'ptcg-prompt-choose-cards,.selector-panel,.selector-scrim,.source-preview'));
    await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
    await new Promise(requestAnimationFrame);
  });
}

async function verifyTyped(browser, viewport, theme, origin) {
  const useTouch = viewport.width < 1000;
  const context = await browser.newContext({ viewport, isMobile: viewport.width < 768, hasTouch: true });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(theme => localStorage.setItem('prizemap:theme', theme), theme);
  try {
    await page.goto(origin + '/sandbox-viewer#' + fixture(true));
    const handCard = page.locator('.hand-card[aria-label^="Secret Box"]');
    await handCard.waitFor();
    const card = await handCard.boundingBox();
    const target = await page.locator('.ptcg-board-player').last().locator('.ptcg-board-active').boundingBox();
    await page.mouse.move(card.x + card.width / 2, card.y + 30);
    await page.mouse.down();
    await page.mouse.move(target.x + target.width / 2, target.y + 8, { steps: 15 });
    await page.mouse.up();
    const selector = page.locator('ptcg-prompt-choose-cards');
    await selector.locator('.discard-selector').waitFor();
    await waitSelectorFades(page);
    assert.deepEqual(await selector.locator('.slot-label').allTextContents(), ['any', 'any', 'any']);
    const slot = index => selector.locator('.selection-slot').nth(index);
    for (let index = 0; index < 3; index++) {
      await dragCard(page, selector.getByRole('button', { name: /^Inspect Fire Energy/ }), slot(index), useTouch);
    }
    await selector.getByRole('button', { name: 'Done', exact: true }).click();
    await selector.locator('.selector-tabs').waitFor();
    await waitSelectorFades(page);
    assert.deepEqual(await selector.locator('.slot-label').allTextContents(), ['Item', 'Pokémon Tool', 'Supporter', 'Stadium']);
    assert(await selector.getByRole('button', { name: 'Confirm', exact: true }).isEnabled(), 'Secret Box search stays optional');
    const potion = () => selector.getByRole('button', { name: /^Inspect Potion/ });
    await dragCard(page, potion(), slot(1), useTouch);
    assert.equal(await selector.locator('.selected-card').count(), 0, 'Wrong slot rejects drop without tray rerouting');
    // Drop on tray whitespace, away from child slots: route to Supporter rather than first empty Item slot.
    const tray = selector.locator('.selection-tray');
    const trayBox = await tray.boundingBox();
    await dragCard(page, selector.getByRole('button', { name: /^Inspect Professor/ }), {
      boundingBox: async () => ({ x: trayBox.x, y: trayBox.y, width: 6, height: 6 })
    }, useTouch);
    assert.equal(await slot(2).locator('.selected-card').count(), 1, 'Tray routes to matching category');
    await dragCard(page, potion(), slot(0), useTouch);
    assert.equal(await slot(0).locator('.selected-card').count(), 1);
    assert.equal(await potion().locator('..').locator('.playable-arrow').count(), 0, 'Second Item loses its selectable arrow');
    await dragCard(page, potion(), slot(3), useTouch, false);
    assert.equal(await selector.locator('.selected-card').count(), 2, 'Duplicate category cannot be selected');
    await dragCard(page, slot(0).locator('.selected-card'), slot(2), useTouch);
    assert.equal(await slot(0).locator('.selected-card').getAttribute('aria-label'), 'Inspect selected Potion', 'Cross-type swap rejected');
    await dragCard(page, slot(0).locator('.selected-card'), selector.locator('.card-row'), useTouch);
    assert.equal(await slot(0).locator('.slot-label').innerText(), 'Item');
    assert.equal(await potion().locator('..').locator('.playable-arrow').count(), 1);
    await dragCard(page, potion(), slot(0), useTouch);
    await dragCard(page, selector.getByRole('button', { name: /^Inspect Bravery Charm/ }), slot(1), useTouch);
    await visibleArtworkReady(page);
    await page.screenshot({ path: `/tmp/twinleaf-selector-typed-${theme}-${viewport.width}.png` });
    // Deliberately leave Stadium empty: choosing fewer than all categories remains legal.
    await selector.getByRole('button', { name: 'Confirm', exact: true }).click();
    await selector.waitFor({ state: 'detached' });
    await page.locator('.hand-card[aria-label^="Potion"]').waitFor();
    await page.locator('.hand-card[aria-label^="Bravery Charm"]').waitFor();
    assert.deepEqual(errors, []);
    return { viewport, theme, input: useTouch ? 'native touch' : 'mouse', typedSlots: true,
      rejectsWrongSlotAndDuplicateCategory: true, trayRoutesToMatchingSlot: true, optionalSearch: true, errors };
  } catch (error) {
    await page.screenshot({ path: `/tmp/twinleaf-selector-typed-failure-${theme}-${viewport.width}.png` });
    console.error('Typed selector browser errors:', errors);
    throw error;
  } finally { await context.close(); }
}

async function visibleArtworkReady(page) {
  // Screenshots wait for visible scans; gameplay itself does not wait on artwork.
  await page.waitForFunction(() => [...document.querySelectorAll('ptcg-prompt-choose-cards img')]
    .filter(image => {
      const bounds = image.getBoundingClientRect();
      return bounds.width && bounds.height && bounds.right > 0 && bounds.left < innerWidth
        && bounds.bottom > 0 && bounds.top < innerHeight;
    }).every(image => image.complete));
}

async function serveRelease() {
  // Pin the immutable artifact so concurrent local builds cannot replace test files.
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'ptcg-play/cloudflare-public/simulator-manifest.json')));
  const build = path.join(root, 'ptcg-play/cloudflare-public/releases', manifest.packageHash);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(build, '.' + pathname);
    if (file !== build && !file.startsWith(build + path.sep)) { res.writeHead(403).end(); return; }
    if (file === build || !path.extname(file)) file = path.join(build, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

(async () => {
  const server = process.env.CLIENT_SIMULATOR_URL ? null : await serveRelease();
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
  try {
    const results = [];
    const viewports = process.argv.includes('--phone') ? [{ width: 390, height: 844 }]
      : process.argv.includes('--desktop') ? [{ width: 1280, height: 900 }]
      : process.argv.includes('--landscape') ? [{ width: 844, height: 390 }]
      : [{ width: 390, height: 844 }, { width: 1280, height: 900 }, { width: 844, height: 390 }];
    for (const viewport of viewports) {
      for (const theme of ['dark', 'light']) {
        if (!process.argv.includes('--typed-only')) results.push(await verify(browser, viewport, theme,
          process.env.CLIENT_SIMULATOR_URL || server.origin));
        results.push(await verifyTyped(browser, viewport, theme, process.env.CLIENT_SIMULATOR_URL || server.origin));
      }
    }
    if (!process.argv.includes('--typed-only') && !process.argv.includes('--phone') && !process.argv.includes('--desktop') && !process.argv.includes('--landscape')) {
      results.push(await verify(browser, { width: 390, height: 844 }, 'dark',
        process.env.CLIENT_SIMULATOR_URL || server.origin, true));
    }
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } finally { await browser.close(); if (server) await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
