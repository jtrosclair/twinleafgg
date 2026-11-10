'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { test } = require('node:test');
const { inventoryHash, validateManifest, checkPackage } = require('./check-simulator-package.cjs');
const execFileAsync = promisify(execFile);
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

function manifest(overrides = {}) {
  const files = { 'index.html': '<base href="./">', 'main.123.js': 'play()',
    'assets/simulator/cards.hash.json': '{"hash":"cards"}', 'styles.456.css': 'body{}' };
  const assets = Object.entries(files).map(([path, content]) => ({ path, sha256: digest(content), bytes: Buffer.byteLength(content) }));
  const packageHash = inventoryHash(assets);
  return { schemaVersion: 1, packageHash, buildId: 'build-one', builtAt: '2026-11-06T12:00:00.000Z',
    packageBaseUrl: `releases/${packageHash}/`, entrypoint: 'index.html', assets,
    archive: { path: `simulator-package.${packageHash}.zip`, sha256: digest('ZIP'), bytes: 3 }, ...overrides };
}

async function server(t, handler) {
  const requests = [];
  const instance = http.createServer((req, res) => {
    requests.push({ url: req.url, method: req.method, etag: req.headers['if-none-match'] });
    handler(req, res);
  });
  await new Promise(resolve => instance.listen(0, '127.0.0.1', resolve));
  t.after(() => { instance.closeAllConnections(); return new Promise(resolve => instance.close(resolve)); });
  return { url: `http://127.0.0.1:${instance.address().port}`, requests };
}

function json(res, value, headers = {}) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(value));
}

test('cold cache emits a complete, version-pinned download plan and performs only the manifest GET', async t => {
  const value = manifest();
  const fixture = await server(t, (_req, res) => json(res, value, { ETag: '"manifest-one"' }));
  const result = await checkPackage({ manifestURL: `${fixture.url}/simulator-manifest.json` });
  assert.equal(result.action, 'downloadManifestAssets');
  assert.equal(result.reason, 'noCachedPackage');
  assert.equal(result.etag, '"manifest-one"');
  assert.equal(result.entrypointUrl, `${fixture.url}/releases/${value.packageHash}/index.html`);
  assert.equal(result.assets.length, value.assets.length);
  assert.equal(result.archive.url, `${fixture.url}/releases/${value.packageHash}/${value.archive.path}`);
  for (const asset of result.assets) assert.equal(asset.url, `${fixture.url}/releases/${value.packageHash}/${asset.path}`);
  assert.deepEqual(fixture.requests, [{ url: '/simulator-manifest.json', method: 'GET', etag: undefined }]);
});

test('same content with a distinct deployment buildId reuses the cached package', async t => {
  const value = manifest({ buildId: 'build-two', builtAt: '2026-11-06T13:00:00.000Z' });
  const fixture = await server(t, (_req, res) => json(res, value));
  const result = await checkPackage({ manifestURL: `${fixture.url}/manifest.json`, cachedPackageHash: value.packageHash });
  assert.equal(result.action, 'reuseCachedPackage');
  assert.equal(result.reason, 'packageHashMatches');
  assert.equal(result.buildId, 'build-two');
  assert.deepEqual(result.assets, []);
});

test('a stale cache gets only the new package inventory, never a mix of package paths', async t => {
  const value = manifest();
  const fixture = await server(t, (_req, res) => json(res, value));
  const staleHash = 'f'.repeat(64);
  const result = await checkPackage({ manifestURL: `${fixture.url}/manifest.json`, cachedPackageHash: staleHash });
  assert.equal(result.action, 'downloadManifestAssets');
  assert.equal(result.reason, 'packageHashChanged');
  assert(result.assets.every(asset => asset.url.includes(`/releases/${value.packageHash}/`)));
  assert(result.assets.every(asset => !asset.url.includes(`/releases/${staleHash}/`)));
});

test('conditional GET accepts 304 with a known complete cached package', async t => {
  const value = manifest();
  const fixture = await server(t, (req, res) => {
    assert.equal(req.headers['if-none-match'], '"manifest-one"');
    res.writeHead(304, { ETag: '"manifest-one"' }); res.end();
  });
  const result = await checkPackage({ manifestURL: `${fixture.url}/manifest.json`,
    cachedManifest: { manifest: value, etag: '"manifest-one"' } });
  assert.equal(result.action, 'reuseCachedPackage');
  assert.equal(result.reason, 'notModified');
  assert.equal(result.packageHash, value.packageHash);
  assert.equal(result.entrypointUrl, `${fixture.url}/releases/${value.packageHash}/index.html`);
  assert.deepEqual(result.assets, []);
});

