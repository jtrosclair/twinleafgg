import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { checkPackage, validateManifest } from '../tools/check-simulator-package.cjs';
import { crc32 } from '../ptcg-play/scripts/package-client-build.cjs';

const DEFAULT_PUBLIC = fileURLToPath(new URL('../ptcg-play/cloudflare-public/', import.meta.url));
const DEFAULT_ORIGIN = 'https://sim-static.prizemap.app';
const MAX_ARCHIVE_BYTES = 256 * 1024 * 1024;
const MAX_RELEASE_BYTES = 512 * 1024 * 1024;
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const manifestName = 'package-manifest.json';

function safePath(name) {
  assert(typeof name === 'string' && name.length && name.length <= 2048
    && !/[\\%?#:\u0000-\u0020\u007f]/.test(name) && !name.startsWith('/')
    && name.split('/').every(part => part && part !== '.' && part !== '..'), `Unsafe ZIP path: ${name}`);
}

function json(bytes, description) {
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new Error(`${description} is not valid UTF-8 JSON`); }
}

function releaseShape(manifest, manifestURL) {
  const valid = validateManifest(manifest, manifestURL);
  assert(valid.archive, 'The published release must provide a verified archive');
  assert(valid.archive.path !== manifestName && !manifest.assets.some(asset => asset.path === manifestName),
    'The package manifest is reserved and cannot appear in the asset inventory');
  assert(valid.archive.bytes <= MAX_ARCHIVE_BYTES, 'Published archive exceeds the retention limit');
  const total = manifest.assets.reduce((sum, asset) => sum + asset.bytes, 0);
  assert(Number.isSafeInteger(total) && total <= MAX_RELEASE_BYTES, 'Published release exceeds the retention limit');
  return valid;
}

/** Parse only the deterministic, non-ZIP64 format emitted by packageClientBuild. */
export function extractReleaseArchive(bytes, manifest) {
  assert(bytes.length === manifest.archive.bytes && sha256(bytes) === manifest.archive.sha256,
    'Published archive SHA-256 or byte length does not match its manifest');
  assert(bytes.length >= 22, 'ZIP end record is missing');
  const end = bytes.length - 22;
  assert(bytes.readUInt32LE(end) === 0x06054b50 && bytes.readUInt16LE(end + 20) === 0,
    'Unsupported ZIP end record or comment');
  assert(bytes.readUInt16LE(end + 4) === 0 && bytes.readUInt16LE(end + 6) === 0,
    'Multi-disk ZIP archives are unsupported');
  const count = bytes.readUInt16LE(end + 10);
  assert(count === bytes.readUInt16LE(end + 8) && count === manifest.assets.length + 1 && count < 65535,
    'ZIP file count does not match the asset inventory');
  const centralSize = bytes.readUInt32LE(end + 12), centralStart = bytes.readUInt32LE(end + 16);
  assert(centralStart + centralSize === end, 'ZIP central directory bounds are invalid');
  const expected = new Map(manifest.assets.map(asset => [asset.path, asset]));
  expected.set(manifestName, { bytes: MAX_MANIFEST_BYTES });
  const records = [], names = new Set();
  let position = centralStart;
  for (let index = 0; index < count; index++) {
    assert(position + 46 <= end && bytes.readUInt32LE(position) === 0x02014b50, 'ZIP central entry is invalid');
    assert(bytes.readUInt16LE(position + 4) === 20 && bytes.readUInt16LE(position + 6) === 20
      && bytes.readUInt16LE(position + 8) === 0x800 && bytes.readUInt16LE(position + 10) === 8,
    'Unsupported ZIP version, flags, encryption, or compression');
    const nameLength = bytes.readUInt16LE(position + 28);
    assert(nameLength > 0 && nameLength <= 2048 && bytes.readUInt16LE(position + 30) === 0
      && bytes.readUInt16LE(position + 32) === 0 && bytes.readUInt16LE(position + 34) === 0
      && bytes.readUInt16LE(position + 36) === 0 && bytes.readUInt32LE(position + 38) === 0,
    'Unsupported ZIP extra fields, comments, attributes, or links');
    assert(position + 46 + nameLength <= end, 'ZIP filename exceeds directory bounds');
    const nameBytes = bytes.subarray(position + 46, position + 46 + nameLength);
    const name = new TextDecoder('utf-8', { fatal: true }).decode(nameBytes);
    safePath(name);
    assert(expected.has(name), `ZIP contains an uninventoried path: ${name}`);
    assert(!names.has(name), `ZIP contains a duplicate path: ${name}`);
    names.add(name);
    const size = bytes.readUInt32LE(position + 24);
    assert(name === manifestName ? size <= MAX_MANIFEST_BYTES : size === expected.get(name).bytes,
      `ZIP expanded size does not match inventory: ${name}`);
    records.push({ name, nameBytes, size, compressed: bytes.readUInt32LE(position + 20),
      checksum: bytes.readUInt32LE(position + 16), offset: bytes.readUInt32LE(position + 42),
      time: bytes.readUInt16LE(position + 12), date: bytes.readUInt16LE(position + 14) });
    position += 46 + nameLength;
  }
  assert(position === end && names.size === expected.size, 'ZIP directory or required files are incomplete');
  const extracted = new Map();
  let localEnd = 0;
  for (const entry of records.sort((a, b) => a.offset - b.offset)) {
    const start = entry.offset;
    assert(start === localEnd && start + 30 <= centralStart && bytes.readUInt32LE(start) === 0x04034b50,
      'ZIP local entries overlap, have gaps, or have an invalid header');
    assert(bytes.readUInt16LE(start + 4) === 20 && bytes.readUInt16LE(start + 6) === 0x800
      && bytes.readUInt16LE(start + 8) === 8 && bytes.readUInt16LE(start + 10) === entry.time
      && bytes.readUInt16LE(start + 12) === entry.date && bytes.readUInt32LE(start + 14) === entry.checksum
      && bytes.readUInt32LE(start + 18) === entry.compressed && bytes.readUInt32LE(start + 22) === entry.size
      && bytes.readUInt16LE(start + 26) === entry.nameBytes.length && bytes.readUInt16LE(start + 28) === 0,
    'ZIP local and central headers disagree');
    const dataStart = start + 30 + entry.nameBytes.length;
    localEnd = dataStart + entry.compressed;
    assert(localEnd <= centralStart && bytes.subarray(start + 30, dataStart).equals(entry.nameBytes),
      'ZIP local filename or payload bounds are invalid');
    const data = inflateRawSync(bytes.subarray(dataStart, localEnd), { maxOutputLength: Math.max(1, entry.size) });
    assert(data.length === entry.size && crc32(data) === entry.checksum, `ZIP checksum/size mismatch: ${entry.name}`);
    const asset = expected.get(entry.name);
    if (entry.name !== manifestName) assert.equal(sha256(data), asset.sha256, `ZIP asset SHA-256 mismatch: ${entry.name}`);
    extracted.set(entry.name, data);
  }
  assert(localEnd === centralStart, 'ZIP has hidden local payloads or an invalid directory offset');
  return extracted;
}

