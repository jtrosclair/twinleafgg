'use strict';

// Verify the actual metadata builder with read-only source substitutions. No
// generated payload or production source is modified by these checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const os = require('node:os');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { createRequire } = require('node:module');
const play = path.resolve(__dirname, '..');
const server = path.resolve(play, '../ptcg-server');
const builder = path.join(__dirname, 'build-client-assets.cjs');
const localRequire = createRequire(builder);
const { ensureClientCards, applyClientCardMetadata } = localRequire(path.join(server, 'browser/client/cards'));
const { CARD_LIBRARY_SCHEMA_VERSION, expandCardImageReference } = localRequire(path.join(server, 'browser/client/card-metadata'));

function build(changedFile, catalogue) {
  const writes = new Map();
  const virtualFs = { ...fs,
    mkdirSync() {}, unlinkSync() {},
    writeFileSync(file, data) { writes.set(file, String(data)); },
    readFileSync(file, ...args) {
      const data = fs.readFileSync(file, ...args);
      if (path.resolve(file) !== changedFile) { return data; }
      return typeof data === 'string' ? data + '\n' : Buffer.concat([data, Buffer.from('\n')]);
    }
  };
  vm.runInNewContext(fs.readFileSync(builder, 'utf8'), {
    __dirname, console: { log() {} },
    require(id) {
      if (id === 'fs') return virtualFs;
      if (id === './static-resources.cjs') return { collectResources() { return {}; }, bootstrap() { return ''; } };
      if (id === path.join(server, 'browser/client/cards') && catalogue) {
        return { ensureClientCards() { return catalogue; } };
      }
      return localRequire(id);
    }
  }, { filename: builder });
  const manifest = JSON.parse([...writes].find(([file]) => file.endsWith('/cards.hash.json'))[1]);
  const payload = JSON.parse([...writes].find(([file]) => /\/cards\.[a-f0-9]{64}\.json$/.test(file))[1]);
  const constants = [...writes].find(([file]) => file.endsWith('/client-library-version.ts'))[1];
  return { manifest, payload, constants };
}

const baseline = build();
const info = baseline.payload.cardsInfo;
assert.equal(info.schemaVersion, CARD_LIBRARY_SCHEMA_VERSION);
assert.equal(info.hash, baseline.manifest.hash);
const cards = ensureClientCards();
const names = cards.map(card => card.fullName);
const sets = localRequire(path.join(server, 'browser/sets'));
const setNames = Object.keys(sets).sort().filter(name => Array.isArray(sets[name]));
assert.deepEqual(names, setNames.flatMap(name => sets[name].map(card => card.fullName)),
  'Every set segment and its internal card order must follow lexical ESM export order.');
// Verify the already-built browser namespace rather than assuming CommonJS
// insertion order matches webpack. A source-only checkout may have no artifact.
let observedBrowserNamespaceOrder = false;
const distribution = path.join(play, 'dist/ptcg-play');
if (fs.existsSync(distribution)) {
  const main = fs.readdirSync(distribution).find(name => /^main\..*\.js$/.test(name));
  if (main) {
    const knownSets = new Set(setNames);
    const observed = [...new Set([...fs.readFileSync(path.join(distribution, main), 'utf8')
      .matchAll(/\b(set[A-Z0-9]\w*):\(\)=>/g)].map(match => match[1]).filter(name => knownSets.has(name)))];
    if (observed.length === setNames.length) {
      assert.deepEqual(observed, setNames, 'The image generator must match the actual browser namespace order.');
      observedBrowserNamespaceOrder = true;
    }
  }
}
assert.equal(info.images.length, cards.length);
assert.equal(new Set(names).size, cards.length);
assert.deepEqual(Object.keys(info).sort(), ['catalogueHash', 'hash', 'images', 'schemaVersion']);
const catalogueHash = crypto.createHash('sha256').update(JSON.stringify(names)).digest('hex');
assert.equal(info.catalogueHash, catalogueHash);
assert.equal(baseline.manifest.catalogueHash, catalogueHash);
assert.equal(baseline.manifest.cardsTotal, cards.length);
assert.ok(baseline.constants.includes(`CLIENT_CATALOGUE_HASH = '${catalogueHash}'`));
assert.ok(baseline.constants.includes(`CLIENT_LIBRARY_HASH = '${info.hash}'`));
assert.ok(baseline.constants.includes(`CLIENT_CARD_TOTAL = ${cards.length}`));
const imageMap = JSON.parse(fs.readFileSync(path.join(server, 'data/limitlesstcg-images.json'), 'utf8'));
const oldRows = cards.map(card => ({ fullName: card.fullName,
  cardImage: imageMap[card.usSetNumber || `${card.set} ${card.setNumber}`] || card.cardImage }));
