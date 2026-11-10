import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { packageClientBuild, SNAPSHOT_FORMATS_META } from '../ptcg-play/scripts/package-client-build.cjs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { createWorker } from './worker.mjs';

const HASH = 'a'.repeat(64);
const OLD_HASH = 'b'.repeat(64);
const BASE = `https://sim.example/releases/${HASH}`;
const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]);
const IMAGE = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_001_R_EN.png';
const manifest = { schemaVersion: 1, packageHash: HASH, packageBaseUrl: `releases/${HASH}/`,
  entrypoint: 'index.html', buildId: 'first-build', assets: [] };
const shell = '<!doctype html><base href="./"><script src="main.123.js"></script>';
const hash = value => createHash('sha256').update(value).digest('hex');
const req = (url, init) => new Request(new URL(url, 'https://sim.example'), init);
const proxy = (url = IMAGE, prefix = '') => `${prefix}/card-images?url=${encodeURIComponent(url)}`;

function assets(extra = {}) {
  const calls = [];
  const files = new Map([
    ['/simulator-manifest.json', { body: JSON.stringify(manifest), type: 'application/json' }],
    [`/releases/${HASH}/index.html`, { body: shell, type: 'text/html' }],
    [`/releases/${HASH}/main.123.js`, { body: 'play()', type: 'application/javascript' }],
    ...Object.entries(extra)
  ]);
  return { calls, files, env: { ASSETS: { async fetch(request) {
    calls.push({ path: new URL(request.url).pathname, method: request.method, headers: request.headers });
    const file = files.get(new URL(request.url).pathname);
    if (!file) return new Response('Asset missing', { status: 404 });
    return new Response(file.body, { status: file.status || 200, headers: {
      'Content-Type': file.type, ETag: '"static-binding-tag"', 'Cache-Control': 'max-age=0', ...file.headers
    } });
  } } } };
}

function memoryCache() {
  const values = new Map();
  const writes = [];
  return { values, writes, async match(request) { return values.get(request.url)?.clone(); },
    async put(request, response) { writes.push(request.url); values.set(request.url, response.clone()); } };
}

function imageWorker(options = {}) {
  const calls = [];
  const cache = memoryCache();
  return { calls, cache, worker: createWorker({ cache,
    fetchImage: async (url, init) => {
      calls.push({ url, init });
      return new Response(PNG, { headers: { 'Content-Type': 'image/png',
        'Content-Length': String(PNG.length), 'Set-Cookie': 'secret=value',
        'Content-Encoding': 'gzip', Server: 'origin', 'Access-Control-Allow-Origin': 'https://other.example' } });
    }, ...options }) };
}

function assertCors(response) {
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
}

test('Wrangler keeps ordinary static assets first and disables implicit HTML handling', () => {
  const config = JSON.parse(fs.readFileSync(new URL('./wrangler.jsonc', import.meta.url)));
  assert.equal(config.name, 'prizemap-simulator-assets');
  assert.equal(config.compatibility_date, '2026-10-30');
  assert.equal(config.assets.directory, '../ptcg-play/cloudflare-public');
  assert.equal(config.assets.binding, 'ASSETS');
  assert.equal(config.assets.html_handling, 'none');
  assert.equal(config.assets.not_found_handling, 'none');
  assert(Array.isArray(config.assets.run_worker_first));
  for (const pattern of config.assets.run_worker_first) {
    const expression = new RegExp('^' + pattern.split('*')
      .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    assert(!expression.test('/simulator-manifest.json'), 'The manifest must be served directly by static assets');
  }
  assert(config.assets.run_worker_first.includes('/releases/*/card-images'));
  assert(config.assets.run_worker_first.includes('/releases/*/index.html'));
  assert(!config.assets.run_worker_first.includes('/releases/*'));
});

test('generated static manifest headers retain native revalidation and cross-origin ETag access', t => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-static-manifest-'));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  const root = path.join(temporary, 'dist'), destination = path.join(temporary, 'public');
  fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, 'index.html'), SNAPSHOT_FORMATS_META + '<base href="./"><script src="simulator-static.abcdef.js"></script>');
  fs.writeFileSync(path.join(root, 'simulator-static.abcdef.js'), 'globalThis.__SIMULATOR_STATIC__={};');
  packageClientBuild({ root, destination });
  const rules = fs.readFileSync(path.join(destination, '_headers'), 'utf8');
  const block = rules.split(/\n\s*\n/).find(value => value.startsWith('/simulator-manifest.json\n'));
  assert(block, 'The mutable manifest needs its own static header rule');
  const headers = new Headers(block.split('\n').slice(1).filter(Boolean).map(line => {
    const separator = line.indexOf(':');
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  }));
  assert.equal(headers.get('Cache-Control'), 'no-cache');
  assert.equal(headers.get('Access-Control-Allow-Origin'), '*');
  assert(headers.get('Access-Control-Expose-Headers').split(',').some(value => value.trim().toLowerCase() === 'etag'));
  assert(headers.get('Access-Control-Expose-Headers').split(',').some(value => value.trim().toLowerCase() === 'content-length'));
  assert(!/immutable|max-age/.test(headers.get('Cache-Control')));
});

