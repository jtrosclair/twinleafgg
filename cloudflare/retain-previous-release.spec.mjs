import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { inventoryHash } from '../tools/check-simulator-package.cjs';
import { zipFiles } from '../ptcg-play/scripts/package-client-build.cjs';
import { retainPreviousRelease } from './retain-previous-release.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
function packageData(label, supportedSnapshotFormats) {
  const files = [
    { path: 'index.html', data: Buffer.from('<base href="./"><script src="main.js"></script>') },
    { path: 'main.js', data: Buffer.from(`console.log("${label}");`) },
    { path: 'assets/icons.css', data: Buffer.from('body{color:red}') }
  ].sort((a, b) => a.path < b.path ? -1 : 1);
  const assets = files.map(file => ({ path: file.path, bytes: file.data.length, sha256: digest(file.data) }));
  const packageHash = inventoryHash(assets);
  const stable = { schemaVersion: 1, packageHash, packageBaseUrl: `releases/${packageHash}/`, entrypoint: 'index.html',
    ...(supportedSnapshotFormats === undefined ? {} : { supportedSnapshotFormats }), assets };
  const inside = { ...stable, packageBaseUrl: `/releases/${packageHash}/` };
  return { files, stable, inside,
    records: [...files, { path: 'package-manifest.json', data: Buffer.from(JSON.stringify(inside, null, 2) + '\n') }] };
}

function packed(value, records = value.records, modify = data => data) {
  const zip = modify(zipFiles(records));
  const archive = { path: `simulator-package.${value.stable.packageHash}.zip`, sha256: digest(zip), bytes: zip.length };
  // Deliberately use different formatting from the inside-ZIP manifest and the
  // packager's default. Retention must preserve these exact immutable bytes.
  const side = Buffer.from(JSON.stringify({ ...value.inside, archive }, null, 4) + '\n\n');
  return { ...value, zip, side, manifest: { ...value.stable, buildId: 'deployment-' + value.stable.packageHash.slice(0, 8),
    builtAt: '2026-11-06T12:00:00.000Z', archive } };
}

function writeRelease(directory, value) {
  const release = path.join(directory, 'releases', value.manifest.packageHash);
  for (const file of [...value.files, { path: value.manifest.archive.path, data: value.zip }, { path: 'package-manifest.json', data: value.side }]) {
    const target = path.join(release, file.path);
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, file.data);
  }
  return release;
}

async function fixture(t) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'retain-simulator-'));
  const publicDirectory = path.join(temp, 'public');
  fs.mkdirSync(publicDirectory);
  const next = packed(packageData('new')), previous = packed(packageData('old'));
  const currentRelease = writeRelease(publicDirectory, next);
  const localManifest = JSON.stringify(next.manifest, null, 2) + '\n';
  fs.writeFileSync(path.join(publicDirectory, 'simulator-manifest.json'), localManifest);
  const routes = new Map(), requests = [];
  const publish = value => {
    routes.clear();
    routes.set('/simulator-manifest.json', { body: JSON.stringify(value.manifest), type: 'application/json' });
    const prefix = '/releases/' + value.manifest.packageHash + '/';
    routes.set(prefix + value.manifest.archive.path, { body: value.zip, type: 'application/zip' });
    routes.set(prefix + 'package-manifest.json', { body: value.side, type: 'application/json' });
  };
  publish(previous);
  const server = http.createServer((req, res) => {
    requests.push({ path: req.url, method: req.method, cache: req.headers['cache-control'] });
    const response = routes.get(req.url);
    res.writeHead(response?.status || (response ? 200 : 404), { 'Content-Type': response?.type || 'text/plain' });
    res.end(response?.body || 'missing');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); fs.rmSync(temp, { recursive: true, force: true }); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return { temp, publicDirectory, currentRelease, localManifest, next, previous, routes, requests, publish,
    run: options => retainPreviousRelease({ publicDirectory, origin, ...options }) };
}

