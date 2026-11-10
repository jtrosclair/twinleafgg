const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { finalizeClientBuild } = require('./finalize-client-build.cjs');
const { resourceKey } = require('./static-resources.cjs');
const { SNAPSHOT_FORMATS_META } = require('./package-client-build.cjs');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-finalizer-'));
try {
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
  const cardbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><title>Pokémon ⚡ &amp; \'quotes\'</title></svg>';
  fs.writeFileSync(path.join(root, 'assets/cardback.svg'), cardbackSvg);
  fs.writeFileSync(path.join(root, 'assets/logo.png'), 'logo');
  fs.writeFileSync(path.join(root, 'logo.hash.png'), 'logo');
  fs.writeFileSync(path.join(root, 'font.woff2'), 'font');
  fs.writeFileSync(path.join(root, 'favicon.ico'), 'document-icon');
  fs.writeFileSync(path.join(root, 'index.html'), '<script src="simulator-static.js"></script><script src="main.js"></script>');
  fs.writeFileSync(path.join(root, 'styles.css'), '.logo{background:url(/assets/logo.png)}.hidden{background:url(/assets/cardback.png)}@font-face{src:url(font.woff2)}');
  fs.writeFileSync(path.join(root, 'before.js'), 'var __simImage0="reserved";var __simImage\\u0031="escaped";');
  fs.writeFileSync(path.join(root, 'main.js'), `
    "use strict";
    var registry = {"assets/cardback.png":"kept-object-key"};
    var map = new Map([["assets/cardback.png","kept-map-key"]]);
    var set = new Set(["assets/cardback.png"]);
    var result = {
      strict: function() { return this; },
      scoped: function() { var __simImage2 = 'local'; return [__simImage2, "assets/logo.png"]; },
      repeated: function() { return ["assets/cardback.png", "assets/cardback.png", "assets/cardback.png"]; },
      fallback: function() { return globalThis.__SIMULATOR_STATIC__.urls["assets/cardback.png"]; },
      direct: "assets/logo.png",
      vector: "assets/cardback.svg",
      attributes: ["src","/assets/logo.png","alt","Logo"],
      key: registry["assets/cardback.png"],
      mapKey: map.get("assets/cardback.png"),
      setKey: set.has("assets/cardback.png"),
      owns: registry.hasOwnProperty("assets/cardback.png"),
      ownsCall: Object.prototype.hasOwnProperty.call(registry,"assets/cardback.png"),
      externalScan: "https://cards.example.test/scan.png"
    };
  `);
  fs.writeFileSync(path.join(root, 'next.js'), `var next = function() {
    return ["assets/logo.png", "assets/logo.png", "assets/logo.png"];
  };`);
  const filename = finalizeClientBuild(root);
  const finalizedIndex = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.equal(finalizedIndex.split(SNAPSHOT_FORMATS_META).length, 2,
    'one non-executing capability declaration is included in inventoried HTML');
  const once = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  const context = vm.createContext({ document: { documentElement: { style: { setProperty() {} } } } });
  vm.runInContext(fs.readFileSync(path.join(root, filename), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'before.js'), 'utf8'), context);
  vm.runInContext(once, context);
  const next = fs.readFileSync(path.join(root, 'next.js'), 'utf8');
  vm.runInContext(next, context);
  const urls = context.__SIMULATOR_STATIC__.urls;
  assert.equal(urls['font.woff2'], undefined, 'fonts live in their font-face declaration only');
  assert.equal(urls['favicon.ico'], undefined, 'the standalone document icon is not duplicated in the game image table');
  assert.equal(context.__SIMULATOR_STATIC__.css['font.woff2'], undefined);
  assert.equal(context.__SIMULATOR_STATIC__.css['favicon.ico'], undefined);
  assert.equal(urls['assets/logo.png'], urls['logo.hash.png']);
  assert.equal(fs.readFileSync(path.join(root, filename), 'utf8').split('data:image/png;base64,bG9nbw==').length, 2,
    'duplicate emitted images share one serialized data URL');
  assert.equal(context.result.fallback(), urls['assets/cardback.png']);
  assert.equal(urls['assets/cardback.png'], urls['assets/cardback.svg'], 'legacy raster names retain their current SVG URL');
  assert.match(urls['assets/cardback.svg'], /^data:image\/svg\+xml,%3Csvg/);
  assert.equal(decodeURIComponent(urls['assets/cardback.svg'].split(',')[1]), cardbackSvg);
  assert.equal(context.result.vector, urls['assets/cardback.svg'], 'SVG source attributes use the packaged UTF-8 URL');
  assert.equal(context.result.strict.call(undefined), undefined, 'strict-mode directives remain active');
  assert.equal(context.__simImage0, 'reserved', 'other script identifiers cannot be overwritten');
  assert.equal(context.__simImage1, 'escaped', 'escaped identifiers cannot be overwritten');
  assert.equal(context.result.scoped()[0], 'local');
  assert.equal(context.result.scoped()[1], urls['assets/logo.png'], 'local bindings cannot shadow URL aliases');
  assert.deepEqual(Array.from(context.result.repeated()), Array(3).fill(urls['assets/cardback.png']));
  assert.deepEqual(Array.from(context.next()), Array(3).fill(urls['assets/logo.png']), 'scripts use separate aliases');
  assert.equal(once.split('globalThis.__SIMULATOR_STATIC__.urls["assets/logo.png"]').length, 2,
    'repeated URL values share a single bootstrap lookup');
  assert.equal(context.result.direct, urls['assets/logo.png']);
  assert.equal(context.result.attributes[1], urls['assets/logo.png']);
  assert.equal(context.result.key, 'kept-object-key');
  assert.equal(context.result.mapKey, 'kept-map-key');
  assert.equal(context.result.setKey, true);
  assert.equal(context.result.owns, true);
  assert.equal(context.result.ownsCall, true);
  assert.equal(context.result.externalScan, 'https://cards.example.test/scan.png');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.ok(css.includes(`var(${resourceKey('assets/logo.png')})`));
  assert.ok(css.includes(`var(${resourceKey('assets/cardback.png')})`), 'legacy SVG-backed CSS references retain their stable property key');
  assert.ok(css.includes('url(data:font/woff2;base64,'));
  assert.equal(finalizeClientBuild(root), filename);
  assert.equal(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), finalizedIndex,
    'repeated finalization preserves capability and HTML bytes');
  assert.equal(fs.readFileSync(path.join(root, 'main.js'), 'utf8'), once);
  assert.equal(fs.readFileSync(path.join(root, 'next.js'), 'utf8'), next);
  console.log('Finalizer regression passed: repeated URL values shared; lookup keys, bindings, strict mode and external scans preserved; repeat run unchanged.');
} finally { fs.rmSync(root, { recursive: true, force: true }); }