test('public entrypoints serve latest HTML in place with an internal release base and no-store', async () => {
  const fixture = assets();
  const worker = createWorker();
  for (const path of ['/', '/index.html', '/sandbox-viewer', '/sandbox-viewer/', '/table/12']) {
    const response = await worker.fetch(req(`${path}?theme=dark#snapshot+bytes=`), fixture.env);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Location'), null, 'No HTTP redirect can replace the public URL or snapshot fragment');
    assert.equal(response.headers.get('Cache-Control'), 'no-store, no-transform');
    assert.equal(response.headers.get('X-Simulator-Package-Hash'), HASH);
    assert.equal(response.headers.get('X-Simulator-Build-Id'), 'first-build');
    const body = await response.text();
    assert.equal(body, shell.replace('href="./"', `href="/releases/${HASH}/"`));
    assert.equal(response.headers.get('Content-Length'), String(Buffer.byteLength(body)));
    assert.equal(fixture.files.get(`/releases/${HASH}/index.html`).body, shell, 'Canonical index bytes are unchanged');
    assertCors(response);
  }
  assert(fixture.calls.every(call => ['/simulator-manifest.json', `/releases/${HASH}/index.html`].includes(call.path)));
});

test('public HTML never returns an asset-cache 304 or propagates its immutable ETag', async () => {
  const fixture = assets();
  const worker = createWorker();
  for (const tag of ['"static-binding-tag"', '*', 'W/"old-page"']) {
    const response = await worker.fetch(req('/sandbox-viewer', { headers: {
      'If-None-Match': tag, Cookie: 'private=value', Range: 'bytes=1-2'
    } }), fixture.env);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('ETag'), null);
    assert.equal(response.headers.get('Cache-Control'), 'no-store, no-transform');
    assert.match(await response.text(), new RegExp(`/releases/${HASH}/`));
  }
  assert(fixture.calls.every(call => !call.headers.has('If-None-Match') && !call.headers.has('Cookie') && !call.headers.has('Range')));
});

test('changed manifests immediately select new public HTML while old versioned HTML remains pinned', async () => {
  const nextHash = 'c'.repeat(64);
  const fixture = assets({ [`/releases/${nextHash}/index.html`]: { body: shell.replace('main.123.js', 'main.next.js'), type: 'text/html' } });
  const worker = createWorker();
  const first = await worker.fetch(req('/table/12'), fixture.env);
  assert.equal(first.headers.get('X-Simulator-Package-Hash'), HASH);
  fixture.files.get('/simulator-manifest.json').body = JSON.stringify({ ...manifest,
    packageHash: nextHash, packageBaseUrl: `releases/${nextHash}/`, buildId: 'next-build' });
  const current = await worker.fetch(req('/table/12'), fixture.env);
  assert.equal(current.status, 200);
  assert.equal(current.headers.get('Location'), null);
  assert.equal(current.headers.get('X-Simulator-Package-Hash'), nextHash);
  assert.equal(current.headers.get('X-Simulator-Build-Id'), 'next-build');
  assert.equal(await current.text(), shell.replace('main.123.js', 'main.next.js').replace('href="./"', `href="/releases/${nextHash}/"`));
  const pinned = await worker.fetch(req(`${BASE}/table/12`), fixture.env);
  assert.equal(await pinned.text(), shell);
  assert.equal(pinned.headers.get('Cache-Control'), 'public, max-age=31536000, immutable, no-transform');
});

