#!/usr/bin/env node
'use strict';

// Verify the production trimmer with actual saved puzzles and their legal traces.
// All generated variants/reports stay in the chosen temporary directory.
// Usage: node tools/test-trim-puzzle-payload.cjs [out-dir] [replays-per-puzzle]
//   [pre-change-baseline.json] [additional-report.json]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { createTrimmer, transformInput, sizes } = require('./trim-puzzle-payload.cjs');

const root = path.resolve(__dirname, '..');
const output = path.resolve(process.argv[2] || path.join(os.tmpdir(), 'twinleaf-trimmed-puzzles'));
const repeats = Number(process.argv[3] || 10);
const baselineFile = process.argv[4] || path.join(os.tmpdir(), 'twinleaf-trim-canonical-before.json');
const baseline = fs.existsSync(baselineFile) ? JSON.parse(fs.readFileSync(baselineFile, 'utf8')) : undefined;
if (process.argv[4] && !baseline) throw new Error('Missing explicitly requested pre-change baseline: ' + baselineFile);
if (!Number.isSafeInteger(repeats) || repeats < 1) throw new Error('Replay count must be positive.');
fs.mkdirSync(output, { recursive: true });
const originalLog = console.log;
let trimmer;
try { console.log = (...values) => console.error(...values); trimmer = createTrimmer(); }
finally { console.log = originalLog; }
const { replay, createSession, own, SlotType } = require('./puzzle-playthrough-core.cjs');
const { Base64 } = require('../ptcg-server/browser/utils/base64');
const { StateSerializer } = require('../ptcg-server/browser/game/serializer/state-serializer');
const { Stage, SuperType } = require('../ptcg-server/browser/game/store/card/card-types');
const codec = new Base64();
const serializer = new StateSerializer();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const viewerPrefix = 'https://sim-static.prizemap.app/sandbox-viewer#';

