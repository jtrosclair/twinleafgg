#!/usr/bin/env node
'use strict';

// Actual gz2 producer/decoder + full engine oracle. Private migration inputs are
// read only; reports contain sizes/hashes, never payloads, URLs, or record IDs.
// Usage: node tools/test-field-code-payload.cjs [--plan FILE] [--replays 10]
//   [--fixtures-only] [--out-dir DIR] [--report FILE]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const Module = require('node:module');
const { performance } = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const codecFile = path.join(root, 'ptcg-play/src/app/shared/services/puzzle-payload.ts');
const fieldFile = path.join(root, 'ptcg-play/src/app/shared/services/puzzle-field-codes.ts');

function equalBytes(actual, expected, label) {
  if (actual !== expected) throw new Error(label + '; expectedSha256=' + hash(expected) + '; actualSha256=' + hash(actual));
}
function summary(samples) {
  const values = samples.slice().sort((a, b) => a - b), n = values.length;
  if (!n) return undefined;
  const round = value => Number(value.toFixed(4));
  return { median: round((values[(n - 1) >> 1] + values[n >> 1]) / 2),
    p95: round(values[Math.ceil(n * 0.95) - 1]), min: round(values[0]), max: round(values[n - 1]) };
}
function options(args) {
  const result = { plan: '/Users/jerrytrosclair/.local/share/prizemap/backups/simulator-gzip-2026-11-06/plan.json',
    replays: 10, fixturesOnly: false, output: path.join(os.tmpdir(), 'twinleaf-field-code-puzzles'),
    report: path.join(root, 'docs/simulator-field-codes-results.json') };
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (key === '--fixtures-only') result.fixturesOnly = true;
    else if (['--plan', '--replays', '--out-dir', '--report'].includes(key)) {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw new Error(key + ' requires a value.');
      result[{ '--plan': 'plan', '--replays': 'replays', '--out-dir': 'output', '--report': 'report' }[key]] = value;
    } else throw new Error('Unknown option: ' + key);
  }
  result.replays = Number(result.replays);
  if (!Number.isSafeInteger(result.replays) || result.replays < 1) throw new Error('Replay count must be positive.');
  return result;
}
function fieldApi() {
  const ts = require(path.join(root, 'ptcg-play/node_modules/typescript'));
  const loaded = new Module(fieldFile, module);
  loaded.filename = fieldFile;
  loaded.paths = Module._nodeModulePaths(path.dirname(fieldFile));
  loaded._compile(ts.transpileModule(fs.readFileSync(fieldFile, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 }
  }).outputText, fieldFile);
  return loaded.exports;
}