test('a deployment with identical package bytes refreshes the public build header without changing its base', async () => {
  const fixture = assets();
  const worker = createWorker();
  const before = await worker.fetch(req('/'), fixture.env);
  fixture.files.get('/simulator-manifest.json').body = JSON.stringify({ ...manifest, buildId: 'new-deployment' });
  const after = await worker.fetch(req('/'), fixture.env);
  assert.equal(after.headers.get('X-Simulator-Package-Hash'), before.headers.get('X-Simulator-Package-Hash'));
  assert.notEqual(after.headers.get('X-Simulator-Build-Id'), before.headers.get('X-Simulator-Build-Id'));
  assert.equal(await after.text(), await before.text());
});

test('missing selected HTML or an invalid base fails closed without substituting an older release', async () => {
  for (const body of [undefined, '<!doctype html><script src="main.js"></script>', '<base href="./"><base href="./">']) {
    const fixture = assets();
    if (body === undefined) fixture.files.delete(`/releases/${HASH}/index.html`);
    else fixture.files.get(`/releases/${HASH}/index.html`).body = body;
    const response = await createWorker().fetch(req('/sandbox-viewer'), fixture.env);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(response.headers.get('Location'), null);
    assertCors(response);
  }
});

test('versioned SPA fallback serves exactly its own index bytes without consulting latest', async () => {
  const fixture = assets({ [`/releases/${OLD_HASH}/index.html`]: { body: 'old-release', type: 'text/html' } });
  const worker = createWorker();
  for (const path of ['/', '/index.html', '/sandbox-viewer', '/table/old-game']) {
    const response = await worker.fetch(req(`/releases/${OLD_HASH}${path}`), fixture.env);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'old-release');
    assert.equal(response.headers.get('Cache-Control'), 'public, max-age=31536000, immutable, no-transform');
    assertCors(response);
  }
  assert(fixture.calls.every(call => call.path === `/releases/${OLD_HASH}/index.html`));
  const script = await worker.fetch(req(`${BASE}/main.123.js`), fixture.env);
  assert.equal(script.headers.get('Cache-Control'), 'public, max-age=31536000, immutable',
    'Only HTML disables edge transforms; large scripts remain compressible');
});

test('a missing old release never loads the latest release or redirects to it', async () => {
  const fixture = assets();
  const response = await createWorker().fetch(req(`/releases/${OLD_HASH}/sandbox-viewer`), fixture.env);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('Location'), null);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(fixture.calls.map(call => call.path), [`/releases/${OLD_HASH}/index.html`]);
  assertCors(response);
});

test('an asset binding failure has explicit CORS and is never marked immutable', async () => {
  for (const fail of [async () => { throw new Error('unavailable'); }, async () => new Response('failed', { status: 500 })]) {
    const response = await createWorker().fetch(req(`${BASE}/sandbox-viewer`), { ASSETS: { fetch: fail } });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assertCors(response);
  }
});

test('missing JS and unknown routes remain 404 responses rather than an HTML shell', async () => {
  const fixture = assets();
  for (const path of [`${BASE}/missing.js`, `${BASE}/table/missing.js`, `${BASE}/other-route`, '/other-route', '/table/missing.js']) {
    const response = await createWorker().fetch(req(path), fixture.env);
    assert.equal(response.status, 404, path);
    assert.match(response.headers.get('Content-Type'), /^text\/plain/);
    assert(!(await response.text()).includes('<script'));
  }
  assert(!fixture.calls.some(call => call.path.endsWith('/index.html')));
});

test('a release directory without trailing slash redirects only within the same release', async () => {
  const fixture = assets();
  const response = await createWorker().fetch(req(`/releases/${OLD_HASH}?x=1#snapshot`), fixture.env);
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('Location'), `/releases/${OLD_HASH}/?x=1`);
  assert.equal(fixture.calls.length, 0);
});

