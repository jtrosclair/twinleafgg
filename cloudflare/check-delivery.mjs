import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { checkPackage } from '../tools/check-simulator-package.cjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const assertCors = response => assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
const immutable = response => {
  assert.match(response.headers.get('Cache-Control') || '', /max-age=31536000/);
  assert.match(response.headers.get('Cache-Control') || '', /immutable/);
  assertCors(response);
};
const get = (url, init = {}) => fetch(url, { signal: AbortSignal.timeout(60000), ...init });

export async function verifyDelivery(origin) {
  const base = new URL(origin);
  assert(['http:', 'https:'].includes(base.protocol) && !base.username && !base.password
    && base.pathname === '/' && !base.search && !base.hash, 'origin must be an HTTP(S) origin');
  const manifestURL = new URL('simulator-manifest.json', base).href;
  const cold = await checkPackage({ manifestURL });
  assert.equal(cold.action, 'downloadManifestAssets');
  const warm = await checkPackage({ manifestURL, cachedManifest: cold });
  assert.equal(warm.action, 'reuseCachedPackage');
  assert.equal(warm.reason, 'notModified');
  assert.equal(warm.packageHash, cold.packageHash);
  // Static asset delivery owns this route. Its ETag is an opaque validator,
  // independent from the package/content digests inside the manifest.
  const manifestResponse = await get(manifestURL, { headers: { 'Accept-Encoding': 'identity' } });
  assert.equal(manifestResponse.status, 200);
  assert.match(manifestResponse.headers.get('Cache-Control') || '', /\bno-cache\b/);
  assertCors(manifestResponse);
  const exposed = (manifestResponse.headers.get('Access-Control-Expose-Headers') || '').toLowerCase().split(',').map(value => value.trim());
  assert(exposed.includes('etag') && exposed.includes('content-length'));
  const manifestEtag = manifestResponse.headers.get('ETag');
  assert.match(manifestEtag || '', /^(?:W\/)?"[^"\r\n]+"$/);
  const manifestBytes = new Uint8Array(await manifestResponse.arrayBuffer());
  assert.deepEqual(JSON.parse(new TextDecoder().decode(manifestBytes)), cold.manifest);
  const conditional = await get(manifestURL, { headers: { 'Accept-Encoding': 'identity', 'If-None-Match': manifestEtag } });
  assert.equal(conditional.status, 304);
  assert.equal((await conditional.arrayBuffer()).byteLength, 0);
  assert.match(conditional.headers.get('Cache-Control') || '', /\bno-cache\b/);
  assert.equal(conditional.headers.get('ETag'), manifestEtag);
  assertCors(conditional);
  const manifestHead = await get(manifestURL, { method: 'HEAD', headers: { 'Accept-Encoding': 'identity' } });
  assert.equal(manifestHead.status, 200);
  assert.equal((await manifestHead.arrayBuffer()).byteLength, 0);
  const headContentLength = manifestHead.headers.get('Content-Length');
  if (headContentLength !== null) assert.equal(headContentLength, String(manifestBytes.length));
  assert.equal(manifestHead.headers.get('ETag'), manifestEtag);
  assert.match(manifestHead.headers.get('Cache-Control') || '', /\bno-cache\b/);
  assertCors(manifestHead);
  const verifiedAssets = [];
  let canonicalIndex;
  for (let offset = 0; offset < cold.assets.length; offset += 2) {
    const batch = await Promise.all(cold.assets.slice(offset, offset + 2).map(async asset => {
      const response = await get(asset.url);
      assert.equal(response.status, 200, asset.path);
      immutable(response);
      if (asset.path === cold.manifest.entrypoint) {
        assert.match(response.headers.get('Cache-Control'), /no-transform/);
      }
      const bytes = new Uint8Array(await response.arrayBuffer());
      assert.equal(bytes.length, asset.bytes, `${asset.path} byte length`);
      assert.equal(sha256(bytes), asset.sha256, `${asset.path} digest`);
      if (asset.path === cold.manifest.entrypoint) canonicalIndex = new TextDecoder().decode(bytes);
      return { path: asset.path, bytes: bytes.length, integrity: true, immutable: true, cors: true };
    }));
    verifiedAssets.push(...batch);
  }
  let archive;
  if (cold.archive) {
    const response = await get(cold.archive.url);
    assert.equal(response.status, 200, 'archive status');
    immutable(response);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.equal(bytes.length, cold.archive.bytes, 'archive byte length');
    assert.equal(sha256(bytes), cold.archive.sha256, 'archive digest');
    archive = { path: cold.archive.path, bytes: bytes.length, integrity: true, immutable: true, cors: true };
  }
  const routes = [];
  assert(canonicalIndex, 'The canonical release HTML must be inventoried');
  const stableIndex = canonicalIndex.replace(/(<base\b[^>]*\bhref\s*=\s*)(["'])[^"']*\2/i,
    (_match, prefix, quote) => `${prefix}${quote}/releases/${cold.packageHash}/${quote}`);
  for (const pathname of ['/', '/index.html', '/sandbox-viewer', '/table/12']) {
    const url = new URL(`${pathname}?theme=dark#snapshot+bytes=`, base);
    const response = await get(url, { redirect: 'manual' });
    assert.equal(response.status, 200, pathname);
    assert.equal(response.headers.get('Location'), null, 'Public routes must not redirect to a package hash');
    assert.equal(response.redirected, false);
    assert.equal(response.headers.get('Cache-Control'), 'no-store, no-transform');
    assert.equal(response.headers.get('X-Simulator-Package-Hash'), cold.packageHash);
    if (cold.buildId) assert.equal(response.headers.get('X-Simulator-Build-Id'), cold.buildId);
    assert.equal(await response.text(), stableIndex, 'Only the mutable facade base URL may differ from canonical HTML');
    assertCors(response);
    routes.push({ path: pathname, status: response.status, stableUrl: true, noRedirect: true,
      noStore: true, internalAssetsPinned: true });
  }
  const index = cold.manifest.assets.find(asset => asset.path === cold.manifest.entrypoint);
  for (const route of ['sandbox-viewer', 'table/12']) {
    const response = await get(new URL(route, cold.packageBaseUrl));
    assert.equal(response.status, 200);
    immutable(response);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.equal(sha256(bytes), index.sha256, 'SPA fallback must preserve exact release index bytes');
    routes.push({ path: `/releases/<packageHash>/${route}`, status: response.status, exactIndexBytes: true });
  }
  for (const pathname of [`/releases/${'f'.repeat(64)}/sandbox-viewer`,
    `/releases/${cold.packageHash}/__missing__.js`, `/releases/${cold.packageHash}/table/__missing__.js`]) {
    const response = await get(new URL(pathname, base), { redirect: 'manual' });
    assert.equal(response.status, 404, pathname);
    assert.match(response.headers.get('Content-Type') || '', /^text\/plain/);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(response.headers.get('Location'), null);
    assertCors(response);
    routes.push({ path: pathname.replace(cold.packageHash, '<packageHash>'), status: 404, noFallback: true });
  }
  const imageURL = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_001_R_EN.png';
  const query = `?url=${encodeURIComponent(imageURL)}`;
  const scan = await get(new URL(`/card-images${query}`, base));
  assert.equal(scan.status, 200, 'real scan proxy status');
  assert.equal(scan.headers.get('Content-Type'), 'image/png');
  assert.equal(scan.headers.get('Cache-Control'), 'public, max-age=86400');
  assert.equal(scan.headers.get('Set-Cookie'), null);
  assertCors(scan);
  const scanBytes = new Uint8Array(await scan.arrayBuffer());
  assert.deepEqual([...scanBytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(scanBytes.length, Number(scan.headers.get('Content-Length')));
  assert.equal(scan.headers.get('ETag'), `"${sha256(scanBytes)}"`);
  const cachedScan = await get(new URL(`card-images${query}`, cold.packageBaseUrl), {
    headers: { 'If-None-Match': scan.headers.get('ETag') }
  });
  assert.equal(cachedScan.status, 304, 'versioned scan conditional status');
  assertCors(cachedScan);
  const rejected = await get(new URL('/card-images?url=https%3A%2F%2Fexample.com%2Fimage.png', base));
  assert.equal(rejected.status, 400);
  assertCors(rejected);
  return { ok: true, checkedAt: new Date().toISOString(), origin: base.origin,
    packageHash: cold.packageHash, buildId: cold.buildId,
    manifest: { cold: cold.action, warm: warm.action, conditionalStatus: 304, inventoryValidated: true,
      status: 200, bytes: manifestBytes.length, sha256: sha256(manifestBytes), etag: manifestEtag,
      noCache: true, cors: true, exposesEtag: true, conditionalBodyBytes: 0,
      headStatus: 200, headBodyBytes: 0, headContentLength: headContentLength === null ? null : Number(headContentLength) },
    assets: verifiedAssets, ...(archive ? { archive } : {}), routes,
    imageProxy: { source: imageURL, status: scan.status, bytes: scanBytes.length,
      type: 'image/png', cors: true, cacheTtlSeconds: 86400, versionedConditionalStatus: 304,
      rejectedHostStatus: rejected.status } };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href) {
  try {
    const args = process.argv.slice(2);
    const values = {};
    for (let i = 0; i < args.length; i += 2) {
      assert(['--origin', '--output'].includes(args[i]) && args[i + 1], `Invalid option: ${args[i]}`);
      values[args[i]] = args[i + 1];
    }
    assert(values['--origin'], 'Usage: node cloudflare/check-delivery.mjs --origin <url> [--output <results.json>]');
    const result = await verifyDelivery(values['--origin']);
    const output = `${JSON.stringify(result, null, 2)}\n`;
    if (values['--output']) fs.writeFileSync(values['--output'], output);
    process.stdout.write(output);
  } catch (failure) { console.error(failure); process.exitCode = 1; }
}