function main(args = process.argv.slice(2)) {
  const config = options(args);
  const producerFile = path.join(root, 'tools/gzip-puzzle-payload.cjs');
  const { decoder, encodeGzipJson, encodeFieldCodeGzipJson } = require(producerFile);
  assert.equal(typeof encodeFieldCodeGzipJson, 'function', 'The production gz2 producer must be ready.');
  const decodePayload = decoder();
  const fields = fieldApi();
  const { ClientSimulator, compactSerializedState } = require('../ptcg-server/browser/client');
  const { StateSerializer } = require('../ptcg-server/browser/game/serializer/state-serializer');
  const { Base64 } = require('../ptcg-server/browser/utils/base64');
  const { ReorderHandAction } = require('../ptcg-server/browser/game/store/actions/reorder-actions');
  const { fixture } = require('./profile-puzzle-setup.cjs');
  const { replay, createSession, own, SlotType } = require('./puzzle-playthrough-core.cjs');
  const serializer = new StateSerializer(), base64 = new Base64(), validator = new ClientSimulator();
  const timings = {};
  const measure = (name, run) => {
    const start = performance.now();
    const result = run();
    (timings[name] ||= []).push(performance.now() - start);
    return result;
  };
  const canonical = stateData => serializer.serialize(validator.validateSnapshot(stateData));
  const report = { schemaVersion: 1, verifiedAt: new Date().toISOString(), node: process.version,
    method: 'Local actual gz2 field-key producer and production frontend decoder, exact restored minified JSON bytes, complete untrimmed StateSerializer oracle, and legal puzzle actions with normal RNG. No browser, network, database mutation, or runtime source changes.',
    dictionaryPrefix: 'gz2.', dictionaryPairs: fields.PUZZLE_FIELD_CODES_V2.length,
    dictionarySha256: hash(JSON.stringify(fields.PUZZLE_FIELD_CODES_V2)),
    fieldHelperSourceSha256: hash(fs.readFileSync(fieldFile)), decoderSourceSha256: hash(fs.readFileSync(codecFile)),
    producerSourceSha256: hash(fs.readFileSync(producerFile)),
    migration: undefined, unknownFieldChecks: {}, fixtures: [], winningReplays: 0, dengoTuroNestCases: [],
    historyTransport: 'ordinary Base64 unchanged', valuesAndPhysicalCardIdsUnchanged: true,
    applicationFilesChanged: false, databaseChanges: false, deployment: false };
  try {
    // Key-only codec smoke includes integer-key ordering, literal code-like keys,
    // escaped names, Unicode, dangerous property names, and opaque Ref paths.
    const extra = JSON.parse('{"10":"ten","2":"two","a":"literal","~name":"literal-tilde","":"empty-key","__proto__":{"kept":false},"constructor":"literal","prototype":[],"name":"Pokémon 🐱","future":{"path":"0.0.active.marker","value":null}}');
    const extraJson = JSON.stringify(extra);
    equalBytes(fields.decodePuzzleFieldCodes(fields.encodePuzzleFieldCodes(extraJson)), extraJson, 'Unknown-field smoke must preserve exact canonical JSON');
    equalBytes(base64.decode(decodePayload(encodeFieldCodeGzipJson(extraJson))), extraJson, 'Unknown-field gzip smoke must preserve exact JSON');
    assert.equal({}.kept, undefined);
    report.unknownFieldChecks = { integerKeysKeepOrder: true, codeLikeAndTildeKeysRetained: true,
      protoAndConstructorRemainData: true, unicodeAndLiteralValuesRetained: true, refPathStringsUnchanged: true };

    if (!config.fixturesOnly) {
      const planBytes = fs.readFileSync(config.plan), plan = JSON.parse(planBytes.toString('utf8'));
      assert.equal(plan.changes.length, 600, 'The requested read-only migration plan must contain 600 records.');
      const records = [];
      let beforeCharacters = 0, afterCharacters = 0;
      for (let index = 0; index < plan.changes.length; index++) {
        const change = plan.changes[index];
        const locatorSha256 = hash(JSON.stringify([change.table, change.id, change.field]));
        let stage = 'extract';
        try {
          const payload = decodeURIComponent(new URL(change.after).hash.slice(1));
          stage = 'decode original';
          const plain = measure('gz1DecodeMs', () => decodePayload(payload)), json = base64.decode(plain);
          stage = 'field encode';
          equalBytes(fields.decodePuzzleFieldCodes(fields.encodePuzzleFieldCodes(json)), json, 'Field keys must restore every original JSON byte');
          const token = measure('gz2EncodeGzipMs', () => encodeFieldCodeGzipJson(json));
          stage = 'decode gz2';
          const restored = measure('gz2DecodeMs', () => decodePayload(token));
          equalBytes(restored, plain, 'Transport must restore exact original plain Base64');
          stage = 'full engine oracle';
          const originalFull = measure('fullOracleOriginalMs', () => canonical(plain));
          const restoredFull = measure('fullOracleRestoredMs', () => canonical(restored));
          equalBytes(restoredFull, originalFull, 'Full state/reference graph must remain identical');
          const before = JSON.parse(json), after = JSON.parse(base64.decode(restored));
          equalBytes(JSON.stringify(after[1].winConditions), JSON.stringify(before[1].winConditions), 'Win conditions must remain identical');
          assert.equal(decodePayload(plain), plain, 'Ordinary Base64 must still pass through byte-for-byte.');
          beforeCharacters += payload.length; afterCharacters += token.length;
          records.push({ index, locatorSha256, previousTransportCharacters: payload.length,
            fieldCodeTransportCharacters: token.length, canonicalFullStateSha256: hash(originalFull),
            exactJsonBytes: true, fullCanonicalStateAndReferences: true, winConditions: true });
        } catch {
          // Never print a private snapshot through an assertion diff/exception.
          throw new Error('Migration record ' + index + ' failed at ' + stage + '; locatorSha256=' + locatorSha256);
        }
      }
      equalBytes(hash(fs.readFileSync(config.plan)), hash(planBytes), 'The backup plan must remain unchanged');
      report.migration = { readOnlyPlanSha256: hash(planBytes), recordsVerified: records.length,
        planUnchanged: true, rawPayloadsOrIdsInReport: false,
        totals: { previousTransportCharacters: beforeCharacters, fieldCodeTransportCharacters: afterCharacters,
          savedCharacters: beforeCharacters - afterCharacters,
          reductionPercent: Number((100 * (beforeCharacters - afterCharacters) / beforeCharacters).toFixed(3)) },
        previousCharacters: summary(records.map(row => row.previousTransportCharacters)),
        fieldCodeCharacters: summary(records.map(row => row.fieldCodeTransportCharacters)), records };
    }

    fs.mkdirSync(config.output, { recursive: true });
    const paths = ['phantom-maze', 'explosive-hand', 'breaking-through-wall', 'somethings-fishy']
      .map(name => path.join(__dirname, '.puzzle-playthrough', name + '.solution.json'));
    paths.push(path.join(__dirname, 'fixtures/deck-out-with-dengo.snapshot.json.gz'));
    for (const file of paths) {
      const input = fixture(file), plain = decodePayload(input.stateData), json = compactSerializedState(base64.decode(plain));
      const gz1 = encodeGzipJson(json), gz2 = encodeFieldCodeGzipJson(json), restored = decodePayload(gz2);
      equalBytes(base64.decode(restored), json, 'Public fixture JSON bytes must be identical');
      equalBytes(canonical(restored), canonical(base64.encode(json)), 'Public fixture full state must match');
      const original = new ClientSimulator(), loaded = new ClientSimulator();
      let emitted;
      try {
        original.loadSnapshot({ stateData: plain, winConditions: input.winConditions });
        loaded.loadSnapshot({ stateData: restored, winConditions: input.winConditions });
        emitted = loaded.getStateData();
        equalBytes(emitted, original.getStateData(), 'Native outgoing snapshot must not change');
        assert.ok(!/^gz\d+\./.test(emitted));
        loaded.dispatch(new ReorderHandAction(loaded.humanPlayerId, loaded.state.players[0].hand.cards.map((_, index) => index).reverse()));
        loaded.pushState(emitted);
        equalBytes(loaded.getStateData(), emitted, 'Undo/reset must remain byte-stable');
      } finally { original.cleanup(); loaded.cleanup(); }
      const bytes = fs.readFileSync(file);
      const plan = JSON.parse((file.endsWith('.gz') ? require('node:zlib').gunzipSync(bytes) : bytes).toString('utf8'));
      const decodedPlan = { ...plan, stateData: restored };
      const stem = path.basename(file).replace(/\.snapshot\.json\.gz$|\.solution\.json$/, '');
      const url = 'https://sim-static.prizemap.app/sandbox-viewer#' + gz2;
      fs.writeFileSync(path.join(config.output, stem + '.url.txt'), url + '\n');
      const entry = { name: input.name, gzip1Characters: gz1.length, fieldCodeGzipCharacters: gz2.length,
        savedCharacters: gz1.length - gz2.length, exactJsonBytes: true, fullCanonicalStateAndReferences: true,
        ordinaryOutgoingHistoryUnchanged: true, normalizedEmissionSha256: hash(emitted) };
      if (plan.trace) {
        for (let repeat = 0; repeat < config.replays; repeat++) {
          const session = replay(decodedPlan, plan.trace);
          try {
            assert.equal(session.state.phase, 7); assert.equal(session.state.winner, 0); assert.equal(session.sim.complete, true);
            assert.ok(!/^gz\d+\./.test(session.sim.getStateData()));
            report.winningReplays++;
          } finally { session.sim.cleanup(); }
        }
        entry.winningReplays = config.replays;
      } else {
        for (let promotion = 0; promotion < 5; promotion++) {
          const session = createSession(decodedPlan);
          try {
            session.play(7); session.choosePokemon([own(SlotType.ACTIVE)]);
            assert.equal(session.pending('Choose pokemon').message, 'CHOOSE_NEW_ACTIVE_POKEMON');
            session.choosePokemon([own(SlotType.BENCH, promotion)]);
            assert.equal(session.pending().length, 0);
            session.play(6); session.chooseCards([1]);
            assert.equal(session.pending().length, 0);
            assert.ok(session.state.players[0].bench.some(list => list.cards.some(card => card.id === 1)));
            report.dengoTuroNestCases.push({ promotion, verified: true });
          } finally { session.sim.cleanup(); }
        }
      }
      report.fixtures.push(entry);
    }
    assert.equal(report.winningReplays, 4 * config.replays);
    assert.equal(report.dengoTuroNestCases.length, 5);
    report.desktopNodeTimingsMilliseconds = Object.fromEntries(Object.entries(timings).map(([key, values]) => [key, summary(values)]));
    fs.mkdirSync(path.dirname(config.report), { recursive: true });
    fs.writeFileSync(config.report, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ ok: true, migrationRecords: report.migration?.recordsVerified || 0,
      migrationTotals: report.migration?.totals, fixtures: report.fixtures, winningReplays: report.winningReplays,
      dengoCases: report.dengoTuroNestCases.length, reportFile: config.report }, null, 2));
    return report;
  } finally { validator.cleanup(); }
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.stack || error); process.exitCode = 1; }
}
module.exports = { main };