test('Worker fallback manifest response uses body-derived ETag, no-cache, clean CORS, and byte length', async () => {
  const fixture = assets();
  const response = await createWorker().fetch(req('/simulator-manifest.json?ignored=1', { headers: {
    'If-None-Match': '"unrelated-client-tag"', Cookie: 'private=value', Range: 'bytes=1-2'
  } }), fixture.env);
  const body = await response.text();
  assert.equal(body, JSON.stringify(manifest));
  assert.equal(response.headers.get('ETag'), `"${hash(body)}"`);
  assert.equal(response.headers.get('Cache-Control'), 'no-cache');
  assert.equal(response.headers.get('Content-Length'), String(Buffer.byteLength(body)));
  assert.equal(response.headers.get('Access-Control-Expose-Headers'), 'ETag, Content-Length');
  assert.equal(fixture.calls[0].headers.get('If-None-Match'), null);
  assert.equal(fixture.calls[0].headers.get('Cookie'), null);
  assert.equal(fixture.calls[0].headers.get('Range'), null);
  assertCors(response);
});

test('Worker fallback manifest conditional GET accepts weak/list validators and a new build ID changes its ETag', async () => {
  const fixture = assets();
  const worker = createWorker();
  const first = await worker.fetch(req('/simulator-manifest.json'), fixture.env);
  const etag = first.headers.get('ETag');
  for (const value of [etag, `W/${etag}`, `"other", W/${etag}`, '*']) {
    const response = await worker.fetch(req('/simulator-manifest.json', { headers: { 'If-None-Match': value } }), fixture.env);
    assert.equal(response.status, 304);
    assert.equal(await response.text(), '');
    assert.equal(response.headers.get('ETag'), etag);
    assertCors(response);
  }
  fixture.files.get('/simulator-manifest.json').body = JSON.stringify({ ...manifest, buildId: 'second-build' });
  const next = await worker.fetch(req('/simulator-manifest.json', { headers: { 'If-None-Match': etag } }), fixture.env);
  assert.equal(next.status, 200);
  assert.notEqual(next.headers.get('ETag'), etag);
  assert.equal((await next.json()).packageHash, HASH);
});

test('HEAD returns manifest/release headers without a body, and unsupported methods are rejected', async () => {
  const fixture = assets();
  const worker = createWorker();
  for (const path of ['/simulator-manifest.json', '/sandbox-viewer', `${BASE}/sandbox-viewer`]) {
    const response = await worker.fetch(req(path, { method: 'HEAD' }), fixture.env);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), '');
    assertCors(response);
  }
  const rejected = await worker.fetch(req('/simulator-manifest.json', { method: 'POST', body: '{}' }), fixture.env);
  assert.equal(rejected.status, 405);
  assert.equal(rejected.headers.get('Allow'), 'GET, HEAD, OPTIONS');
  assertCors(rejected);
  const preflight = await worker.fetch(req('/card-images', { method: 'OPTIONS' }), fixture.env);
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('Access-Control-Allow-Methods'), 'GET, HEAD, OPTIONS');
  assertCors(preflight);
});

test('missing or malformed deployment manifests fail closed instead of redirecting', async () => {
  for (const body of ['invalid-json', JSON.stringify({ ...manifest, packageHash: 'invalid' }),
    JSON.stringify({ ...manifest, packageBaseUrl: 'https://other.example/' })]) {
    const fixture = assets();
    fixture.files.get('/simulator-manifest.json').body = body;
    for (const path of ['/', '/simulator-manifest.json']) {
      const response = await createWorker().fetch(req(path), fixture.env);
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('Location'), null);
      assert.equal(response.headers.get('Cache-Control'), 'no-store');
      assertCors(response);
    }
  }
});