test('fresh CI restores the published release atomically with exact ZIP/side-manifest bytes and unchanged asset hashes', async t => {
  const value = await fixture(t);
  const older = path.join(value.publicDirectory, 'releases', 'c'.repeat(64));
  fs.mkdirSync(older); fs.writeFileSync(path.join(older, 'keep.txt'), 'older release');
  const result = await value.run();
  assert.equal(result.action, 'previousReleaseRestored');
  assert.equal(result.atomic, true);
  const directory = path.join(value.publicDirectory, 'releases', value.previous.manifest.packageHash);
  for (const asset of value.previous.files) assert(fs.readFileSync(path.join(directory, asset.path)).equals(asset.data));
  assert(fs.readFileSync(path.join(directory, value.previous.manifest.archive.path)).equals(value.previous.zip));
  assert(fs.readFileSync(path.join(directory, 'package-manifest.json')).equals(value.previous.side));
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory, 'package-manifest.json'))).archive.sha256, digest(value.previous.zip));
  assert.equal(fs.readFileSync(path.join(value.publicDirectory, 'simulator-manifest.json'), 'utf8'), value.localManifest);
  assert.equal(fs.readFileSync(path.join(value.currentRelease, 'main.js'), 'utf8'), 'console.log("new");');
  assert.equal(fs.readFileSync(path.join(older, 'keep.txt'), 'utf8'), 'older release');
  assert(!fs.readdirSync(value.publicDirectory).some(name => name.startsWith('.staging-')));
  assert(value.requests.every(req => req.method === 'GET' && /no-cache|max-age=0/.test(req.cache)));
});

test('a verified local previous release is never overwritten or downloaded again', async t => {
  const value = await fixture(t);
  const directory = writeRelease(value.publicDirectory, value.previous);
  const before = fs.statSync(path.join(directory, 'main.js'));
  const result = await value.run();
  assert.equal(result.action, 'previousReleaseAlreadyRetained');
  assert.equal(result.immutableFilesUnchanged, true);
  assert.equal(fs.statSync(path.join(directory, 'main.js')).mtimeMs, before.mtimeMs);
  assert(!value.requests.some(req => req.path.endsWith('.zip')));
});

test('retains snapshot-format capabilities with exact immutable archive and side-manifest bytes', async t => {
  const value = await fixture(t);
  const formats = ['base64', 'gz1', 'gz2'];
  const previous = packed(packageData('format-aware', formats));
  value.publish(previous);
  const result = await value.run();
  assert.equal(result.action, 'previousReleaseRestored');
  const directory = path.join(value.publicDirectory, 'releases', previous.manifest.packageHash);
  assert(fs.readFileSync(path.join(directory, 'package-manifest.json')).equals(previous.side));
  assert(fs.readFileSync(path.join(directory, previous.manifest.archive.path)).equals(previous.zip));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory, 'package-manifest.json'))).supportedSnapshotFormats, formats);
  assert.equal((await value.run()).action, 'previousReleaseAlreadyRetained');
});

test('rejects snapshot-format capabilities that disagree with the published inventory or archive', async t => {
  const value = await fixture(t);
  const previous = packed(packageData('format-mismatch', ['base64', 'gz1', 'gz2']));
  value.publish({ ...previous, manifest: { ...previous.manifest, supportedSnapshotFormats: ['base64'] } });
  await assert.rejects(value.run(), /Archived package manifest does not match/);
  value.publish(previous);
  const sidePath = '/releases/' + previous.manifest.packageHash + '/package-manifest.json';
  value.routes.get(sidePath).body = JSON.stringify({ ...previous.inside,
    supportedSnapshotFormats: ['base64'], archive: previous.manifest.archive });
  await assert.rejects(value.run(), /Published side manifest does not match/);
  assert(!fs.existsSync(path.join(value.publicDirectory, 'releases', previous.manifest.packageHash)));
});

test('a same-hash deployment verifies its existing local release without overwriting or re-downloading it', async t => {
  const value = await fixture(t);
  value.publish(value.next);
  const result = await value.run();
  assert.equal(result.action, 'currentReleaseAlreadyPublished');
  assert.equal(result.nextPackageHash, result.previousPackageHash);
  assert(!value.requests.some(req => req.path.endsWith('.zip')));
});

test('a corrupt local immutable release fails without repairing or replacing it', async t => {
  const value = await fixture(t);
  const directory = writeRelease(value.publicDirectory, value.previous);
  fs.writeFileSync(path.join(directory, 'main.js'), 'corrupt');
  await assert.rejects(value.run(), /Local release integrity mismatch/);
  assert.equal(fs.readFileSync(path.join(directory, 'main.js'), 'utf8'), 'corrupt');
  assert(!value.requests.some(req => req.path.endsWith('.zip')));
});

