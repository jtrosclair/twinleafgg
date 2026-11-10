#!/usr/bin/env node
'use strict';

// Browser regression against a fresh production build and a real saved puzzle.
// Run: node tools/test-holo-rendering.cjs
// Optional: CLIENT_SIMULATOR_URL, PLAYWRIGHT_CHROMIUM_EXECUTABLE.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const zlib = require('node:zlib');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(
  path.join(__dirname, 'fixtures/phantom-maze.snapshot.json.gz'))));
// Preserve the real puzzle and explicitly mark its Active Pokémon's Ability
// as used, so the production component renders the actual badge.
const abilityUsedState = JSON.parse(Buffer.from(snapshot.stateData, 'base64').toString('utf8'));
abilityUsedState[0][0].active.boardEffect = [0]; // BoardEffect.ABILITY_USED
const stateData = Buffer.from(JSON.stringify(abilityUsedState)).toString('base64');

async function serveBuild() {
  const build = path.join(root, 'ptcg-play/dist/ptcg-play');
  if (!fs.existsSync(path.join(build, 'index.html'))) {
    throw new Error('Build first: npm --prefix ptcg-play run build');
  }
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon' };
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
  return { origin: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise(resolve => server.close(resolve)) };
}

async function inspect(browser, origin, scenario) {
  const context = await browser.newContext({ viewport: { width: 390, height: 740 },
    isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(({ memory, cores, preference }) => {
      Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: memory });
      Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: cores });
      window.ReactNativeWebView = { postMessage() {} };
      try {
        if (preference === null) localStorage.removeItem('holoEnabled');
        else localStorage.setItem('holoEnabled', JSON.stringify(preference));
      } catch { /* The assertion below reports unavailable preferences. */ }
    }, scenario);
    await page.goto(origin + '/sandbox-viewer#' + stateData, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hand-card .card-container');
    await page.waitForSelector('.ptcg-board-player:not(.upside-down) .ptcg-board-active .ptcg-ability-used');
    // Require real CDN artwork to finish, rather than accepting a placeholder.
    await page.waitForFunction(() => {
      const img = document.querySelector('.hand-card img.base-image');
      return img && img.complete && img.naturalWidth > 1 && /^https?:/.test(img.src);
    }, null, { timeout: 45000 });

    const result = await page.evaluate(() => {
      const rect = element => { const r = element.getBoundingClientRect(); return { width: r.width, height: r.height, top: r.top }; };
      const visible = element => { const s = getComputedStyle(element); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0; };
      const card = document.querySelector('.hand-card');
      const container = card.querySelector('.card-container');
      const spacer = getComputedStyle(container, '::after');
      const image = card.querySelector('img.base-image');
      const stack = [...document.querySelectorAll('.hand-stack')].find(item => item.querySelector('.stack-count'));
      const stackCard = stack?.querySelector('.hand-card');
      const stackCopy = stack?.querySelector('.hand-stack-copy');
      const playable = document.querySelector('.hand-stack.playable');
      const playableCard = playable?.querySelector('.hand-card');
      const border = playableCard && getComputedStyle(playableCard, '::after');
      const arrow = playable?.querySelector('.playable-arrow');
      const overlays = [...document.querySelectorAll('.holo-overlay')];
      const ability = document.querySelector('.ptcg-board-player:not(.upside-down) .ptcg-board-active .ptcg-ability-used');
      const badge = ability.querySelector('.ptcg-badge');
      const abilityStyle = getComputedStyle(ability);
      const abilityRect = badge.getBoundingClientRect();
      const hitX = abilityRect.left + abilityRect.width / 2;
      const hitY = abilityRect.top + abilityRect.height / 2;
      const priorPointerEvents = ability.style.pointerEvents;
      const pointerEvents = abilityStyle.pointerEvents;
      // The real indicator deliberately ignores pointer events. Enable them
      // only for hit-testing: elementFromPoint then checks actual paint order
      // at the badge's centre rather than merely comparing z-index numbers.
      ability.style.pointerEvents = 'auto';
      const top = document.elementFromPoint(hitX, hitY);
      const abilityOnTop = !!top && ability.contains(top);
      ability.style.pointerEvents = priorPointerEvents;
      return {
        preference: localStorage.getItem('holoEnabled'),
        lowGraphics: card.classList.contains('low-graphics'),
        card: rect(card), container: rect(container), image: rect(image), imageSrc: image.currentSrc || image.src,
        imageNaturalWidth: image.naturalWidth, imageVisible: visible(image),
        spacer: { display: spacer.display, content: spacer.content, paddingBottom: spacer.paddingBottom },
        stack: stack && { count: stack.querySelector('.stack-count').textContent.trim(),
          countRect: rect(stack.querySelector('.stack-count')), countVisible: visible(stack.querySelector('.stack-count')),
          front: rect(stackCard), copy: rect(stackCopy), copyVisible: visible(stackCopy),
          copyFilter: getComputedStyle(stackCopy).filter },
        playable: playable && { borderWidth: border.borderTopWidth, borderStyle: border.borderTopStyle,
          borderShadow: border.boxShadow, arrow: rect(arrow), arrowVisible: visible(arrow) },
        cardFilter: getComputedStyle(card).filter,
        transform: getComputedStyle(container).transform,
        holoClasses: document.querySelectorAll('.card-container.holo,.card-container.trainer-holo,.card-container.fullart-holo,.card-container.radiant-holo,.card-container.ace-spec-holo').length,
        visibleHolo: overlays.filter(item => getComputedStyle(item).display !== 'none').length,
        ability: { text: badge.textContent.trim(), pointerEvents, onTop: abilityOnTop,
          zIndex: abilityStyle.zIndex, width: abilityRect.width, height: abilityRect.height,
          x: hitX, y: hitY, topTag: top?.tagName, topClass: top?.className },
        urls: [...document.querySelectorAll('.hand-card img.base-image')].map(img => img.getAttribute('src'))
      };
    });
    assert.equal(result.lowGraphics, scenario.low, `${scenario.name}: low-graphics class`);
    assert(result.ability.text.length > 0 && result.ability.width > 0 && result.ability.height > 0,
      `${scenario.name}: the actual Ability-used badge is visible and sized`);
    assert.equal(result.ability.pointerEvents, 'none', `${scenario.name}: badge must not block drag or click`);
    assert.equal(result.ability.onTop, true,
      `${scenario.name}: badge must be above card artwork (hit ${result.ability.topTag}.${result.ability.topClass})`);
    assert.equal(result.preference, scenario.preference === null ? null : JSON.stringify(scenario.preference),
      `${scenario.name}: automatic preference must not be persisted`);
    assert(result.card.width > 30 && result.card.height > 40, `${scenario.name}: hand card has dimensions`);
    assert(Math.abs(result.container.height / result.container.width - 1.37) < 0.03,
      `${scenario.name}: card aspect ratio is preserved`);
    assert.equal(result.spacer.display, 'block', `${scenario.name}: aspect-ratio pseudo-element is displayed`);
    assert.notEqual(result.spacer.content, 'none', `${scenario.name}: aspect-ratio pseudo-element exists`);
    assert(parseFloat(result.spacer.paddingBottom) > 40, `${scenario.name}: aspect-ratio pseudo-element has height`);
    assert(result.imageVisible, `${scenario.name}: artwork image is displayed`);
    assert(result.image.width > 30 && result.image.height > 40 && result.imageNaturalWidth > 1 && /^https?:/.test(result.imageSrc),
      `${scenario.name}: artwork has size and a real image URL`);
    assert(result.urls.filter(url => /^https?:/.test(url || '')).length >= 2,
      `${scenario.name}: multiple real card image URLs are bound`);
    assert(result.stack && Number(result.stack.count) > 1 && result.stack.countVisible && result.stack.countRect.width > 0,
      `${scenario.name}: duplicate stack count is visible`);
    assert(result.stack.copyVisible && result.stack.copy.width > 30 && result.stack.copy.height > 40 && result.stack.copy.top < result.stack.front.top,
      `${scenario.name}: stacked copies retain geometry`);
    assert(result.playable && parseFloat(result.playable.borderWidth) > 0 && result.playable.borderStyle !== 'none',
      `${scenario.name}: playable border remains visible`);
    assert(result.playable.arrow.width > 0 && result.playable.arrow.height > 0 && result.playable.arrowVisible,
      `${scenario.name}: playable arrow remains visible`);
    if (scenario.low) {
      assert.equal(result.cardFilter, 'none', `${scenario.name}: hand filter removed`);
      assert.equal(result.stack.copyFilter, 'none', `${scenario.name}: stacked-card filter removed`);
      assert.equal(result.playable.borderShadow, 'none', `${scenario.name}: expensive glow removed`);
      assert.equal(result.transform, 'none', `${scenario.name}: forced card layer removed`);
    } else {
      assert.notEqual(result.cardFilter, 'none', `${scenario.name}: ordinary hand appearance retained`);
      assert.notEqual(result.playable.borderShadow, 'none', `${scenario.name}: ordinary glow retained`);
    }
    if (scenario.holo) {
      assert(result.holoClasses > 0 && result.visibleHolo > 0, `${scenario.name}: Holo is enabled`);
    } else {
      assert.equal(result.holoClasses, 0, `${scenario.name}: Holo classes are disabled`);
      assert.equal(result.visibleHolo, 0, `${scenario.name}: Holo overlays are hidden`);
    }
    assert.deepEqual(errors, [], `${scenario.name}: no uncaught browser errors`);
    return { name: scenario.name, ...result };
  } finally { await context.close(); }
}

(async () => {
  const server = process.env.CLIENT_SIMULATOR_URL ? null : await serveBuild();
  const origin = process.env.CLIENT_SIMULATOR_URL || server.origin;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
    const scenarios = [
      { name: 'low-memory-automatic', memory: 2, cores: 8, preference: null, low: true, holo: false },
      { name: 'low-memory-explicit-on', memory: 2, cores: 8, preference: true, low: true, holo: true },
      { name: 'normal-automatic', memory: 8, cores: 8, preference: null, low: false, holo: true }
    ];
    const results = [];
    for (const scenario of scenarios) results.push(await inspect(browser, origin, scenario));
    for (const result of results.slice(1)) {
      assert(Math.abs(result.card.width - results[0].card.width) < 0.1 &&
        Math.abs(result.card.height - results[0].card.height) < 0.1 && result.stack.count === results[0].stack.count,
      `${result.name}: graphics preference must not change card or stack geometry`);
    }
    console.log(JSON.stringify({ ok: true, scenarios: results }, null, 2));
  } finally { if (browser) await browser.close(); if (server) await server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