test('changed response after a conditional GET replaces the cached package', async t => {
  const old = manifest();
  const assets = old.assets.map(asset => asset.path.endsWith('.js') ? { ...asset, sha256: digest('new engine') } : asset);
  const packageHash = inventoryHash(assets);
  const next = manifest({ assets, packageHash, packageBaseUrl: `releases/${packageHash}/`, buildId: 'build-two' });
  const fixture = await server(t, (req, res) => {
    assert.equal(req.headers['if-none-match'], 'W/"old"');
    json(res, next, { ETag: '"new"' });
  });
  const result = await checkPackage({ manifestURL: `${fixture.url}/manifest.json`,
    cachedManifest: { manifest: old, etag: 'W/"old"' } });
  assert.equal(result.action, 'downloadManifestAssets');
  assert.equal(result.packageHash, packageHash);
  assert.equal(result.etag, '"new"');
});

test('a descriptor from another manifest URL does not send its ETag to the new URL', async t => {
  const value = manifest();
  const fixture = await server(t, (req, res) => {
    assert.equal(req.headers['if-none-match'], undefined);
    json(res, value);
  });
  const result = await checkPackage({ manifestURL: `${fixture.url}/new.json`,
    cachedManifest: { manifest: value, manifestURL: `${fixture.url}/old.json`, etag: '"old"' } });
  assert.equal(result.action, 'reuseCachedPackage');
  assert.equal(result.reason, 'packageHashMatches');
});

test('redirected manifests resolve paths against the response URL, including on a later 304', async t => {
  const value = manifest();
  const fixture = await server(t, (req, res) => {
    if (req.url === '/latest.json') { res.writeHead(302, { Location: '/mobile/manifest.json' }); res.end(); }
    else if (req.headers['if-none-match']) { res.writeHead(304, { ETag: '"one"' }); res.end(); }
    else json(res, value, { ETag: '"one"' });
  });
  const first = await checkPackage({ manifestURL: `${fixture.url}/latest.json` });
  assert.equal(first.entrypointUrl, `${fixture.url}/mobile/releases/${value.packageHash}/index.html`);
  const next = await checkPackage({ manifestURL: `${fixture.url}/latest.json`, cachedManifest: first });
  assert.equal(next.reason, 'notModified');
  assert.equal(next.entrypointUrl, first.entrypointUrl);
});

test('relative package URLs resolve at the manifest directory and absolute CDN URLs are supported', () => {
  const value = manifest();
  const nested = validateManifest(value, 'https://example.test/mobile/current.json');
  assert.equal(nested.entrypointUrl, `https://example.test/mobile/releases/${value.packageHash}/index.html`);
  value.packageBaseUrl = `https://cdn.example.test/releases/${value.packageHash}/`;
  assert.equal(validateManifest(value, 'https://example.test/current.json').entrypointUrl,
    `https://cdn.example.test/releases/${value.packageHash}/index.html`);
});

test('inventory hash ignores listing order, buildId, archive, and contentType but detects every asset change', () => {
  const value = manifest();
  assert.equal(inventoryHash([...value.assets].reverse()), value.packageHash);
  assert.equal(inventoryHash(value.assets.map(asset => ({ ...asset, contentType: 'application/octet-stream' }))), value.packageHash);
  for (let i = 0; i < value.assets.length; i++) {
    assert.notEqual(inventoryHash(value.assets.map((asset, index) => index === i ? { ...asset, sha256: digest('changed') } : asset)), value.packageHash);
  }
  validateManifest({ ...value, buildId: 'another-build', archive: { ...value.archive, sha256: digest('another zip') } }, 'https://example.test/manifest.json');
});

test('snapshot capability metadata is optional, validated, and excluded from package identity', () => {
  const value = manifest();
  const url = 'https://example.test/manifest.json';
  assert.equal(validateManifest(value, url).supportedSnapshotFormats, undefined);
  for (const formats of [['base64'], ['gz1', 'gz2'], ['base64', 'gz1', 'gz2']]) {
    const declared = { ...value, supportedSnapshotFormats: formats };
    assert.deepEqual(validateManifest(declared, url).supportedSnapshotFormats, formats);
    assert.equal(inventoryHash(declared.assets), value.packageHash);
  }
  for (const formats of [null, 'gz2', [], ['gz3'], ['base64', 'base64'], [1], ['BASE64'],
    ['base64', 'gz1', 'gz2', 'gz3']]) {
    assert.throws(() => validateManifest({ ...value, supportedSnapshotFormats: formats }, url), /supportedSnapshotFormats/);
  }
});