test('download corruption or a missing required ZIP file never publishes a partial directory', async t => {
  const value = await fixture(t);
  const archivePath = '/releases/' + value.previous.manifest.packageHash + '/' + value.previous.manifest.archive.path;
  value.routes.get(archivePath).body = Buffer.from('broken ZIP');
  await assert.rejects(value.run(), /SHA-256|byte length/);
  value.publish(packed(value.previous, value.previous.records.filter(file => file.path !== 'main.js')));
  await assert.rejects(value.run(), /file count|incomplete/);
  assert(!fs.existsSync(path.join(value.publicDirectory, 'releases', value.previous.manifest.packageHash)));
  assert(!fs.readdirSync(value.publicDirectory).some(name => name.startsWith('.staging-')));
});

test('extra, traversal, duplicate, or digest-mismatched ZIP entries are rejected even with a matching archive digest', async t => {
  const value = await fixture(t);
  const cases = [
    [...value.previous.records, { path: 'extra.png', data: Buffer.from('extra') }],
    value.previous.records.map(file => file.path === 'main.js' ? { ...file, path: '../main.js' } : file),
    value.previous.records.map(file => file.path === 'main.js' ? value.previous.records.find(entry => entry.path === 'index.html') : file),
    value.previous.records.map(file => file.path === 'main.js' ? { ...file, data: Buffer.from('console.log("bad");') } : file)
  ];
  for (const records of cases) {
    value.publish(packed(value.previous, records));
    await assert.rejects(value.run(), /inventory|Unsafe ZIP path|duplicate path|SHA-256/);
  }
  assert(!fs.existsSync(path.join(value.publicDirectory, 'main.js')));
  assert(!fs.existsSync(path.join(value.publicDirectory, 'releases', value.previous.manifest.packageHash)));
});

test('unsupported ZIP methods, symlink attributes, and inconsistent local/central headers fail closed', async t => {
  const value = await fixture(t);
  const edits = [
    zip => { zip.writeUInt16LE(0, 8); return zip; },
    zip => { const central = zip.readUInt32LE(zip.length - 6); zip.writeUInt32LE(0xa1ff0000, central + 38); return zip; },
    zip => { zip.writeUInt32LE(0, 14); return zip; }
  ];
  for (const edit of edits) {
    value.publish(packed(value.previous, value.previous.records, edit));
    await assert.rejects(value.run(), /Unsupported ZIP|headers disagree/);
  }
});

test('published side-manifest bytes and semantics are required rather than regenerated from the ZIP', async t => {
  const value = await fixture(t);
  const sidePath = '/releases/' + value.previous.manifest.packageHash + '/package-manifest.json';
  value.routes.delete(sidePath);
  await assert.rejects(value.run(), /HTTP 404/);
  value.publish(value.previous);
  value.routes.get(sidePath).body = JSON.stringify({ ...value.previous.inside, archive: { ...value.previous.manifest.archive, bytes: 1 } });
  await assert.rejects(value.run(), /side manifest does not match/);
  assert(!fs.existsSync(path.join(value.publicDirectory, 'releases', value.previous.manifest.packageHash)));
});

test('only an explicit first-deployment 404 can be empty; network failures and HTTP 500 remain fatal', async t => {
  const value = await fixture(t);
  value.routes.delete('/simulator-manifest.json');
  await assert.rejects(value.run(), /HTTP 404/);
  assert.equal((await value.run({ allowEmpty: true })).action, 'noPreviousRelease');
  value.routes.set('/simulator-manifest.json', { status: 500, body: 'failed' });
  await assert.rejects(value.run({ allowEmpty: true }), /HTTP 500/);
  await assert.rejects(value.run({ allowEmpty: true, fetchImpl: async () => { throw new Error('network failed'); } }), /network failed/);
});

test('filesystem links in an existing release are rejected without writing through them', async t => {
  const value = await fixture(t);
  const directory = writeRelease(value.publicDirectory, value.previous);
  const external = path.join(value.temp, 'external.js');
  fs.writeFileSync(external, 'outside'); fs.unlinkSync(path.join(directory, 'main.js'));
  fs.symlinkSync(external, path.join(directory, 'main.js'));
  await assert.rejects(value.run(), /contains a link/);
  assert.equal(fs.readFileSync(external, 'utf8'), 'outside');
});