try {
  const files = ['phantom-maze', 'explosive-hand', 'breaking-through-wall', 'somethings-fishy']
    .map(name => path.join(__dirname, '.puzzle-playthrough', `${name}.solution.json`));
  files.push(path.join(__dirname, 'fixtures/deck-out-with-dengo.snapshot.json.gz'));
  const report = { schemaVersion: 1, verifiedAt: new Date().toISOString(),
    method: 'Current production compactSerializedState; complete untrimmed hydrated-state oracle; exact existing snapshots and legal actions, normal RNG, no server or browser.',
    outputDirectory: output, preChangeBaseline: baseline ? { file: baselineFile,
      sha256: hash(fs.readFileSync(baselineFile)), fixtures: baseline.length } : undefined,
    productionHelperSourceSha256: hash(fs.readFileSync(path.join(root, 'ptcg-server/src/game/serializer/compact-state.ts'))),
    compiledHelperSha256: hash(fs.readFileSync(path.join(root, 'ptcg-server/browser/game/serializer/compact-state.js'))),
    fixtures: [], winningReplays: 0, dengoTuroNestCases: [] };
  let firstSolution, firstTrimmed;
  for (const file of files) {
    const before = trimmer.records.length;
    const transformed = transformInput(fs.readFileSync(file), trimmer);
    const destination = path.join(output, path.basename(file));
    fs.writeFileSync(destination, transformed.bytes);
    const value = JSON.parse((file.endsWith('.gz') ? zlib.gunzipSync(transformed.bytes) : transformed.bytes).toString('utf8'));
    const entry = { name: value.name, file: path.relative(root, file), trimmedFile: destination,
      format: transformed.format, snapshots: trimmer.records.slice(before) };
    const originalBytes = fs.readFileSync(file);
    const original = JSON.parse((file.endsWith('.gz') ? zlib.gunzipSync(originalBytes) : originalBytes).toString('utf8'));
    const originalSession = createSession(original), trimmedSession = createSession(value);
    try {
      const originalFull = serializer.serialize(originalSession.state);
      const trimmedFull = serializer.serialize(trimmedSession.state);
      assert.equal(trimmedFull, originalFull, 'Full outgoing restored states must match.');
      const emitted = trimmedSession.sim.getStateData();
      entry.viewerUrl = { prefix: viewerPrefix,
        originalCharacters: viewerPrefix.length + original.stateData.length,
        compactCharacters: viewerPrefix.length + value.stateData.length };
      entry.compactOutgoing = sizes(codec.decode(emitted), emitted);
      if (baseline) {
        const saved = baseline.find(item => item.name === value.name);
        assert.ok(saved, 'Missing pre-change fixture: ' + value.name);
        const previousJson = codec.decode(saved.stateData);
        assert.equal(originalFull, previousJson, 'Original input must still match the PRE-CHANGE full-state baseline.');
        assert.equal(trimmedFull, previousJson, 'Trimmed input must match the PRE-CHANGE full-state baseline.');
        const archived = createSession({ name: value.name, stateData: saved.stateData });
        try { assert.equal(serializer.serialize(archived.state), previousJson, 'Old full outgoing schema must remain accepted.'); }
        finally { archived.sim.cleanup(); }
        entry.previousFullOutgoing = sizes(previousJson, saved.stateData);
        entry.preChangeVerification = { oldInputAccepted: true, oldFullOutgoingAccepted: true,
          trimmedInputAccepted: true, fullStateIdentical: true, fullStateSha256: hash(previousJson) };
      }
    } finally { originalSession.sim.cleanup(); trimmedSession.sim.cleanup(); }
    if (value.trace) {
      for (let index = 0; index < repeats; index++) {
        const session = replay(value, value.trace);
        try {
          assert.equal(session.state.phase, 7, 'Recorded legal actions must finish the puzzle.');
          assert.equal(session.state.winner, 0, 'The human must win.');
          assert.equal(session.sim.complete, true);
          report.winningReplays++;
        } finally { session.sim.cleanup(); }
      }
      entry.winningReplays = repeats;
      if (!firstSolution) {
        firstSolution = JSON.parse(fs.readFileSync(file, 'utf8'));
        firstTrimmed = value;
      }
    } else {
      for (let promotion = 0; promotion < 5; promotion++) {
        const session = createSession(value);
        try {
          session.play(7); // Professor Turo's Scenario from the unchanged hand.
          assert.equal(session.pending('Choose pokemon').message, 'CHOOSE_POKEMON_TO_PICK_UP');
          session.choosePokemon([own(SlotType.ACTIVE)]);
          assert.equal(session.pending('Choose pokemon').message, 'CHOOSE_NEW_ACTIVE_POKEMON');
          session.choosePokemon([own(SlotType.BENCH, promotion)]);
          assert.equal(session.pending().length, 0);
          const promoted = session.state.players[0].active.getPokemonCard().fullName;
          session.play(6); // Nest Ball must still be playable after both prompts.
          const choice = session.pending('Choose cards');
          const basic = choice.cards.cards.find(card => card.superType === SuperType.POKEMON && card.stage === Stage.BASIC);
          assert.ok(basic, 'Dengo deck must still offer a legal Basic Pokemon.');
          const deckBefore = session.state.players[0].deck.cards.length;
          session.chooseCards([basic.id]);
          assert.equal(session.pending().length, 0);
          assert.equal(session.state.players[0].deck.cards.length, deckBefore - 1);
          assert.ok(session.state.players[0].bench.some(list => list.cards.some(card => card.id === basic.id)));
          report.dengoTuroNestCases.push({ promotion, promoted, chosen: basic.fullName, complete: true });
        } finally { session.sim.cleanup(); }
      }
    }
    report.fixtures.push(entry);
  }

  // The same schema must work through every supported CLI input form, not just
  // JSON fixture wrappers. These transformations use the real production helper.
  const url = new URL('https://sim-static.prizemap.app/sandbox-viewer?example=1#' + firstSolution.stateData);
  const forms = [
    ['base64', firstSolution.stateData],
    ['serialized-json', codec.decode(firstSolution.stateData)],
    ['url', url.href],
    ['json-fixture', JSON.stringify({ puzzle: { newWebviewUrl: url.href, webviewUrl: url.href } })]
  ];
  report.inputForms = [];
  for (const [expected, text] of forms) {
    const result = transformInput(Buffer.from(text), trimmer);
    assert.equal(result.format, expected);
    let stateData;
    if (expected === 'base64') stateData = result.bytes.toString('utf8').trim();
    else if (expected === 'serialized-json') stateData = codec.encode(result.bytes.toString('utf8').trim());
    else if (expected === 'url') {
      const actual = new URL(result.bytes.toString('utf8').trim());
      assert.equal(actual.pathname, url.pathname); assert.equal(actual.search, url.search);
      stateData = decodeURIComponent(actual.hash.slice(1));
    } else {
      const actual = JSON.parse(result.bytes.toString('utf8')).puzzle;
      assert.equal(actual.newWebviewUrl, actual.webviewUrl);
      stateData = decodeURIComponent(new URL(actual.newWebviewUrl).hash.slice(1));
    }
    assert.equal(stateData, firstTrimmed.stateData);
    report.inputForms.push({ format: expected, verified: true });
  }
  assert.throws(() => transformInput(Buffer.from('not base64!'), trimmer));
  assert.throws(() => transformInput(Buffer.from('{}'), trimmer));
  const reportFile = path.join(output, 'verification.json');
  const reportText = JSON.stringify(report, null, 2) + '\n';
  fs.writeFileSync(reportFile, reportText);
  if (process.argv[5]) fs.writeFileSync(process.argv[5], reportText);
  console.log(JSON.stringify({ ok: true, fixtures: report.fixtures.length, winningReplays: report.winningReplays,
    dengoTuroNestCases: report.dengoTuroNestCases.length, inputForms: report.inputForms,
    reportFile, sizes: report.fixtures.map(fixture => ({ name: fixture.name,
      before: fixture.snapshots[0].before, after: fixture.snapshots[0].after })) }, null, 2));
} finally { trimmer.cleanup(); }
