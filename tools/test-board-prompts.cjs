#!/usr/bin/env node
'use strict';

// Exercise the exact immutable package selected for deployment, without network
// puzzle downloads or card artwork. The fixtures reproduce the reported flows.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const zlib = require('node:zlib');
const { chromium } = require('playwright');
const { verifyDeploy } = require('../ptcg-play/scripts/build-attestation.cjs');
const root = path.resolve(__dirname, '..');
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
const cases = [
  { name: 'Crobat damage', fixture: 'revenge-of-the-assassin.snapshot.json.gz',
    card: "Team Rocket's Crobat ex", evolve: 1, targets: [1, 2], message: 'Choose Pokémon to deal damage to.' },
  { name: 'Prime Catcher', fixture: 'skymonster-prime-catcher.snapshot.json.gz',
    card: 'Prime Catcher', targets: [2], message: 'Choose Pokémon to switch with the Active Pokémon.' },
  { name: 'Prime Catcher, eight opposing Pokémon', fixture: 'skymonster-prime-catcher-eight.snapshot.json.gz',
    card: 'Prime Catcher', targets: [2], message: 'Choose Pokémon to switch with the Active Pokémon.', opponentCount: 8 }
];

function browserOptions() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) return { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE };
  if (fs.existsSync(chromium.executablePath())) return {};
  const system = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/google/chrome/chrome'].find(file => fs.existsSync(file));
  assert(system, 'Release checks need Chromium. Run: cd tools && npx playwright install chromium; or set PLAYWRIGHT_CHROMIUM_EXECUTABLE.');
  return { executablePath: system };
}

async function serve(release) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
  const server = http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400).end(); return; }
    let file = path.resolve(release, '.' + pathname);
    if (file !== release && !file.startsWith(release + path.sep)) { res.writeHead(403).end(); return; }
    if (!path.extname(file)) file = path.join(release, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => server.close(resolve)) };
}

function decodeState(data) {
  const parsed = JSON.parse(Buffer.from(data, 'base64').toString());
  const deref = value => value?._type === 'Ref'
    ? value.path.split('.').map(Number).reduce((object, key) => object[key], parsed) : value;
  return { ...parsed[1], players: parsed[1].players.map(value => {
    const player = deref(value); return { ...player, bench: player.bench.map(deref) };
  }) };
}

async function boardGeometry(page) {
  return page.locator('.ptcg-board-bench, .ptcg-board-active, .zone-rail, .shared-stadium, .player-deck-count')
    .evaluateAll(elements => elements.map(element => {
      const r = element.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
    }));
}

async function assertBanner(page) {
  const geometry = await page.locator('.ptcg-overlay-message').evaluate(message => {
    const range = document.createRange(); range.selectNodeContents(message.querySelector('p'));
    const rect = message.getBoundingClientRect();
    const bench = document.querySelector('.ptcg-board-player.upside-down .ptcg-board-bench').getBoundingClientRect();
    const style = getComputedStyle(message);
    return { lines: range.getClientRects().length, left: rect.left, right: rect.right,
      top: rect.top, benchMiddle: bench.top + bench.height / 2, width: innerWidth,
      zIndex: style.zIndex, opacity: style.opacity };
  });
  assert.equal(geometry.lines, 1, 'The board instruction must stay on one line.');
  assert(geometry.left >= 0 && geometry.right <= geometry.width, 'The banner must fit inside the screen.');
  assert(Math.abs(geometry.top - geometry.benchMiddle) < 1, 'The banner must start in the middle of the opposing bench.');
  assert.equal(geometry.zIndex, '1500', 'Keep the banner layering while allowing taps through it.');
  assert.equal(geometry.opacity, '1', 'The instruction must remain visible.');
}

async function selectCoveredCard(page, index, touch) {
  const card = page.locator('.ptcg-board-player.upside-down .ptcg-board-bench ptcg-board-card').nth(index);
  const message = await page.locator('.ptcg-overlay-message').boundingBox(), bounds = await card.boundingBox();
  const left = Math.max(message.x, bounds.x), right = Math.min(message.x + message.width, bounds.x + bounds.width);
  const top = Math.max(message.y, bounds.y), bottom = Math.min(message.y + message.height, bounds.y + bounds.height);
  assert(right > left && bottom > top, 'The regression test must tap an area covered by the banner.');
  const point = { x: (left + right) / 2, y: (top + bottom) / 2 };
  assert(await card.evaluate((element, point) =>
    document.elementFromPoint(point.x, point.y)?.closest('ptcg-board-card') === element, point),
  'The banner blocked the card beneath it.');
  if (touch) await page.touchscreen.tap(point.x, point.y); else await page.mouse.click(point.x, point.y);
  await card.locator('.selected').waitFor();
}

async function confirm(page, touch) {
  const button = page.locator('.confirm-button');
  assert(await button.isEnabled(), 'Selecting a covered card must enable OK.');
  if (touch) await button.tap(); else await button.click();
}

