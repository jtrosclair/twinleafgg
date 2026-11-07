#!/usr/bin/env node
'use strict';

// Browser regression for the hand being scrolled back into view after a card
// inspector closes. Run after the production build; supports a live origin.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const zlib = require('node:zlib');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname, 'fixtures/phantom-maze.snapshot.json.gz'))));

async function serve() {
  const build = path.join(root, 'ptcg-play/dist/ptcg-play');
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

async function position(frame) {
  return frame.evaluate(() => {
    const table = document.querySelector('.ptcg-table');
    const bounds = table.getBoundingClientRect();
    const card = document.querySelector('.hand-card').getBoundingClientRect();
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;visibility:hidden;height:env(safe-area-inset-bottom,0px)';
    document.body.appendChild(probe);
    const safeArea = probe.getBoundingClientRect().height;
    probe.remove();
    return { cardTop: card.top, cardHeight: card.height, visibleHeight: Math.min(card.bottom, bounds.bottom) - card.top,
      boardTop: document.querySelector('ptcg-board').getBoundingClientRect().top,
      tableScrollTop: table.scrollTop, safeArea };
  });
}

async function verify(browser, origin, mode) {
  process.stderr.write(`Checking ${mode} hand gestures\n`);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { bottom: 0 } });
    if (mode === 'native') await page.addInitScript(() => { window.ReactNativeWebView = { postMessage() {} }; });
    const url = origin + '/sandbox-viewer#' + snapshot.stateData;
    let frame;
    if (mode === 'iframe') {
      // A real host origin matches PrizeMap without mounting Angular in the parent.
      await page.route(origin + '/__hand-host', route => route.fulfill({ contentType: 'text/html', body: '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0;height:100%;overflow:hidden}header{height:104px}iframe{display:block;width:100%;height:calc(100% - 104px);border:0}</style><header>PrizeMap host frame</header><iframe></iframe>' }));
      await page.goto(origin + '/__hand-host', { waitUntil: 'domcontentloaded' });
      await page.locator('iframe').evaluate((element, url) => element.src = url, url);
      frame = await (await page.locator('iframe').elementHandle()).contentFrame();
    } else {
      await page.setViewportSize({ width: 390, height: 740 });
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      frame = page.mainFrame();
    }
    await frame.waitForSelector('.hand-card');
    // Match the native app's viewport and root overflow settings.
    await frame.evaluate(() => {
      document.querySelector('meta[name="viewport"]').content = 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
      document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden';
    });
    const initial = await position(frame);
    assert(initial.cardHeight - initial.visibleHeight >= 28, mode + ': cards must remain partially below the board edge');
    await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { bottom: 34 } });
    const inset = await position(frame);
    if (mode === 'native') assert.equal(inset.safeArea, 34, 'real CSS safe-area emulation must be active');
    assert(Math.abs(inset.cardTop - initial.cardTop) < 1, mode + ': phone inset must not lift the hand');

    await frame.locator('.hand-card').first().tap();
    await frame.waitForSelector('mat-dialog-container');
    await frame.getByRole('button', { name: 'Close', exact: true }).tap();
    await frame.waitForSelector('mat-dialog-container', { state: 'detached' });
    await frame.waitForSelector('.cdk-overlay-backdrop', { state: 'detached' });
    await frame.locator('.hand-card').first().focus();
    const focused = await position(frame);
    assert.equal(focused.tableScrollTop, 0, mode + ': focus restoration must not scroll the board');
    assert(Math.abs(focused.cardTop - initial.cardTop) < 1, mode + ': inspecting and focusing must not lift cards');
    assert.equal(focused.boardTop, initial.boardTop);

    const card = await frame.locator('.hand-card').first().boundingBox();
    assert(await frame.evaluate(() => {
      const top = document.querySelector('.hand-card').getBoundingClientRect().top;
      return !!document.elementFromPoint(300, top + 40)?.closest('.hand-viewport');
    }),
      mode + ': the swipe must start on the hand after the inspector backdrop closes');
    const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', {
      type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, radiusX: 4, radiusY: 4, force: 1 }]
    });
    await cdp.send('Input.synthesizeScrollGesture', {
      x: 300, y: card.y + 40, xDistance: -220, yDistance: 0,
      speed: 600, preventFling: true, gestureSourceType: 'touch'
    });
    await frame.waitForFunction(() => document.querySelector('.hand-viewport').scrollLeft > 50);
    await frame.waitForFunction(() => {
      const left = document.querySelector('.hand-viewport').scrollLeft;
      window.__handStillFrames = window.__handLastScroll === left ? (window.__handStillFrames || 0) + 1 : 0;
      window.__handLastScroll = left; return window.__handStillFrames > 8;
    });
    const scrolled = await position(frame);
    assert.equal(scrolled.tableScrollTop, 0);
    assert(Math.abs(scrolled.cardTop - initial.cardTop) < 1, mode + ': horizontal swipes must preserve the hand height');
    await frame.locator('.hand-viewport').evaluate(element => element.scrollLeft = element.scrollWidth);
    await frame.waitForFunction(() => [...document.querySelectorAll('.hand-card img')].filter(image => {
      const rect = image.getBoundingClientRect(); return rect.left < innerWidth && rect.right > 0;
    }).every(image => image.complete));
    const screenshot = path.join(process.env.HAND_POSITION_ARTIFACTS || '/tmp', `prizemap-hand-position-${mode}.png`);
    await page.screenshot({ path: screenshot });

    // A lowered, clipped card must still start its real play action on touch.
    const source = await frame.locator('.hand-card[aria-label^="N\'s PP Up,"]').boundingBox();
    const target = await frame.locator('.ptcg-board-bench').nth(1).locator('.ptcg-board-drop-target:visible').first().boundingBox();
    const start = { x: source.x + source.width / 2, y: source.y + 35 };
    const end = { x: target.x + target.width / 2, y: target.y + target.height / 2 };
    await touch('touchStart', start.x, start.y);
    await touch('touchMove', start.x, start.y - 35); await page.waitForTimeout(20);
    for (let step = 1; step <= 8; step++) {
      await touch('touchMove', start.x + (end.x - start.x) * step / 8, start.y - 35 + (end.y - start.y + 35) * step / 8);
      await page.waitForTimeout(20);
    }
    await touch('touchEnd');
    await frame.waitForSelector('ptcg-prompt-attach-energy');
    assert.deepEqual(errors, []);
    return { mode, initial, focused, scrolled, nativeSwipe: true, nativePlay: true, screenshot, errors };
  } catch (error) { error.message = mode + ': ' + error.message; throw error; }
  finally { await context.close(); }
}

(async () => {
  const server = process.env.CLIENT_SIMULATOR_URL ? null : await serve();
  const origin = process.env.CLIENT_SIMULATOR_URL || server.origin;
  let browser;
  try {
    // Chromium needs a native window large enough to synthesize touches over the phone's bottom hand rail.
    browser = await chromium.launch({ headless: true, args: ['--window-size=1000,1000'], ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
    const results = [];
    for (const mode of ['native', 'iframe']) results.push(await verify(browser, origin, mode));
    console.log(JSON.stringify({ ok: true, origin, results }, null, 2));
  } finally { if (browser) await browser.close(); if (server) await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