test('capabilities survive cold GET, same-hash publication and conditional 304 decisions', async t => {
  const value = manifest({ supportedSnapshotFormats: ['base64', 'gz1', 'gz2'] });
  const fixture = await server(t, (req, res) => {
    if (req.headers['if-none-match']) { res.writeHead(304, { ETag: '"capabilities"' }); res.end(); }
    else json(res, value, { ETag: '"capabilities"' });
  });
  const manifestURL = `${fixture.url}/manifest.json`;
  const cold = await checkPackage({ manifestURL });
  const sameHash = await checkPackage({ manifestURL, cachedPackageHash: value.packageHash });
  const warm = await checkPackage({ manifestURL, cachedManifest: cold });
  for (const result of [cold, sameHash, warm]) {
    assert.deepEqual(result.supportedSnapshotFormats, value.supportedSnapshotFormats);
    assert.deepEqual(result.manifest.supportedSnapshotFormats, value.supportedSnapshotFormats);
  }
  assert.equal(sameHash.reason, 'packageHashMatches');
  assert.equal(warm.reason, 'notModified');
});

test('invalid manifests are rejected even when the advertised hash matches the cached hash', async t => {
  const value = manifest();
  value.assets[1].sha256 = digest('tampered inventory');
  const fixture = await server(t, (_req, res) => json(res, value));
  await assert.rejects(checkPackage({ manifestURL: `${fixture.url}/manifest.json`, cachedPackageHash: value.packageHash }), /does not match/);
});

test('schema, file metadata, traversal, duplicate paths, and mismatched release prefix are rejected', () => {
  const cases = [
    [null, /object/], [manifest({ schemaVersion: 2 }), /schemaVersion/],
    [manifest({ packageHash: 'not-sha256' }), /packageHash/],
    [manifest({ assets: [] }), /assets/],
    [manifest({ assets: [{ path: 'index.html', sha256: digest('x'), bytes: -1 }] }), /bytes/],
    [manifest({ assets: [{ path: '../index.html', sha256: digest('x'), bytes: 1 }] }), /traversal/],
    [manifest({ assets: [{ path: '%2e%2e/index.html', sha256: digest('x'), bytes: 1 }] }), /traversal/],
    [manifest({ assets: [{ path: 'index.html', sha256: digest('x'), bytes: 1 }, { path: 'index.html', sha256: digest('x'), bytes: 1 }] }), /Duplicate/],
    [manifest({ entrypoint: 'missing.html' }), /entrypoint/],
    [manifest({ packageBaseUrl: `releases/${'0'.repeat(64)}/` }), /packageBaseUrl/],
    [manifest({ archive: { path: '../package.zip', sha256: digest('x'), bytes: 1 } }), /traversal/]
  ];
  for (const [value, expected] of cases) assert.throws(() => validateManifest(value, 'https://example.test/manifest.json'), expected);
});

test('304 without a conditional cache and conflicting cached hashes fail closed', async t => {
  const fixture = await server(t, (_req, res) => { res.writeHead(304); res.end(); });
  await assert.rejects(checkPackage({ manifestURL: `${fixture.url}/manifest.json` }), /Unexpected 304/);
  await assert.rejects(checkPackage({ manifestURL: `${fixture.url}/manifest.json`, etag: '"x"' }), /require.*cached package/);
  await assert.rejects(checkPackage({ manifestURL: `${fixture.url}/manifest.json`, cachedManifest: manifest(), cachedPackageHash: 'f'.repeat(64) }), /conflicts/);
});

test('HTTP errors, HTML fallbacks, malformed JSON, and oversized responses do not authorize a download', async t => {
  const fixture = await server(t, (req, res) => {
    if (req.url === '/error') { res.writeHead(503); res.end(); }
    else if (req.url === '/html') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<html>'); }
    else if (req.url === '/large') { res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': 3 * 1024 * 1024 }); res.end('{}'); }
    else { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{'); }
  });
  for (const [route, error] of [['error', /503/], ['html', /JSON content type/], ['bad', /not valid JSON/], ['large', /too large/]]) {
    await assert.rejects(checkPackage({ manifestURL: `${fixture.url}/${route}` }), error);
  }
});

test('CLI reads the persisted validated manifest and emits JSON without downloading assets', async t => {
  const value = manifest();
  const fixture = await server(t, (_req, res) => json(res, value));
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-cache-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const cachedFile = path.join(temp, 'cached.json');
  fs.writeFileSync(cachedFile, JSON.stringify({ manifest: value }));
  const { stdout } = await execFileAsync(process.execPath, [path.join(__dirname, 'check-simulator-package.cjs'),
    '--manifestURL', `${fixture.url}/manifest.json`, '--cached-manifest', cachedFile]);
  assert.equal(JSON.parse(stdout).action, 'reuseCachedPackage');
  assert.equal(fixture.requests.length, 1);
});
