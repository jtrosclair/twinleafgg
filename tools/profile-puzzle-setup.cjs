#!/usr/bin/env node
'use strict';

// Build the Node engine first: node ptcg-server/scripts/build-browser.cjs
// Then: node tools/profile-puzzle-setup.cjs [--runs 20] [--warmup 3] [fixture ...]
// With no paths, use four local solutions and the exact public Dengo fixture.
// Fixtures may be JSON, gzipped JSON, or text containing a Base64 snapshot.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');

function timed(run) {
  const start = performance.now();
  const value = run();
  return { value, ms: performance.now() - start };
}

function summary(samples) {
  const sorted = samples.slice().sort((a, b) => a - b);
  const round = value => Number(value.toFixed(3));
  const middle = Math.floor(sorted.length / 2);
  return {
    medianMs: round(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2),
    p95Ms: round(sorted[Math.ceil(sorted.length * 0.95) - 1]),
    minMs: round(sorted[0])
  };
}

function options(args) {
  const result = { runs: 20, warmup: 3, coldRuns: 0, detail: false, variant: 'baseline', files: [] };
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === '--help' || argument === '-h') {
      console.log('Usage: node tools/profile-puzzle-setup.cjs [--runs 20] [--warmup 3] [--cold-runs 5] [--detail]\n'
        + '  [--variant baseline|batch-playability|map-serialize|memo-normalize|repair-exact|base64-loops|fast-input]\n'
        + '  [fixture.json[.gz] | snapshot.txt ...]\n'
        + 'Default: the four local solution JSON files and tools/fixtures/deck-out-with-dengo.snapshot.json.gz\n'
        + 'Local files only. JSON output goes to stdout; no files or game sources are changed.');
      return;
    }
    if (argument === '--runs' || argument === '--warmup' || argument === '--cold-runs') {
      const value = args[++index];
      const number = Number(value);
      if (!/^\d+$/.test(value || '') || !Number.isSafeInteger(number)
        || number < (argument === '--runs' ? 1 : 0)) {
        throw new Error(`${argument} requires ${argument === '--runs' ? 'a positive' : 'a nonnegative'} integer.`);
      }
      result[argument === '--cold-runs' ? 'coldRuns' : argument.slice(2)] = number;
    } else if (argument === '--detail') {
      result.detail = true;
    } else if (argument === '--variant') {
      result.variant = args[++index];
      if (!['baseline', 'batch-playability', 'map-serialize', 'memo-normalize', 'repair-exact', 'base64-loops', 'fast-input'].includes(result.variant)) throw new Error('Unknown experimental variant.');
    } else if (argument === '--') {
      result.files.push(...args.slice(index + 1));
      break;
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`);
    } else result.files.push(argument);
  }
  if (!result.files.length) {
    result.files = ['phantom-maze', 'explosive-hand', 'breaking-through-wall', 'somethings-fishy']
      .map(name => path.join(__dirname, '.puzzle-playthrough', `${name}.solution.json`));
    result.files.push(path.join(__dirname, 'fixtures/deck-out-with-dengo.snapshot.json.gz'));
  }
  result.files = result.files.map(file => path.resolve(file));
  return result;
}

function fixture(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing local fixture: ${file}. Pass a puzzle JSON or snapshot text path.`);
  const bytes = fs.readFileSync(file);
  const text = (file.endsWith('.gz') ? require('node:zlib').gunzipSync(bytes).toString('utf8') : bytes.toString('utf8')).trim();
  const value = /^[{"\[]/.test(text) ? JSON.parse(text) : text;
  const puzzle = value?.puzzle || value;
  const url = puzzle?.newWebviewUrl || puzzle?.webviewUrl;
  const stateData = typeof value === 'string' ? value : value?.stateData || puzzle?.stateData
    || (url && decodeURIComponent(new URL(url).hash.slice(1)));
  if (typeof stateData !== 'string' || !stateData.trim()) throw new Error(`No Base64 snapshot found in ${file}.`);
  return { file, name: puzzle?.name || path.basename(file), stateData: stateData.trim(), winConditions: puzzle?.winConditions };
}

function main(args) {
  const config = options(args);
  if (!config) return;
  const fixtures = config.files.map(fixture);
  const engine = path.resolve(__dirname, '../ptcg-server/browser');
  if (!fs.existsSync(path.join(engine, 'client/index.js'))) {
    throw new Error('Build the Node engine first: node ptcg-server/scripts/build-browser.cjs');
  }
  const imported = timed(() => ({ ...require(path.join(engine, 'client')),
    ...require(path.join(engine, 'utils/base64')) }));
  const { ClientSimulator, ensureClientCards, Base64 } = imported.value;
  const { StateSerializer } = require(path.join(engine, 'game/serializer/state-serializer'));
  const { instrument, applyVariant } = require('./profile-engine-stages.cjs');
  applyVariant(engine, config.variant);
  const collector = config.detail ? instrument(engine) : undefined;
  // Registry setup emits a diagnostic to stdout; keep the profiler output JSON.
  const log = console.log;
  let registry;
  console.log = (...values) => console.error(...values);
  try { registry = timed(() => ensureClientCards()); } finally { console.log = log; }
  const report = {
    schemaVersion: 2, node: process.version, platform: `${process.platform}/${process.arch}`,
    method: 'Local CJS engine only; normal randomness, no artwork/network/browser work. Timings are milliseconds. JSON/Base64 microtimings use the input snapshot. Detail timers overlap and include instrumentation overhead. Cold means a fresh Node process with the OS file cache unchanged; CJS import includes filesystem/module loading and all card definitions.',
    runs: config.runs, warmup: config.warmup, variant: config.variant, detail: config.detail,
    moduleImportMs: Number(imported.ms.toFixed(3)), registryMs: Number(registry.ms.toFixed(3)),
    registeredCards: registry.value.length, fixtures: []
  };
  for (const input of fixtures) {
    const raw = JSON.parse(new Base64().decode(input.stateData));
    if (!Array.isArray(raw?.[1]?.cardNames)) throw new Error(`Invalid snapshot card table in ${input.file}.`);
    const samples = { constructor: [], loadSnapshot: [], getStateData: [], presentationClone: [], totalEngineSetup: [],
      base64Decode: [], jsonParse: [], jsonStringify: [], base64Encode: [] };
    const stages = {};
    let initial, firstLoadMs;
    for (let index = 0; index < config.runs + config.warmup; index++) {
      const created = timed(() => new ClientSimulator());
      const simulator = created.value;
      try {
        collector?.begin('load');
        const loaded = timed(() => simulator.loadSnapshot({ stateData: input.stateData, winConditions: input.winConditions }));
        collector?.phase('snapshotSerialize');
        const serialized = timed(() => simulator.getStateData());
        collector?.phase('presentation');
        const projected = timed(() => new StateSerializer().deserialize(new Base64().decode(serialized.value)));
        const measured = collector?.end();
        const decoded = timed(() => new Base64().decode(input.stateData));
        const parsed = timed(() => JSON.parse(decoded.value));
        const json = timed(() => JSON.stringify(parsed.value));
        const encoded = timed(() => new Base64().encode(json.value));
        if (!initial) {
          firstLoadMs = Number(loaded.ms.toFixed(3));
          initial = { phase: simulator.state.phase, turn: simulator.state.turn, activePlayer: simulator.state.activePlayer,
            complete: simulator.complete, physicalCardCount: simulator.state.cardNames.length,
            playerIds: simulator.state.players.map(player => player.id),
            activeCardIds: simulator.state.players.map(player => player.active.cards.map(card => card.id)),
            handCardIds: simulator.state.players.map(player => player.hand.cards.map(card => card.id)),
            playableCardIds: simulator.state.players.map(player => player.playableCardIds),
            outputSha256: crypto.createHash('sha256').update(serialized.value).digest('hex') };
        }
        if (index >= config.warmup) {
          samples.constructor.push(created.ms);
          samples.loadSnapshot.push(loaded.ms);
          samples.getStateData.push(serialized.ms);
          samples.presentationClone.push(projected.ms);
          samples.totalEngineSetup.push(created.ms + loaded.ms + serialized.ms + projected.ms);
          samples.base64Decode.push(decoded.ms);
          samples.jsonParse.push(parsed.ms);
          samples.jsonStringify.push(json.ms);
          samples.base64Encode.push(encoded.ms);
          if (measured) for (const [name, entry] of Object.entries(measured)) {
            (stages[name] ||= { ms: [], calls: [] }).ms.push(entry.ms);
            stages[name].calls.push(entry.calls);
          }
        }
      } finally { simulator.cleanup(); }
    }
    report.fixtures.push({ file: path.relative(path.resolve(__dirname, '..'), input.file), name: input.name,
      snapshotSha256: crypto.createHash('sha256').update(input.stateData).digest('hex'),
      inputPhysicalCards: raw[1].cardNames.length, inputUniqueNames: new Set(raw[1].cardNames).size,
      inputFallbackNames: [...new Set(raw[1].cardNames)].filter(name => !StateSerializer.hasKnownCard(name)),
      firstLoadMs, initial,
      warm: Object.fromEntries(Object.entries(samples).map(([name, values]) => [name, summary(values)])),
      ...(collector ? { stages: Object.fromEntries(Object.entries(stages).map(([name, values]) => [name,
        { ...summary(values.ms), medianCalls: summary(values.calls).medianMs, p95Calls: summary(values.calls).p95Ms }])) } : {}) });
  }
  if (config.coldRuns) {
    const { spawnSync } = require('node:child_process');
    for (let index = 0; index < fixtures.length; index++) {
      const cold = { moduleImport: [], registry: [], constructor: [], loadSnapshot: [], getStateData: [], presentationClone: [], totalEngineSetup: [] };
      for (let run = 0; run < config.coldRuns; run++) {
        const child = spawnSync(process.execPath, [__filename, '--runs', '1', '--warmup', '0', '--variant', config.variant, fixtures[index].file],
          { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
        if (child.status !== 0) throw new Error(child.stderr || 'Cold profiler process failed.');
        const value = JSON.parse(child.stdout);
        cold.moduleImport.push(value.moduleImportMs); cold.registry.push(value.registryMs);
        for (const key of ['constructor', 'loadSnapshot', 'getStateData', 'presentationClone', 'totalEngineSetup']) {
          cold[key].push(value.fixtures[0].warm[key].medianMs);
        }
      }
      report.fixtures[index].cold = { runs: config.coldRuns,
        stages: Object.fromEntries(Object.entries(cold).map(([name, values]) => [name, summary(values)])) };
    }
  }
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (failure) { console.error(failure.message); process.exitCode = 1; }
}

module.exports = { main, fixture, summary, timed };
