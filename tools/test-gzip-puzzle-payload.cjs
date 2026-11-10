#!/usr/bin/env node
'use strict';

// Integration verification: actual frontend transport decoder, built engine,
// five published snapshots, and legal recorded actions. No browser/network or
// game-source changes. Generated snapshots stay in a temporary directory.
// Usage: node tools/test-gzip-puzzle-payload.cjs [out-dir] [replays-per-puzzle]
//   [report-file (default docs/simulator-gzip-results.json)]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const Module = require('node:module');
const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const codecFile = path.join(root, 'ptcg-play/src/app/shared/services/puzzle-payload.ts');

function productionDecoder() {
  if (!fs.existsSync(codecFile)) throw new Error('The production puzzle-payload.ts decoder is not available yet.');
  const resolve = Module._resolveFilename;
  Module._resolveFilename = function (request, parent, ...args) {
    if (request === 'ptcg-server') request = path.join(root, 'ptcg-server/browser/browser.js');
    if (request === 'ptcg-server/client') request = path.join(root, 'ptcg-server/browser/client/index.js');
    return resolve.call(this, request, parent, ...args);
  };
  require(path.join(root, 'ptcg-server/node_modules/ts-node')).register({
    project: path.join(root, 'ptcg-play/tsconfig.json'), transpileOnly: true,
    compilerOptions: { module: 'commonjs', target: 'es2018', experimentalDecorators: true }
  });
  const { decodePuzzlePayload } = require(codecFile);
  assert.equal(typeof decodePuzzlePayload, 'function');
  return decodePuzzlePayload;
}