assert.deepEqual(info.images.map(expandCardImageReference), oldRows.map(card => card.cardImage),
  'Every ordered image must expand to the exact previous full-name metadata URL.');
assert.ok(info.images.some(image => image === ''), 'Missing scans must retain their empty fallback value.');
assert.ok(info.images.some(image => image.startsWith('/tpci/')));
assert.ok(info.images.some(image => image.startsWith('/tpc/')));
const reordered = build(undefined, [...cards].reverse());
assert.notEqual(reordered.manifest.catalogueHash, catalogueHash, 'Changing registration order must change its SHA-256 identity.');
assert.notEqual(reordered.manifest.hash, info.hash, 'The library hash must also include ordered catalogue identity.');
assert.throws(() => applyClientCardMetadata(reordered.payload.cardsInfo, baseline.manifest),
  /does not match/, 'A table from a differently ordered build must fail before applying images.');
const identities = [...cards];
const effects = cards.map(card => card.reduceEffect);
applyClientCardMetadata(info, baseline.manifest);
for (let index = 0; index < cards.length; index++) {
  assert.equal(cards[index], identities[index]);
  assert.equal(cards[index].reduceEffect, effects[index]);
  assert.equal(cards[index].fullName, names[index]);
  assert.equal(cards[index].cardImage, oldRows[index].cardImage);
}
for (const file of ['utils/base64.ts', 'browser.ts', 'index.ts', 'simple-bot/prompt-resolver/choose-cards-prompt-resolver.ts']) {
  assert.notEqual(build(path.join(server, 'src', file)).manifest.hash, baseline.manifest.hash,
    file + ' must invalidate cached metadata and the executable library.');
}
assert.notEqual(build(path.join(server, 'data/limitlesstcg-images.json')).manifest.hash, baseline.manifest.hash);
assert.equal(build(path.join(server, 'src/sets/tests/test-helpers.ts')).manifest.hash, baseline.manifest.hash,
  'Test-only changes must not cause a production card-library update.');

// Exercise the actual collector/bootstrap with the actual builder's generated
// documents. The finalized package needs no separate card-metadata requests.
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'simulator-embedded-metadata-'));
try {
  const directory = path.join(temporary, 'assets/simulator');
  fs.mkdirSync(directory, { recursive: true });
  const manifestPath = 'assets/simulator/cards.hash.json';
  const payloadPath = `assets/simulator/cards.${info.hash}.json`;
  fs.writeFileSync(path.join(temporary, manifestPath), JSON.stringify(baseline.manifest));
  fs.writeFileSync(path.join(temporary, payloadPath), JSON.stringify(baseline.payload));
  fs.writeFileSync(path.join(directory, 'unrelated.json'), '{"notMetadata":true}');
  const { collectResources, bootstrap } = localRequire('./static-resources.cjs');
  const resources = collectResources(temporary);
  assert.deepEqual(Object.keys(resources.json).sort(), [manifestPath, payloadPath].sort(),
    'Only the generated card metadata pair belongs in the simulator bootstrap.');
  const context = { document: { documentElement: { style: { setProperty() {} } } } };
  vm.runInNewContext(bootstrap(resources), context);
  const embedded = context.__SIMULATOR_STATIC__.json;
  assert.equal(JSON.stringify(embedded[manifestPath]), JSON.stringify(baseline.manifest));
  assert.equal(JSON.stringify(embedded[payloadPath]), JSON.stringify(baseline.payload));
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
const size = value => { const data = JSON.stringify(value); return { bytes: Buffer.byteLength(data), gzipBytes: zlib.gzipSync(data, { level: 6 }).length }; };
console.log(JSON.stringify({ ok: true, schemaVersion: info.schemaVersion, cards: info.images.length,
  catalogueHash, exactUrlsPreserved: info.images.length, orderMismatchRejected: true, observedBrowserNamespaceOrder,
  imageMetadataOnly: true, engineSourceChangesInvalidate: true, testsDoNotInvalidate: true,
  generatedMetadataEmbeddedInBootstrap: true, oldMetadata: size({ ok: true, cardsInfo: { schemaVersion: 2, cards: oldRows, hash: info.hash } }),
  orderedMetadata: size(baseline.payload) }));