test('image proxy fetches only the allowed original URL, strips request/origin headers, and caches for a day', async () => {
  const fixture = imageWorker();
  const response = await fixture.worker.fetch(req(proxy(), { headers: {
    Cookie: 'private=value', Authorization: 'Bearer private', Range: 'bytes=0-1'
  } }), {});
  assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), PNG);
  assert.equal(response.headers.get('Content-Type'), 'image/png');
  assert.equal(response.headers.get('Content-Length'), String(PNG.length));
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=86400');
  assert.equal(response.headers.get('ETag'), `"${hash(PNG)}"`);
  for (const name of ['Set-Cookie', 'Content-Encoding', 'Server', 'Location']) assert.equal(response.headers.get(name), null);
  assertCors(response);
  assert.equal(fixture.calls[0].url, IMAGE);
  assert.equal(fixture.calls[0].init.redirect, 'manual');
  assert.deepEqual(Object.keys(fixture.calls[0].init.headers), ['Accept']);
  assert(!fixture.calls[0].init.headers.Accept.includes('avif'));
  assert.equal(fixture.cache.writes.length, 1);
});

test('root and versioned image routes share the same normalized cache, including conditional GET and HEAD', async () => {
  const fixture = imageWorker();
  const first = await fixture.worker.fetch(req(proxy()), {});
  const etag = first.headers.get('ETag');
  for (const prefix of [`/releases/${HASH}`, `/releases/${OLD_HASH}`]) {
    const cached = await fixture.worker.fetch(req(proxy(IMAGE, prefix)), {});
    assert.deepEqual(new Uint8Array(await cached.arrayBuffer()), PNG);
    const notModified = await fixture.worker.fetch(req(proxy(IMAGE, prefix), { headers: { 'If-None-Match': `W/${etag}` } }), {});
    assert.equal(notModified.status, 304);
    assert.equal(await notModified.text(), '');
  }
  const head = await fixture.worker.fetch(req(proxy(), { method: 'HEAD' }), {});
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal(head.headers.get('Content-Length'), String(PNG.length));
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.cache.writes.length, 1);
});

test('both approved image hosts are supported and a default HTTPS port is normalized', async () => {
  const fixture = imageWorker();
  for (const url of ['https://images.pokemontcg.io/sv1/1_hires.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com:443/tpci/file.png']) {
    const response = await fixture.worker.fetch(req(proxy(url)), {});
    assert.equal(response.status, 200);
  }
  assert.equal(fixture.calls.length, 2);
});

test('published Japanese tpc scans are fetched and cached through the pinned release image route', async () => {
  const fixture = imageWorker();
  const japanese = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/M5/M5_75_R_JP.png';
  const response = await fixture.worker.fetch(req(proxy(japanese, `/releases/${HASH}`)), {});
  assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), PNG);
  assert.equal(fixture.calls[0].url, japanese);
  assert.equal(fixture.cache.writes.length, 1);
  const again = await fixture.worker.fetch(req(proxy(japanese)), {});
  assert.equal(again.status, 200);
  assert.equal(fixture.calls.length, 1);
});

test('invalid image origins, paths, credentials, ports, and duplicate parameters never cause an upstream fetch', async () => {
  const fixture = imageWorker();
  const urls = ['http://images.pokemontcg.io/a.png', 'https://images.pokemontcg.io:444/a.png',
    'https://user:pass@images.pokemontcg.io/a.png', 'https://images.pokemontcg.io.evil.test/a.png',
    'https://127.0.0.1/a.png', 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/other/a.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc-other/a.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci-other/a.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/../other/a.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpc/%2f..%2fother/a.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/../other/a.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/%2f..%2fother/a.png',
    'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/%252e%252e/a.png',
    'https://images.pokemontcg.io/a.png#fragment', 'not-a-url'];
  for (const url of urls) {
    const response = await fixture.worker.fetch(req(proxy(url)), {});
    assert.equal(response.status, 400, url);
    assertCors(response);
  }
  for (const url of ['/card-images', '/card-images?url=', `${proxy()}&url=${encodeURIComponent(IMAGE)}`, `${proxy()}&extra=1`]) {
    assert.equal((await fixture.worker.fetch(req(url), {})).status, 400);
  }
  assert.equal(fixture.calls.length, 0);
  assert.equal(fixture.cache.writes.length, 0);
});