function verifySideManifest(sideBytes, archiveManifest, manifest, manifestURL) {
  const side = json(sideBytes, 'Published package manifest');
  const inside = json(archiveManifest, 'Archived package manifest');
  validateManifest(inside, manifestURL);
  validateManifest(side, manifestURL);
  const expected = { schemaVersion: manifest.schemaVersion, packageHash: manifest.packageHash,
    packageBaseUrl: `/releases/${manifest.packageHash}/`, entrypoint: manifest.entrypoint,
    ...(manifest.supportedSnapshotFormats === undefined ? {} : { supportedSnapshotFormats: manifest.supportedSnapshotFormats }),
    assets: manifest.assets };
  assert.deepEqual(inside, expected, 'Archived package manifest does not match the published inventory');
  assert.deepEqual(side, { ...expected, archive: manifest.archive }, 'Published side manifest does not match its verified archive/inventory');
}

async function download(url, maximum, fetchImpl, timeoutMs, description) {
  const response = await fetchImpl(url, { method: 'GET', cache: 'no-cache', redirect: 'error',
    headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(timeoutMs) });
  assert.equal(response.status, 200, `${description} request returned HTTP ${response.status}`);
  const chunks = [];
  let total = 0;
  for await (const chunk of response.body) {
    total += chunk.byteLength;
    assert(total <= maximum, `${description} exceeds the size limit`);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function diskFiles(directory) {
  const stat = fs.lstatSync(directory);
  assert(stat.isDirectory() && !stat.isSymbolicLink(), 'Release directories must not be links');
  return fs.readdirSync(directory).sort().flatMap(name => {
    const file = path.join(directory, name), item = fs.lstatSync(file);
    assert(!item.isSymbolicLink(), `Release contains a link: ${file}`);
    if (item.isDirectory()) return diskFiles(file);
    assert(item.isFile(), `Release contains an unsupported filesystem entry: ${file}`);
    return [file];
  });
}

function verifyDirectory(directory, manifest, sideBytes, manifestURL) {
  const expected = new Set([...manifest.assets.map(asset => asset.path), manifestName, manifest.archive.path]);
  const actual = diskFiles(directory).map(file => path.relative(directory, file).split(path.sep).join('/'));
  assert.deepEqual(actual.sort(), [...expected].sort(), 'Local release has missing or unadvertised files');
  for (const asset of manifest.assets) {
    const bytes = fs.readFileSync(path.join(directory, asset.path));
    assert(bytes.length === asset.bytes && sha256(bytes) === asset.sha256, `Local release integrity mismatch: ${asset.path}`);
  }
  const archive = fs.readFileSync(path.join(directory, manifest.archive.path));
  const entries = extractReleaseArchive(archive, manifest);
  const localSide = fs.readFileSync(path.join(directory, manifestName));
  assert(localSide.equals(sideBytes), 'Local package manifest differs from the published immutable bytes');
  verifySideManifest(sideBytes, entries.get(manifestName), manifest, manifestURL);
}

export async function retainPreviousRelease({ publicDirectory = DEFAULT_PUBLIC, origin = DEFAULT_ORIGIN,
  allowEmpty = false, fetchImpl = fetch, timeoutMs = 60000 } = {}) {
  publicDirectory = path.resolve(publicDirectory);
  const base = new URL(origin);
  assert(['https:', 'http:'].includes(base.protocol) && !base.username && !base.password
    && base.pathname === '/' && !base.search && !base.hash, 'origin must be an HTTP(S) origin');
  assert(Number.isSafeInteger(timeoutMs) && timeoutMs > 0, 'timeoutMs must be a positive integer');
  const manifestURL = new URL('simulator-manifest.json', base).href;
  const next = json(fs.readFileSync(path.join(publicDirectory, 'simulator-manifest.json')), 'Local deployment manifest');
  releaseShape(next, manifestURL);
  let checked, status;
  try {
    checked = await checkPackage({ manifestURL, timeoutMs,
      fetchImpl: async (...args) => { const response = await fetchImpl(...args); status = response.status; return response; } });
  } catch (failure) {
    if (allowEmpty && status === 404) return { action: 'noPreviousRelease', reason: 'explicitFirstDeployment404', nextPackageHash: next.packageHash };
    throw failure;
  }
  const previous = checked.manifest;
  const valid = releaseShape(previous, manifestURL);
  const release = path.join(publicDirectory, 'releases', previous.packageHash);
  const sideBytes = await download(new URL(manifestName, valid.packageBaseUrl).href,
    MAX_MANIFEST_BYTES, fetchImpl, timeoutMs, 'Published package manifest');
  if (fs.existsSync(release)) {
    verifyDirectory(release, previous, sideBytes, manifestURL);
    return { action: previous.packageHash === next.packageHash ? 'currentReleaseAlreadyPublished' : 'previousReleaseAlreadyRetained',
      nextPackageHash: next.packageHash, previousPackageHash: previous.packageHash, verifiedAssets: previous.assets.length,
      archiveVerified: true, immutableFilesUnchanged: true };
  }
  assert(previous.packageHash !== next.packageHash, 'The locally generated current release is missing');
  const archive = await download(valid.archive.url, valid.archive.bytes, fetchImpl, timeoutMs, 'Published release archive');
  const entries = extractReleaseArchive(archive, previous);
  verifySideManifest(sideBytes, entries.get(manifestName), previous, manifestURL);
  const releases = path.join(publicDirectory, 'releases');
  fs.mkdirSync(releases, { recursive: true });
  assert(!fs.lstatSync(releases).isSymbolicLink(), 'The releases directory must not be a link');
  const staging = fs.mkdtempSync(path.join(publicDirectory, '.staging-retain-'));
  try {
    for (const asset of previous.assets) {
      const file = path.join(staging, asset.path);
      fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, entries.get(asset.path));
    }
    fs.writeFileSync(path.join(staging, manifestName), sideBytes);
    fs.writeFileSync(path.join(staging, previous.archive.path), archive);
    verifyDirectory(staging, previous, sideBytes, manifestURL);
    // Another deploy process may have retained it while the download was in flight.
    if (fs.existsSync(release)) verifyDirectory(release, previous, sideBytes, manifestURL);
    else fs.renameSync(staging, release);
  } finally { fs.rmSync(staging, { recursive: true, force: true }); }
  return { action: 'previousReleaseRestored', nextPackageHash: next.packageHash,
    previousPackageHash: previous.packageHash, verifiedAssets: previous.assets.length,
    archiveVerified: true, archiveBytes: archive.length, atomic: true };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href) {
  try {
    const options = {};
    const names = { '--public-dir': 'publicDirectory', '--origin': 'origin', '--timeout-ms': 'timeoutMs' };
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index++) {
      if (args[index] === '--allow-empty') { options.allowEmpty = true; continue; }
      const name = names[args[index]];
      assert(name && args[index + 1], `Unknown or incomplete option: ${args[index]}`);
      options[name] = name === 'timeoutMs' ? Number(args[++index]) : args[++index];
    }
    console.log(JSON.stringify(await retainPreviousRelease(options), null, 2));
  } catch (failure) { console.error(failure.message); process.exitCode = 1; }
}
