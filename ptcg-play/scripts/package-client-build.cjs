#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { filesIn, collectResources } = require('./static-resources.cjs');
const { inventoryHash } = require('../../tools/check-simulator-package.cjs');

// Transport support is release metadata, not a change to inventory hashing.
// The matching finalized HTML marker binds this declaration to immutable bytes.
const SUPPORTED_SNAPSHOT_FORMATS = Object.freeze(['base64', 'gz1', 'gz2']);
const SNAPSHOT_FORMATS_META = `<meta name="prizemap-supported-snapshot-formats" content="${SUPPORTED_SNAPSHOT_FORMATS.join(',')}">`;

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.png': 'image/png',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const comparePath = (a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0;

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

/** Deterministic, standard ZIP: sorted UTF-8 paths, fixed date, no extra fields. */
function zipFiles(files) {
  const localParts = [], directoryParts = [];
  let offset = 0, directorySize = 0;
  for (const file of [...files].sort(comparePath)) {
    const name = Buffer.from(file.path), data = file.data;
    const compressed = zlib.deflateRawSync(data, { level: 9 });
    const checksum = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50); local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x800, 6); local.writeUInt16LE(8, 8); local.writeUInt16LE(33, 12);
    local.writeUInt32LE(checksum, 14); local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22); local.writeUInt16LE(name.length, 26);
    localParts.push(local, name, compressed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10); central.writeUInt16LE(33, 14);
    central.writeUInt32LE(checksum, 16); central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24); central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    directoryParts.push(central, name);
    offset += local.length + name.length + compressed.length;
    directorySize += central.length + name.length;
  }
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(directorySize, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, ...directoryParts, end]);
}

function packageClientBuild({ root = path.resolve(__dirname, '../dist/ptcg-play'),
  destination = path.resolve(__dirname, '../cloudflare-public'), buildId = crypto.randomUUID(),
  builtAt = new Date().toISOString() } = {}) {
  root = path.resolve(root); destination = path.resolve(destination);
  if (destination === root || destination.startsWith(root + path.sep)) {
    throw new Error('Package destination must be outside the Angular build directory.');
  }
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  if (!/<base\s+href=["']\.\/["']/.test(index)) throw new Error('The release requires <base href="./">.');
  if (/src=["']simulator-static\.js["']/.test(index)) throw new Error('Finalize the client before packaging it.');
  if (!index.includes(SNAPSHOT_FORMATS_META)) throw new Error('Finalize the snapshot format metadata before packaging it.');
  const resources = collectResources(root);
  const direct = new Set(['index.html']);
  for (const match of index.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const name = match[1];
    if (name !== './' && !/^(?:[a-z]+:|\/\/|#)/i.test(name)) direct.add(name.replace(/^\.\//, ''));
  }
  // The bootstrap already carries images/fonts, settings and translations. Do
  // not make native clients download a second copy of those source files.
  const files = filesIn(root).map(file => ({ path: path.relative(root, file).split(path.sep).join('/'), file }))
    .filter(({ path: name }) => !/\.map$/.test(name) && name !== 'simulator-manifest.json'
      && !/^simulator-package\./.test(name) && !/^\./.test(name)
      && (direct.has(name) || (!resources.urls[name] && !Object.hasOwn(resources.json, name)
        && !/^simulator-static(?:\.|$)/.test(name))))
    .map(({ path: name, file }) => ({ path: name, data: fs.readFileSync(file) }))
    .sort(comparePath);
  const selected = new Set(files.map(file => file.path));
  for (const name of direct) {
    if (!selected.has(name)) throw new Error(`Entrypoint references a missing release file: ${name}`);
  }
  if (!files.some(file => /^simulator-static\.[a-f0-9]+\.js$/.test(file.path))) {
    throw new Error('The finalized presentation bootstrap is missing.');
  }
  const assets = files.map(({ path: name, data }) => ({ path: name, sha256: sha256(data), bytes: data.length,
    contentType: TYPES[path.extname(name)] || 'application/octet-stream' }));
  const packageHash = inventoryHash(assets);
  const stableManifest = { schemaVersion: 1, packageHash, packageBaseUrl: `releases/${packageHash}/`,
    entrypoint: 'index.html', supportedSnapshotFormats: [...SUPPORTED_SNAPSHOT_FORMATS], assets };
  const releaseManifest = { ...stableManifest, packageBaseUrl: `/releases/${packageHash}/` };
  const archiveData = zipFiles([...files, { path: 'package-manifest.json',
    data: Buffer.from(JSON.stringify(releaseManifest, null, 2) + '\n') }]);
  const archive = { path: `simulator-package.${packageHash}.zip`, sha256: sha256(archiveData), bytes: archiveData.length };
  const manifest = { ...stableManifest, buildId, builtAt, archive };
  const release = path.join(destination, 'releases', packageHash);
  fs.mkdirSync(path.dirname(release), { recursive: true });
  const staging = fs.mkdtempSync(path.join(destination, '.staging-'));
  try {
    for (const file of [...files, { path: archive.path, data: archiveData },
      { path: 'package-manifest.json', data: Buffer.from(JSON.stringify({ ...releaseManifest, archive }, null, 2) + '\n') }]) {
      const target = path.join(staging, file.path);
      fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, file.data);
    }
    if (fs.existsSync(release)) {
      // An immutable URL must never acquire different bytes, even on rebuild.
      for (const file of filesIn(staging)) {
        const previous = path.join(release, path.relative(staging, file));
        if (!fs.existsSync(previous) || !fs.readFileSync(file).equals(fs.readFileSync(previous))) {
          throw new Error('An existing immutable release has different bytes.');
        }
      }
    } else { fs.renameSync(staging, release); }
  } finally { fs.rmSync(staging, { recursive: true, force: true }); }
  const manifestFile = path.join(destination, 'simulator-manifest.json');
  const pending = path.join(destination, `.manifest-${crypto.randomUUID()}.tmp`);
  fs.writeFileSync(pending, JSON.stringify(manifest, null, 2) + '\n'); fs.renameSync(pending, manifestFile);
  fs.writeFileSync(path.join(destination, '_headers'), `/releases/*\n  Cache-Control: public, max-age=31536000, immutable\n  Access-Control-Allow-Origin: *\n  Access-Control-Expose-Headers: ETag, Content-Length\n  X-Content-Type-Options: nosniff\n\n/simulator-manifest.json\n  Cache-Control: no-cache\n  Access-Control-Allow-Origin: *\n  Access-Control-Expose-Headers: ETag, Content-Length\n`);
  fs.writeFileSync(path.join(destination, '.assetsignore'), '.staging-*\n.manifest-*\n');
  console.log(`Simulator package: ${packageHash} (${assets.length} files; ${(archive.bytes / 1048576).toFixed(2)} MiB ZIP; build ${buildId})`);
  return manifest;
}

if (require.main === module) { packageClientBuild(); }
module.exports = { packageClientBuild, zipFiles, crc32, SUPPORTED_SNAPSHOT_FORMATS, SNAPSHOT_FORMATS_META };