async function verifyCase(browser, origin, scenario, touch, negativeControls) {
  const fixture = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname, 'fixtures', scenario.fixture))));
  const context = await browser.newContext({ viewport: { width: 393, height: 660 }, hasTouch: touch, isMobile: touch });
  try {
    await context.addInitScript(() => {
      localStorage.setItem('language', 'en'); window.__boardPromptMessages = [];
      window.ReactNativeWebView = { postMessage: text => window.__boardPromptMessages.push(JSON.parse(text)) };
    });
    // Scans do not determine card geometry. Keep this release gate independent
    // of third-party image hosts and verify the actual packaged UI/engine.
    await context.route('**/*', route => {
      if (route.request().url().startsWith(origin + '/')) return route.continue();
      if (route.request().resourceType() === 'image') return route.fulfill({ contentType: 'image/png', body: pixel });
      return route.abort();
    });
    const page = await context.newPage(), errors = [];
    page.setDefaultTimeout(15000); page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/sandbox-viewer#' + fixture.stateData, { waitUntil: 'domcontentloaded' });
    const source = page.locator(`.hand-card[aria-label^=${JSON.stringify(scenario.card)}]`);
    await source.waitFor();
    await page.waitForFunction(() => parseFloat(getComputedStyle(document.querySelector('ptcg-board')).getPropertyValue('--card-size')) > 0);
    const before = await boardGeometry(page);
    const from = await source.boundingBox();
    const destination = scenario.evolve === undefined ? page.locator('.ptcg-board-container')
      : page.locator('.ptcg-board-player:not(.upside-down) .ptcg-board-bench ptcg-board-card').nth(scenario.evolve);
    const to = await destination.boundingBox();
    await page.mouse.move(from.x + from.width / 2, from.y + 25); await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 16 }); await page.mouse.up();
    if (scenario.evolve !== undefined) await page.locator('ptcg-prompt-confirm .ptcg-prompt-actions button').last().click();
    const message = page.locator('.ptcg-overlay-message'); await message.waitFor();
    assert.equal(await message.innerText(), scenario.message);
    await assertBanner(page);
    assert.deepEqual(await boardGeometry(page), before, 'Showing the prompt must not move the board.');
    if (scenario.opponentCount) assert.equal(await page.locator('.ptcg-board-player.upside-down .ptcg-board-bench > ptcg-board-card:not(.bench-slot-empty)').count(), scenario.opponentCount);

    if (negativeControls) {
      // Prove the checks catch each historical failure, rather than merely
      // passing the current build. These styles affect only this test page.
      let style = await page.addStyleTag({ content: '.ptcg-overlay-message { width: 100px !important; white-space: normal !important; } .ptcg-overlay-message p { width: auto !important; }' });
      await assert.rejects(() => assertBanner(page), /must stay on one line/); await style.evaluate(node => node.remove());
      style = await page.addStyleTag({ content: '.ptcg-overlay-message { pointer-events: auto !important; }' });
      await assert.rejects(() => selectCoveredCard(page, scenario.targets[0], touch), /blocked the card/); await style.evaluate(node => node.remove());
      style = await page.addStyleTag({ content: '.ptcg-overlay-message { top: 0 !important; }' });
      await assert.rejects(() => assertBanner(page), /middle of the opposing bench/); await style.evaluate(node => node.remove());
    }
    for (const index of scenario.targets) await selectCoveredCard(page, index, touch);
    await confirm(page, touch);
    if (scenario.evolve === undefined) {
      await message.waitFor(); await page.waitForFunction(() => document.querySelector('.confirm-button')?.disabled);
      await assertBanner(page);
      const own = page.locator('.ptcg-board-player:not(.upside-down) .ptcg-board-bench ptcg-board-card').nth(7).locator('.ptcg-board-card > ptcg-card').last();
      if (touch) await own.tap(); else await own.click();
      await confirm(page, touch);
    }
    await page.locator('.ptcg-board-selection-overlay').waitFor({ state: 'detached' });
    if (scenario.evolve !== undefined) {
      const latest = await page.evaluate(() => window.__boardPromptMessages.filter(message => message.type === 'StateUpdate').at(-1).data.stateData);
      const initial = decodeState(fixture.stateData), after = decodeState(latest);
      for (const index of scenario.targets) assert.equal(after.players[1].bench[index].damage, (initial.players[1].bench[index].damage || 0) + 20);
    }
    assert.deepEqual(errors, []);
    return { scenario: scenario.name, input: touch ? 'touch' : 'mouse', passed: true };
  } finally { await context.close(); }
}

async function verifyBoardPrompts() {
  const attestation = verifyDeploy();
  const release = path.join(root, 'ptcg-play/cloudflare-public/releases', attestation.packageHash);
  const server = await serve(release); let browser;
  try {
    browser = await chromium.launch({ headless: true, ...browserOptions() });
    const results = [];
    for (const scenario of cases) for (const touch of [false, true]) {
      results.push(await verifyCase(browser, server.origin, scenario, touch, results.length === 0));
    }
    return { ok: true, packageHash: attestation.packageHash, negativeControls: 3, results };
  } finally { if (browser) await browser.close(); await server.close(); }
}

if (require.main === module) {
  verifyBoardPrompts().then(result => console.log(JSON.stringify(result, null, 2))).catch(error => {
    console.error(error.message.replace(/#[A-Za-z0-9+/=]+/g, '#[snapshot]')); process.exitCode = 1;
  });
}
module.exports = { verifyBoardPrompts };