test('upstream redirects are not followed and errors are not cached', async () => {
  for (const status of [301, 302, 307, 404, 500]) {
    const fixture = imageWorker({ fetchImage: async (_url, init) => {
      assert.equal(init.redirect, 'manual');
      return new Response(null, { status, headers: { Location: 'https://private.example/' } });
    } });
    const response = await fixture.worker.fetch(req(proxy()), {});
    assert.equal(response.status, status === 404 ? 404 : 502);
    assert.equal(response.headers.get('Location'), null);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(fixture.cache.writes.length, 0);
    assertCors(response);
  }
});

test('image MIME type and magic bytes must agree; HTML, SVG, and mislabeled bytes are rejected', async () => {
  for (const [type, body] of [['text/html', '<html>'], ['image/svg+xml', '<svg/>'], ['image/avif', '\x00\x00\x00\x20ftypavif0000'],
    ['image/png', '<html>'], ['image/jpeg', PNG], ['application/octet-stream', PNG]]) {
    const fixture = imageWorker({ fetchImage: async () => new Response(body, { headers: { 'Content-Type': type } }) });
    const response = await fixture.worker.fetch(req(proxy()), {});
    assert.equal(response.status, 415, type);
    assert.equal(fixture.cache.writes.length, 0);
    assertCors(response);
  }
});

test('supported raster signatures are accepted with clean normalized MIME types', async () => {
  for (const [type, body, normalized] of [
    ['image/jpg', new Uint8Array([255, 216, 255, 1]), 'image/jpeg'],
    ['image/gif', 'GIF89aabc', 'image/gif'],
    ['image/webp', 'RIFF1234WEBPabc', 'image/webp']
  ]) {
    const fixture = imageWorker({ fetchImage: async () => new Response(body, { headers: { 'Content-Type': type } }) });
    const response = await fixture.worker.fetch(req(proxy()), {});
    assert.equal(response.status, 200, type);
    assert.equal(response.headers.get('Content-Type'), normalized);
  }
});

test('declared sizes beyond the actual 8MB limit are rejected before reading or caching the body', async () => {
  let cancelled = false;
  const fixture = imageWorker({ fetchImage: async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(PNG); }, cancel() { cancelled = true; }
  }), { headers: { 'Content-Type': 'image/png', 'Content-Length': String(8 * 1024 * 1024 + 1) } }) });
  assert.equal((await fixture.worker.fetch(req(proxy()), {})).status, 413);
  assert(cancelled);
  assert.equal(fixture.cache.writes.length, 0);
});

test('streamed bodies without Content-Length are bounded and cancelled when they exceed the limit', async () => {
  let cancelled = false;
  const fixture = imageWorker({ maxImageBytes: 16, fetchImage: async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(PNG); controller.enqueue(PNG); }, cancel() { cancelled = true; }
  }), { headers: { 'Content-Type': 'image/png' } }) });
  assert.equal((await fixture.worker.fetch(req(proxy()), {})).status, 413);
  assert(cancelled);
  assert.equal(fixture.cache.writes.length, 0);
});

test('upstream fetch and body-read timeouts return 504 and do not cache partial data', async () => {
  for (const hangingBody of [false, true]) {
    const fixture = imageWorker({ timeoutMs: 5, fetchImage: async () => hangingBody
      ? new Response(new ReadableStream({ start(controller) { controller.enqueue(PNG); } }), { headers: { 'Content-Type': 'image/png' } })
      : new Promise(() => {}) });
    const response = await fixture.worker.fetch(req(proxy()), {});
    assert.equal(response.status, 504);
    assert.equal(fixture.cache.writes.length, 0);
    assertCors(response);
  }
});

test('cache failures do not prevent a valid scan from loading and waitUntil handles background writes', async () => {
  const tasks = [];
  const fixture = imageWorker({ cache: { async match() { throw new Error('cache failed'); },
    async put() { throw new Error('write failed'); } } });
  const response = await fixture.worker.fetch(req(proxy()), {}, { waitUntil(task) { tasks.push(task); } });
  assert.equal(response.status, 200);
  assert.equal(tasks.length, 1);
  await Promise.all(tasks);
});
