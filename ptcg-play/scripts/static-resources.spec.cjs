const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { aliases } = require('./ui-asset-aliases.json');
const { collectResources, bootstrap, resourceKey, svgDataUrl } = require('./static-resources.cjs');
const { auditAssets } = require('./audit-simulator-assets.cjs');
function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-image-alias-'));
  try { return run(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function write(root, file, value) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), value);
}
test('every legacy alias points directly to a verified current image and no old source remains', () => {
  const root = path.resolve(__dirname, '../src'), resources = collectResources(root);
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'ui-assets-manifest.json'), 'utf8'));
  assert.equal(manifest.version, 3);
  assert.ok(Object.keys(aliases).length >= 32);
  for (const [alias, target] of Object.entries(aliases)) {
    assert.ok(manifest.assets.some(asset => asset.path === target));
    assert.equal(fs.existsSync(path.join(root, alias)), false);
    assert.equal(resources.urls[alias], resources.urls[target]);
    assert.match(resources.urls[target], /^data:image\/(?:webp;base64,|svg\+xml,)/);
    assert.equal(resources.css[alias], resourceKey(alias));
    assert.equal(aliases[target], undefined);
  }
});
test('legacy and current names serialize one shared image value and work without network', () => fixture(root => {
  write(root, 'assets/cardback.svg', 'same-image');
  write(root, 'cardback.hash.svg', 'same-image');
  const source = bootstrap(collectResources(root));
  assert.equal(source.split('data:image/svg+xml,same-image').length, 2);
  const context = vm.createContext({ document: { documentElement: { style: { setProperty() {} } } } });
  vm.runInContext(source, context);
  const urls = context.__SIMULATOR_STATIC__.urls;
  assert.equal(urls['assets/cardback.png'], urls['assets/cardback.svg']);
  assert.equal(urls['assets/cardback.webp'], urls['assets/cardback.svg']);
  assert.equal(urls['cardback.hash.svg'], urls['assets/cardback.svg']);
}));
test('UTF-8 SVG URLs preserve exact Unicode bytes and are safe in CSS, HTML and JavaScript contexts', async () => fixture(async root => {
  const svg = '\uFEFF<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2">\r\n'
    + '<!-- </script> -->\n<title>Pokémon 日本語 ⚡ 🙂 &amp; " \' ( ) ! * # % \\ ?</title>\n'
    + '<path fill="url(#color)" d="M0 0h2v2z"/>\t</svg>\n';
  const bytes = Buffer.from(svg);
  write(root, 'assets/unicode.svg', bytes);
  write(root, 'assets/binary.webp', Buffer.from([0, 1, 254, 255]));
  const resources = collectResources(root), url = resources.urls['assets/unicode.svg'];
  assert.equal(url, svgDataUrl(bytes));
  assert.deepEqual(Buffer.from(decodeURIComponent(url.slice(url.indexOf(',') + 1))), bytes);
  assert.doesNotMatch(url, /["'()<>\s\\]/, 'URL delimiters and markup are percent escaped');
  assert.ok(url.includes('%23color') && url.includes('%25'));
  assert.equal(resources.urls['assets/binary.webp'], 'data:image/webp;base64,AAH+/w==');
  const declarations = new Map();
  const context = vm.createContext({ document: { documentElement: { style: {
    setProperty(key, value) { declarations.set(key, value); }
  } } } });
  const source = bootstrap(resources);
  assert.doesNotMatch(source, /<\/script>/i, 'SVG text cannot terminate an inline script');
  vm.runInContext(source, context);
  assert.equal(context.__SIMULATOR_STATIC__.urls['assets/unicode.svg'], url);
  assert.equal(declarations.get(resourceKey('assets/unicode.svg')), `url("${url}")`);
  const response = await fetch(url);
  assert.equal(response.headers.get('content-type'), 'image/svg+xml');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes, 'A standards data-URL fetch restores exact SVG bytes');
}));
test('invalid SVG UTF-8 fails closed instead of changing reviewed source bytes', () => {
  assert.throws(() => svgDataUrl(Buffer.from([0x3c, 0x73, 0xff, 0x3e])), /encoded data|encoding/i);
});
test('partial resource trees skip absent alias targets and conflicting old files fail closed', () => fixture(root => {
  assert.equal(collectResources(root).urls['assets/cardback.png'], undefined);
  write(root, 'assets/cardback.svg', 'new');
  write(root, 'assets/cardback.png', 'old');
  assert.throws(() => collectResources(root), /alias conflicts/);
}));
test('asset audit resolves only explicit legacy references to their physical target', () => fixture(root => {
  write(root, 'src/assets/cardback.svg', 'cardback');
  write(root, 'src/app.ts', "const fallback = 'assets/cardback.png';");
  write(root, 'scripts/ui-asset-aliases.json', JSON.stringify({ aliases: { 'assets/cardback.png': 'assets/cardback.svg' } }));
  const result = auditAssets({ root });
  assert.equal(result.passed, true);
  assert.equal(result.assets[0].evidence[0].legacyAlias, 'assets/cardback.png');
  assert.equal(result.assets[0].path, 'assets/cardback.svg');
}));
test('alias inventory alone does not hide an unused target and missing targets stay errors', () => fixture(root => {
  write(root, 'src/assets/cardback.svg', 'cardback');
  write(root, 'scripts/ui-asset-aliases.json', JSON.stringify({ aliases: { 'assets/cardback.png': 'assets/cardback.svg' } }));
  assert.equal(auditAssets({ root }).unused[0].path, 'assets/cardback.svg');
  fs.unlinkSync(path.join(root, 'src/assets/cardback.svg'));
  write(root, 'src/app.ts', "const fallback = 'assets/cardback.png';");
  assert.equal(auditAssets({ root }).missing[0].path, 'assets/cardback.svg');
}));
test('asset audit rejects alias paths that escape the explicit UI asset namespace', () => fixture(root => {
  write(root, 'src/assets/safe.webp', 'image');
  write(root, 'scripts/ui-asset-aliases.json', JSON.stringify({ aliases: { 'assets/cardback.png': '../safe.webp' } }));
  assert.throws(() => auditAssets({ root }), /Unsupported UI asset alias/);
}));
