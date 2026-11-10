'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const vm = require('node:vm');
const { packageClientBuild, SUPPORTED_SNAPSHOT_FORMATS, SNAPSHOT_FORMATS_META } = require('./package-client-build.cjs');
const { collectResources, bootstrap } = require('./static-resources.cjs');
const { validateManifest } = require('../../tools/check-simulator-package.cjs');
const digest = data => crypto.createHash('sha256').update(data).digest('hex');

function fixture(t) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-package-'));
  t.after(() => fs.rmSync(temporary, { force: true, recursive: true }));
  const root = path.join(temporary, 'dist'), destination = path.join(temporary, 'cdn');
  fs.mkdirSync(path.join(root, 'assets/simulator'), { recursive: true });
  fs.writeFileSync(path.join(root, 'index.html'), SNAPSHOT_FORMATS_META + '<base href="./"><script src="simulator-static.123abc.js"></script><script src="main.js"></script><link href="styles.css" rel="stylesheet">');
  fs.writeFileSync(path.join(root, 'main.js'), 'console.log("engine");');
  fs.writeFileSync(path.join(root, 'styles.css'), 'body{color:red}');
  fs.writeFileSync(path.join(root, 'simulator-static.123abc.js'), 'var images="embedded";');
  fs.writeFileSync(path.join(root, 'assets/simulator/cards.hash.json'), '{"schemaVersion":2}');
  fs.writeFileSync(path.join(root, 'assets/simulator/cards.abc.json'), '{"cards":[]}');
  fs.writeFileSync(path.join(root, 'assets/icon.png'), 'already embedded PNG');
  fs.writeFileSync(path.join(root, 'assets/settings.json'), '{"embedded":true}');
  fs.writeFileSync(path.join(root, 'main.js.map'), 'not a runtime resource');
  return { root, destination };
}

test('identical finalized bytes reuse one immutable release across unique builds', t => {
  const options = fixture(t);
  const first = packageClientBuild(options), second = packageClientBuild(options);
  assert.notEqual(first.buildId, second.buildId);
  assert.equal(first.packageHash, second.packageHash);
  assert.deepEqual(first.archive, second.archive);
  assert.deepEqual(fs.readdirSync(path.join(options.destination, 'releases')), [first.packageHash]);
  assert.equal(JSON.parse(fs.readFileSync(path.join(options.destination, 'simulator-manifest.json'))).buildId, second.buildId);
  validateManifest(second, 'https://cdn.example/simulator-manifest.json');
});

test('final HTML, engine, presentation payload, CSS and card data each invalidate the package', t => {
  const options = fixture(t);
  const first = packageClientBuild(options);
  for (const file of ['index.html', 'main.js', 'styles.css', 'simulator-static.123abc.js', 'assets/simulator/cards.abc.json']) {
    const filename = path.join(options.root, file), original = fs.readFileSync(filename);
    fs.appendFileSync(filename, '\n ');
    const updated = packageClientBuild(options);
    assert.notEqual(updated.packageHash, first.packageHash, file);
    fs.writeFileSync(filename, original);
  }
  const stillPresent = path.join(options.destination, 'releases', first.packageHash, 'main.js');
  assert.equal(fs.readFileSync(stillPresent, 'utf8'), 'console.log("engine");');
});

test('inventory and ZIP verify against real bytes; redundant embedded sources/maps are excluded', t => {
  const options = fixture(t), manifest = packageClientBuild(options);
  const release = path.join(options.destination, 'releases', manifest.packageHash);
  const names = manifest.assets.map(asset => asset.path);
  assert.ok(!names.includes('assets/icon.png'));
  assert.ok(!names.includes('assets/settings.json'));
  assert.ok(!names.includes('main.js.map'));
  for (const asset of manifest.assets) {
    const bytes = fs.readFileSync(path.join(release, asset.path));
    assert.equal(bytes.length, asset.bytes); assert.equal(digest(bytes), asset.sha256);
  }
  const archive = fs.readFileSync(path.join(release, manifest.archive.path));
  assert.equal(archive.length, manifest.archive.bytes); assert.equal(digest(archive), manifest.archive.sha256);
  let position = 0;
  const extracted = new Map();
  while (archive.readUInt32LE(position) === 0x04034b50) {
    const compressedLength = archive.readUInt32LE(position + 18);
    const length = archive.readUInt32LE(position + 22), nameLength = archive.readUInt16LE(position + 26);
    const extraLength = archive.readUInt16LE(position + 28);
    const name = archive.subarray(position + 30, position + 30 + nameLength).toString();
    const start = position + 30 + nameLength + extraLength;
    const data = zlib.inflateRawSync(archive.subarray(start, start + compressedLength));
    assert.equal(data.length, length); extracted.set(name, data);
    position = start + compressedLength;
  }
  assert.deepEqual([...extracted.keys()].sort(), [...names, 'package-manifest.json'].sort());
  for (const asset of manifest.assets) assert.equal(digest(extracted.get(asset.path)), asset.sha256);
  const embeddedManifest = JSON.parse(extracted.get('package-manifest.json'));
  const sideManifest = JSON.parse(fs.readFileSync(path.join(release, 'package-manifest.json')));
  const stableManifest = JSON.parse(fs.readFileSync(path.join(options.destination, 'simulator-manifest.json')));
  assert.equal(embeddedManifest.packageHash, manifest.packageHash);
  for (const declaration of [manifest, embeddedManifest, sideManifest, stableManifest]) {
    assert.deepEqual(declaration.supportedSnapshotFormats, SUPPORTED_SNAPSHOT_FORMATS);
  }
  assert.ok(extracted.get('index.html').toString().includes(SNAPSHOT_FORMATS_META));
  assert.equal(archive.readUInt32LE(position), 0x02014b50);
  assert.equal(archive.readUInt32LE(archive.length - 22), 0x06054b50);
});