function main(args = process.argv.slice(2)) {
  const output = path.resolve(args[0] || path.join(os.tmpdir(), 'twinleaf-gzip-puzzles'));
  const repeats = Number(args[1] || 10);
  const reportFile = path.resolve(args[2] || path.join(root, 'docs/simulator-gzip-results.json'));
  if (!Number.isSafeInteger(repeats) || repeats < 1) throw new Error('Replay count must be a positive integer.');
  const decodePuzzlePayload = productionDecoder();
  const { fixture } = require('./profile-puzzle-setup.cjs');
  const { replay, createSession, own, SlotType } = require('./puzzle-playthrough-core.cjs');
  const { ClientSimulator, compactSerializedState } = require('../ptcg-server/browser/client');
  const { Base64 } = require('../ptcg-server/browser/utils/base64');
  const { StateSerializer } = require('../ptcg-server/browser/game/serializer/state-serializer');
  const { ReorderHandAction } = require('../ptcg-server/browser/game/store/actions/reorder-actions');
  const base64 = new Base64(), serializer = new StateSerializer();
  const paths = ['phantom-maze', 'explosive-hand', 'breaking-through-wall', 'somethings-fishy']
    .map(name => path.join(__dirname, '.puzzle-playthrough', name + '.solution.json'));
  paths.push(path.join(__dirname, 'fixtures/deck-out-with-dengo.snapshot.json.gz'));
  const viewerPrefix = 'https://sim-static.prizemap.app/sandbox-viewer#';
  const report = {
    schemaVersion: 1, verifiedAt: new Date().toISOString(),
    method: 'Production TypeScript decodePuzzlePayload with pinned gzip inflator; current compiled ClientSimulator and full StateSerializer oracle; five exact published snapshots and legal actions with normal RNG. No browser, network, API mutation or gameplay source changes.',
    decoderSource: path.relative(root, codecFile), decoderSourceSha256: hash(fs.readFileSync(codecFile)),
    engineEntrySha256: hash(fs.readFileSync(path.join(root, 'ptcg-server/browser/client/simulator.js'))),
    gzipEncoding: 'gz1. + unpadded Base64URL(gzip level 6 of UTF-8 compact serialized JSON)',
    outputDirectory: output, fixtures: [], winningReplays: 0, dengoTuroNestCases: [],
    outgoingStateUpdatesRemainPlainBase64: true, normalRandomness: true,
    physicalWebViewTest: false, deployment: false
  };
  fs.mkdirSync(output, { recursive: true });
  for (let fixtureIndex = 0; fixtureIndex < paths.length; fixtureIndex++) {
    const file = paths[fixtureIndex], input = fixture(file);
    const bytes = fs.readFileSync(file);
    const plan = JSON.parse((file.endsWith('.gz') ? zlib.gunzipSync(bytes) : bytes).toString('utf8'));
    const json = compactSerializedState(base64.decode(input.stateData));
    const compressed = zlib.gzipSync(Buffer.from(json, 'utf8'), { level: 6 });
    const transport = 'gz1.' + compressed.toString('base64url');
    assert.match(transport, /^gz1\.[A-Za-z0-9_-]+$/);
    const decoded = decodePuzzlePayload(transport);
    assert.equal(decoded, base64.encode(json), 'Production transport decode must preserve every compact JSON byte.');
    assert.equal(decodePuzzlePayload(input.stateData), input.stateData, 'Legacy Base64 must pass through unchanged.');
    const url = new URL(viewerPrefix + transport);
    assert.equal(url.href, viewerPrefix + transport, 'The gzip fragment must require no percent-encoding.');
    assert.equal(decodePuzzlePayload(decodeURIComponent(url.hash.slice(1))), decoded);
    const original = new ClientSimulator(), gzip = new ClientSimulator(), restored = new ClientSimulator();
    let full, emitted;
    try {
      full = serializer.serialize(original.validateSnapshot(input.stateData));
      assert.equal(serializer.serialize(gzip.validateSnapshot(decoded)), full,
        'The complete state and reference graph must match the legacy input.');
      original.loadSnapshot({ stateData: input.stateData, winConditions: input.winConditions });
      gzip.loadSnapshot({ stateData: decoded, winConditions: input.winConditions });
      assert.equal(serializer.serialize(gzip.state), serializer.serialize(original.state));
      emitted = gzip.getStateData();
      assert.equal(emitted, original.getStateData());
      assert.ok(!emitted.startsWith('gz1.'), 'Host StateUpdate/history must remain plain Base64.');
      restored.loadSnapshot({ stateData: emitted, winConditions: input.winConditions });
      assert.equal(restored.getStateData(), emitted, 'Host history must remain byte-idempotent.');
      gzip.dispatch(new ReorderHandAction(gzip.humanPlayerId, gzip.state.players[0].hand.cards.map((_, index) => index).reverse()));
      gzip.pushState(emitted);
      assert.equal(gzip.getStateData(), emitted, 'Host undo/reset must restore the exact original plain snapshot.');
    } finally { original.cleanup(); gzip.cleanup(); restored.cleanup(); }
    const stem = path.basename(file).replace(/\.snapshot\.json\.gz$|\.solution\.json$/, '');
    const transportFile = path.join(output, stem + '.gz1.txt');
    const urlFile = path.join(output, stem + '.url.txt');
    fs.writeFileSync(transportFile, transport + '\n');
    fs.writeFileSync(urlFile, url.href + '\n');
    const entry = {
      name: input.name, fixture: path.relative(root, file), gzipPayloadFile: transportFile, viewerUrlFile: urlFile,
      sizes: { legacyBase64Characters: input.stateData.length, compactJsonUtf8Bytes: Buffer.byteLength(json),
        compactBase64Characters: base64.encode(json).length, gzipBytes: compressed.length,
        gzipTransportCharacters: transport.length, gzipViewerUrlCharacters: url.href.length },
      verification: { gzipJsonBytesIdentical: true, fullHydratedStateIdentical: true, sharedReferencesIdentical: true,
        canonicalFullStateSha256: hash(full), legacyPlainInputUnchanged: true, emittedPlainHistoryUnchanged: true,
        undoResetRoundtripIdentical: true, normalizedEmissionSha256: hash(emitted) }
    };
    const decodedPlan = { ...plan, stateData: decoded };
    if (Array.isArray(plan.trace)) {
      for (let repeat = 0; repeat < repeats; repeat++) {
        const session = replay(decodedPlan, plan.trace);
        try {
          assert.equal(session.state.phase, 7, 'The exact recorded legal sequence must finish.');
          assert.equal(session.state.winner, 0, 'The human must still win.');
          assert.equal(session.sim.complete, true);
          assert.ok(!session.sim.getStateData().startsWith('gz1.'));
          report.winningReplays++;
        } finally { session.sim.cleanup(); }
      }
      entry.winningReplays = repeats;
    } else {
      for (let promotion = 0; promotion < 5; promotion++) {
        const session = createSession(decodedPlan);
        try {
          session.play(7);
          assert.equal(session.pending('Choose pokemon').message, 'CHOOSE_POKEMON_TO_PICK_UP');
          session.choosePokemon([own(SlotType.ACTIVE)]);
          assert.equal(session.pending('Choose pokemon').message, 'CHOOSE_NEW_ACTIVE_POKEMON');
          session.choosePokemon([own(SlotType.BENCH, promotion)]);
          const promoted = session.state.players[0].active.getPokemonCard().fullName;
          assert.equal(session.pending().length, 0);
          session.play(6);
          session.chooseCards([1]); // Exact Fezandipiti ex physical card in the published deck.
          assert.equal(session.pending().length, 0);
          assert.ok(session.state.players[0].bench.some(list => list.cards.some(card => card.id === 1)));
          assert.equal(session.state.turn, 5);
          report.dengoTuroNestCases.push({ promotion, promoted, chosenCardId: 1, chosen: 'Fezandipiti ex SFA', verified: true });
        } finally { session.sim.cleanup(); }
      }
    }
    report.fixtures.push(entry);
  }
  assert.equal(report.winningReplays, 4 * repeats);
  assert.equal(report.dengoTuroNestCases.length, 5);
  const text = JSON.stringify(report, null, 2) + '\n';
  fs.writeFileSync(path.join(output, 'verification.json'), text);
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, text);
  console.log(JSON.stringify({ ok: true, fixtures: report.fixtures.length, winningReplays: report.winningReplays,
    dengoTuroNestCases: report.dengoTuroNestCases.length, reportFile,
    sizes: report.fixtures.map(value => ({ name: value.name, ...value.sizes })) }, null, 2));
  return report;
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.stack || error); process.exitCode = 1; }
}
module.exports = { main };
