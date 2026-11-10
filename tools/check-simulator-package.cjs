#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');

const SHA256 = /^[a-f0-9]{64}$/;
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function relativePath(value, field) {
  assert(typeof value === 'string' && value.length > 0 && value.length <= 2048,
    `${field} must be a nonempty relative path`);
  assert(!/[\\%?#:\u0000-\u0020\u007f]/.test(value) && !value.startsWith('/')
    && value.split('/').every(part => part !== '' && part !== '.' && part !== '..'),
  `${field} must not contain traversal, encoded paths, a query, or a fragment`);
  return value;
}

function inventoryHash(assets) {
  const inventory = assets.map(({ path, sha256, bytes }) => ({ path, sha256, bytes }))
    .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return crypto.createHash('sha256').update(JSON.stringify(inventory)).digest('hex');
}

function httpUrl(value, field, base) {
  let url;
  try { url = new URL(value, base); } catch { throw new Error(`${field} must be a valid HTTP(S) URL`); }
  assert((url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password,
    `${field} must be an HTTP(S) URL without credentials`);
  return url;
}

function validateManifest(manifest, manifestUrl) {
  assert(manifest && typeof manifest === 'object' && !Array.isArray(manifest), 'Manifest must be an object');
  assert(manifest.schemaVersion === 1, 'Unsupported manifest schemaVersion');
  assert(typeof manifest.packageHash === 'string' && SHA256.test(manifest.packageHash),
    'Manifest packageHash must be a lowercase SHA-256 digest');
  if (manifest.buildId !== undefined) {
    assert(typeof manifest.buildId === 'string' && manifest.buildId.length > 0 && manifest.buildId.length <= 256,
      'Manifest buildId must be a nonempty string');
  }
  if (manifest.builtAt !== undefined) {
    assert(typeof manifest.builtAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(manifest.builtAt)
      && Number.isFinite(Date.parse(manifest.builtAt)), 'Manifest builtAt must be an ISO date string');
  }
  if (manifest.supportedSnapshotFormats !== undefined) {
    const formats = manifest.supportedSnapshotFormats;
    assert(Array.isArray(formats) && formats.length > 0 && formats.length <= 3
      && formats.every(format => ['base64', 'gz1', 'gz2'].includes(format))
      && new Set(formats).size === formats.length,
    'Manifest supportedSnapshotFormats must be a nonempty, unique array of base64, gz1, or gz2');
  }
  assert(typeof manifest.packageBaseUrl === 'string', 'Manifest packageBaseUrl must be a string');
  const baseUrl = httpUrl(manifest.packageBaseUrl, 'Manifest packageBaseUrl', manifestUrl);
  assert(baseUrl.pathname.endsWith('/') && !baseUrl.search && !baseUrl.hash,
    'Manifest packageBaseUrl must end in / and have no query or fragment');
  assert(baseUrl.pathname.endsWith(`/releases/${manifest.packageHash}/`),
    'Manifest packageBaseUrl must identify releases/<packageHash>/');
  const entrypoint = relativePath(manifest.entrypoint, 'Manifest entrypoint');
  assert(Array.isArray(manifest.assets) && manifest.assets.length > 0 && manifest.assets.length <= 50000,
    'Manifest assets must be a nonempty array of at most 50000 files');
  const paths = new Set();
  const assets = manifest.assets.map((asset, index) => {
    assert(asset && typeof asset === 'object' && !Array.isArray(asset), `Asset ${index} must be an object`);
    const path = relativePath(asset.path, `Asset ${index} path`);
    assert(!paths.has(path), `Duplicate asset path: ${path}`);
    paths.add(path);
    assert(typeof asset.sha256 === 'string' && SHA256.test(asset.sha256), `Asset ${path} has an invalid sha256`);
    assert(Number.isSafeInteger(asset.bytes) && asset.bytes >= 0, `Asset ${path} has invalid bytes`);
    if (asset.contentType !== undefined) {
      assert(typeof asset.contentType === 'string' && asset.contentType.length > 0
        && asset.contentType.length <= 256 && !/[\r\n]/.test(asset.contentType),
      `Asset ${path} has invalid contentType`);
    }
    return { ...asset, url: new URL(path, baseUrl).href };
  });
  assert(paths.has(entrypoint), 'Manifest entrypoint must be present in assets');
  assert(inventoryHash(assets) === manifest.packageHash,
    'Manifest packageHash does not match its asset inventory');
  let archive;
  if (manifest.archive !== undefined) {
    const value = manifest.archive;
    assert(value && typeof value === 'object' && !Array.isArray(value), 'Manifest archive must be an object');
    const path = relativePath(value.path, 'Manifest archive path');
    assert(!paths.has(path), 'Manifest archive must not be part of the asset inventory');
    assert(typeof value.sha256 === 'string' && SHA256.test(value.sha256), 'Manifest archive has an invalid sha256');
    assert(Number.isSafeInteger(value.bytes) && value.bytes > 0, 'Manifest archive has invalid bytes');
    archive = { path, sha256: value.sha256, bytes: value.bytes, url: new URL(path, baseUrl).href };
  }
  return { packageBaseUrl: baseUrl.href, entrypointUrl: new URL(entrypoint, baseUrl).href, assets,
    ...(manifest.supportedSnapshotFormats === undefined ? {} : { supportedSnapshotFormats: [...manifest.supportedSnapshotFormats] }),
    ...(archive ? { archive } : {}) };
}

async function checkPackage({ manifestURL, cachedPackageHash, cachedManifest, etag, timeoutMs = 15000, fetchImpl = fetch }) {
  const requestedUrl = httpUrl(manifestURL, 'manifestURL');
  let cache;
  if (cachedManifest !== undefined) {
    assert(cachedManifest && typeof cachedManifest === 'object' && !Array.isArray(cachedManifest),
      'Cached manifest must be an object');
    // Accept either the manifest itself or the persisted successful CLI output.
    const manifest = cachedManifest.manifest || cachedManifest;
    const validated = validateManifest(manifest, cachedManifest.resolvedManifestURL || requestedUrl.href);
    assert(!cachedPackageHash || cachedPackageHash === manifest.packageHash,
      'cachedPackageHash conflicts with cached manifest');
    cachedPackageHash = manifest.packageHash;
    // Validators belong to a URL, rather than to the package content hash.
    if (!cachedManifest.manifestURL || cachedManifest.manifestURL === requestedUrl.href) {
      etag = etag || cachedManifest.etag;
    }
    cache = { manifest, ...validated };
  }
  if (cachedPackageHash !== undefined) {
    assert(typeof cachedPackageHash === 'string' && SHA256.test(cachedPackageHash),
      'cachedPackageHash must be a lowercase SHA-256 digest');
  }
  assert(etag === undefined || (typeof etag === 'string' && etag.length <= 1024
    && /^(?:W\/)?"[^"\r\n]*"$/.test(etag)), 'etag must be a quoted HTTP entity tag');
  assert(!etag || cachedPackageHash, 'Conditional checks require the hash of a complete cached package');
  assert(Number.isSafeInteger(timeoutMs) && timeoutMs > 0, 'timeoutMs must be a positive integer');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(requestedUrl.href, {
      method: 'GET', headers: { Accept: 'application/json', ...(etag ? { 'If-None-Match': etag } : {}) },
      cache: 'no-cache', signal: controller.signal
    });
    const receivedEtag = response.headers.get('etag') || undefined;
    const common = { manifestURL: requestedUrl.href,
      resolvedManifestURL: response.url || requestedUrl.href,
      ...(receivedEtag ? { etag: receivedEtag } : {}) };
    if (response.status === 304) {
      assert(etag && cachedPackageHash, 'Unexpected 304 without a conditional cached-package request');
      return { ...common, action: 'reuseCachedPackage', reason: 'notModified',
        packageHash: cachedPackageHash, etag: receivedEtag || etag, assets: [],
        ...(cache ? { manifest: cache.manifest,
          resolvedManifestURL: cachedManifest.resolvedManifestURL || common.resolvedManifestURL,
          packageBaseUrl: cache.packageBaseUrl,
          ...(cache.supportedSnapshotFormats === undefined ? {} : { supportedSnapshotFormats: cache.supportedSnapshotFormats }),
          entrypointUrl: cache.entrypointUrl, ...(cache.archive ? { archive: cache.archive } : {}) } : {}) };
    }
    assert(response.status === 200, `Manifest request returned HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    assert(/^(?:application\/json|application\/[a-z0-9.+-]+\+json)(?:\s*;|$)/i.test(contentType),
      'Manifest response must have a JSON content type');
    const contentLength = response.headers.get('content-length');
    assert(!contentLength || (Number.isSafeInteger(Number(contentLength))
      && Number(contentLength) >= 0 && Number(contentLength) <= MAX_MANIFEST_BYTES), 'Manifest is too large');
    const chunks = [];
    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.length;
      assert(bytes <= MAX_MANIFEST_BYTES, 'Manifest is too large');
      chunks.push(chunk);
    }
    let manifest;
    try { manifest = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { throw new Error('Manifest response is not valid JSON'); }
    const validated = validateManifest(manifest, response.url || requestedUrl.href);
    const reuse = manifest.packageHash === cachedPackageHash;
    return { ...common, action: reuse ? 'reuseCachedPackage' : 'downloadManifestAssets',
      reason: reuse ? 'packageHashMatches' : cachedPackageHash ? 'packageHashChanged' : 'noCachedPackage',
      packageHash: manifest.packageHash, ...(manifest.buildId ? { buildId: manifest.buildId } : {}),
      packageBaseUrl: validated.packageBaseUrl, entrypointUrl: validated.entrypointUrl,
      ...(validated.supportedSnapshotFormats === undefined ? {} : { supportedSnapshotFormats: validated.supportedSnapshotFormats }),
      assets: reuse ? [] : validated.assets, ...(validated.archive ? { archive: validated.archive } : {}), manifest };
  } finally { clearTimeout(timer); }
}

function parseArgs(args) {
  const names = { '--manifestURL': 'manifestURL', '--manifest-url': 'manifestURL',
    '--cachedPackageHash': 'cachedPackageHash', '--cached-package-hash': 'cachedPackageHash',
    '--cached-manifest': 'cachedManifestPath',
    '--etag': 'etag', '--timeout-ms': 'timeoutMs' };
  const result = {};
  for (let i = 0; i < args.length; i++) {
    assert(names[args[i]] && args[i + 1] !== undefined, `Unknown or incomplete option: ${args[i]}`);
    const name = names[args[i]];
    assert(result[name] === undefined, `Duplicate option: ${args[i]}`);
    result[name] = name === 'timeoutMs' ? Number(args[++i]) : args[++i];
  }
  assert(result.manifestURL, 'Usage: node tools/check-simulator-package.cjs --manifestURL <url> [--cachedPackageHash <sha256>] [--cached-manifest <file>] [--etag <quoted-etag>]');
  if (result.cachedManifestPath) {
    result.cachedManifest = JSON.parse(fs.readFileSync(result.cachedManifestPath, 'utf8'));
    delete result.cachedManifestPath;
  }
  return result;
}

if (require.main === module) {
  Promise.resolve().then(() => checkPackage(parseArgs(process.argv.slice(2))))
    .then(result => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`))
    .catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}

module.exports = { inventoryHash, validateManifest, checkPackage, parseArgs };