test('corrupted existing releases cannot be overwritten at immutable URLs', t => {
  const options = fixture(t), manifest = packageClientBuild(options);
  fs.writeFileSync(path.join(options.destination, 'releases', manifest.packageHash, 'main.js'), 'corrupt');
  assert.throws(() => packageClientBuild(options), /immutable release/);
});

test('pinned card metadata is embedded once and changes the package when its contents change', t => {
  const options = fixture(t), hash = 'a'.repeat(64);
  fs.unlinkSync(path.join(options.root, 'assets/simulator/cards.abc.json'));
  const name = `assets/simulator/cards.${hash}.json`;
  const catalogueHash = 'b'.repeat(64);
  const metadata = { ok: true, cardsInfo: { schemaVersion: 3, hash, catalogueHash,
    images: ['https://images.example/one.png'] } };
  fs.writeFileSync(path.join(options.root, 'assets/simulator/cards.hash.json'),
    JSON.stringify({ schemaVersion: 3, hash, catalogueHash, cardsTotal: 1 }));
  const refresh = () => {
    fs.writeFileSync(path.join(options.root, name), JSON.stringify(metadata));
    fs.writeFileSync(path.join(options.root, 'simulator-static.123abc.js'), bootstrap(collectResources(options.root)));
  };
  refresh();
  const first = packageClientBuild(options);
  assert.ok(!first.assets.some(asset => asset.path.startsWith('assets/simulator/')),
    'native packages must not download another copy of the embedded metadata');
  const context = vm.createContext({ document: { documentElement: { style: { setProperty() {} } } } });
  vm.runInContext(fs.readFileSync(path.join(options.root, 'simulator-static.123abc.js'), 'utf8'), context);
  assert.equal(context.__SIMULATOR_STATIC__.json[name].cardsInfo.images[0],
    metadata.cardsInfo.images[0]);
  metadata.cardsInfo.images[0] = 'https://images.example/two.png';
  refresh();
  assert.notEqual(packageClientBuild(options).packageHash, first.packageHash);
});

test('unfinalized/missing entrypoint resources and recursive destinations fail before publication', t => {
  const options = fixture(t);
  assert.throws(() => packageClientBuild({ ...options, destination: path.join(options.root, 'releases') }), /outside/);
  fs.unlinkSync(path.join(options.root, 'main.js'));
  assert.throws(() => packageClientBuild(options), /missing release file/);
  assert.ok(!fs.existsSync(path.join(options.destination, 'simulator-manifest.json')));
});

test('missing or stale HTML capability bindings fail before immutable publication', t => {
  const options = fixture(t);
  const file = path.join(options.root, 'index.html');
  const index = fs.readFileSync(file, 'utf8');
  for (const value of ['', '<meta name="prizemap-supported-snapshot-formats" content="base64">']) {
    fs.writeFileSync(file, index.replace(SNAPSHOT_FORMATS_META, value));
    assert.throws(() => packageClientBuild(options), /snapshot format metadata/);
    assert.ok(!fs.existsSync(path.join(options.destination, 'simulator-manifest.json')));
  }
});

test('canonical HTML selects the release root before any external script on deep routes', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
  const firstScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const pathname of ['/', '/sandbox-viewer', '/table/1', `/releases/${'a'.repeat(64)}/table/7`]) {
    let base = './';
    vm.runInNewContext(firstScript, { location: { pathname, protocol: 'https:' },
      document: { querySelector: () => ({ getAttribute: () => base, setAttribute: (_, value) => { base = value; } }) } });
    assert.equal(base, pathname.startsWith('/releases/') ? `/releases/${'a'.repeat(64)}/` : '/');
  }
  assert.ok(html.indexOf(firstScript) < html.indexOf('<script src="simulator-static.js">'));
});

test('canonical initializer preserves an explicit asset base on stable public routes', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
  const firstScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const selected = `/releases/${'b'.repeat(64)}/`;
  for (const pathname of ['/', '/sandbox-viewer', '/table/17']) {
    let base = selected;
    const location = { pathname, protocol: 'https:', hash: '#SNAPSHOT%2B%2F%3D', search: '?saved=1' };
    vm.runInNewContext(firstScript, { location,
      document: { querySelector: () => ({ getAttribute: () => base, setAttribute: (_, value) => { base = value; } }) } });
    assert.equal(base, selected);
    assert.equal(new URL('main.js', `https://sim-static.prizemap.app${base}`).pathname, `${selected}main.js`);
    assert.equal(location.hash, '#SNAPSHOT%2B%2F%3D');
    assert.equal(location.search, '?saved=1');
  }
});

test('canonical initializer retains relative file-bundle assets', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
  const firstScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  let base = './';
  vm.runInNewContext(firstScript, { location: { pathname: '/app/cache/index.html', protocol: 'file:' },
    document: { querySelector: () => ({ getAttribute: () => base, setAttribute: (_, value) => { base = value; } }) } });
  assert.equal(base, './');
});
