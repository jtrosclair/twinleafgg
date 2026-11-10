#!/usr/bin/env node
'use strict';

// Prepare the generated engine/metadata first: npm --prefix ptcg-play run prepare:simulator
// JSON goes to stdout; diagnostics go to stderr. No browser or network is used.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const Module = require('node:module');
const { performance } = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const engine = path.join(root, 'ptcg-server/browser');
const round = value => Number(value.toFixed(3));

function timed(run) {
  const start = performance.now();
  const value = run();
  return { value, ms: performance.now() - start };
}

function summary(samples) {
  const sorted = samples.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return {
    medianMs: round(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2),
    p95Ms: round(sorted[Math.ceil(sorted.length * 0.95) - 1]),
    minMs: round(sorted[0])
  };
}

function options(args) {
  const result = { runs: 40, warmup: 5, metadataRuns: 25, files: [] };
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === '--help' || argument === '-h') {
      console.log('Usage: node tools/profile-frontend-startup.cjs [--runs 40] [--warmup 5] [fixture ...]\n'
        + 'Fixtures: solution/public-puzzle JSON, gzipped JSON, or Base64 snapshot text.\n'
        + 'Default: four local solution fixtures plus tools/fixtures/deck-out-with-dengo.snapshot.json.gz.\n'
        + 'No downloads, DOM rendering, or production source changes. JSON stdout; diagnostics stderr.');
      return;
    }
    if (argument === '--runs' || argument === '--warmup') {
      const value = args[++index];
      const number = Number(value);
      if (!/^\d+$/.test(value || '') || !Number.isSafeInteger(number)
        || number < (argument === '--runs' ? 1 : 0)) {
        throw new Error(`${argument} requires ${argument === '--runs' ? 'a positive' : 'a nonnegative'} integer.`);
      }
      result[argument.slice(2)] = number;
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
  if (!fs.existsSync(file)) {
    throw new Error(`Missing local fixture: ${file}. The four local solution fixtures are ignored; pass an existing JSON, .json.gz, or snapshot text path.`);
  }
  const bytes = fs.readFileSync(file);
  const text = (file.endsWith('.gz') ? zlib.gunzipSync(bytes) : bytes).toString('utf8').trim();
  const value = /^[{"\[]/.test(text) ? JSON.parse(text) : text;
  const puzzle = value?.puzzle || value;
  const url = puzzle?.newWebviewUrl || puzzle?.webviewUrl;
  const stateData = typeof value === 'string' ? value : value?.stateData || puzzle?.stateData
    || (url && decodeURIComponent(new URL(url).hash.slice(1)));
  if (typeof stateData !== 'string' || !stateData.trim()) { throw new Error(`No Base64 snapshot found in ${file}.`); }
  return { file, name: puzzle?.name || path.basename(file), stateData: stateData.trim(), winConditions: puzzle?.winConditions };
}

function getCards(service) {
  let value, error;
  service.getCardsInfo().subscribe({ next: result => value = result, error: failure => error = failure });
  if (error) { throw error; }
  if (!value) { throw new Error('Embedded card metadata did not resolve synchronously.'); }
  return value;
}

function lifecycleProbe() {
  const { BehaviorSubject, Subject, of } = require(path.join(root, 'ptcg-play/node_modules/rxjs'));
  const { CardComponent } = require(path.join(root, 'ptcg-play/src/app/shared/cards/card/card.component.ts'));
  const { BoardComponent } = require(path.join(root, 'ptcg-play/src/app/table/board/board.component.ts'));
  const { BoardInteractionService } = require(path.join(root, 'ptcg-play/src/app/shared/services/board-interaction.service.ts'));
  const holo = new BehaviorSubject(true), names = new BehaviorSubject(false), overrides = new Subject();
  const card = new CardComponent({ overridesChanged$: overrides },
    { holoEnabled$: holo, showCardName$: names }, { resolve: value => value });
  card.ngOnInit();
  const observerCounts = () => ({ holo: holo.observers.length, names: names.observers.length, overrides: overrides.observers.length });
  const cardObserversBeforeDestroy = observerCounts();
  card.ngOnDestroy();
  const cardObserversAfterDestroy = observerCounts();
  names.next(true);
  Object.defineProperty(globalThis, 'document', { configurable: true, writable: true,
    value: { documentElement: { style: { setProperty() {} } } } });
  const handles = [], cardSize = new BehaviorSubject(100);
  const handle = () => {
    const result = { closed: false, unsubscribe() { this.closed = true; }, listen() { return of({ canDrop: false, isOver: false }); } };
    handles.push(result);
    return result;
  };
  const board = new BoardComponent({}, { dragSource: handle, dropTarget: handle }, {},
    { cardSize$: cardSize }, new BoardInteractionService());
  board.ngOnDestroy();
  return {
    method: 'Actual component constructors/lifecycle with Subject and DnD connection stubs; no DOM/layout.',
    cardObserversBeforeDestroy, cardObserversAfterDestroy,
    destroyedCardStillReceivesNameSetting: card.showCardName,
    boardCreatedDndHandles: handles.length,
    boardUnclosedDndHandles: handles.filter(item => !item.closed).length,
    boardCardSizeObserversAfterDestroy: cardSize.observers.length
  };
}

function main(args) {
  const config = options(args);
  if (!config) { return; }
  const fixtures = config.files.map(fixture);
  const metaDir = path.join(root, 'ptcg-play/src/assets/simulator');
  if (!fs.existsSync(path.join(engine, 'client/index.js')) || !fs.existsSync(path.join(metaDir, 'cards.hash.json'))) {
    throw new Error('Run npm --prefix ptcg-play run prepare:simulator before profiling.');
  }
  const restore = [], originalResolve = Module._resolveFilename, originalLog = console.log;
  const globals = ['__SIMULATOR_STATIC__', 'localStorage', 'document'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]);
  // Match the actual frontend service runner's browser-safe CJS aliases.
  Module._resolveFilename = function (request, parent, ...rest) {
    if (request === 'ptcg-server') { request = path.join(engine, 'browser.js'); }
    if (request === 'ptcg-server/client') { request = path.join(engine, 'client/index.js'); }
    return originalResolve.call(this, request, parent, ...rest);
  };
  console.log = (...values) => {
    if (values.length !== 1 || values[0] !== 'cards set') { console.error(...values); }
  };
  try {
    require(path.join(root, 'ptcg-server/node_modules/ts-node')).register({
      project: path.join(root, 'ptcg-play/tsconfig.json'), transpileOnly: true,
      compilerOptions: { module: 'commonjs', target: 'es2018', experimentalDecorators: true }
    });
    const imported = timed(() => ({
      ...require(path.join(engine, 'browser.js')), ...require(path.join(engine, 'client/index.js')),
      ...require(path.join(root, 'ptcg-play/src/app/api/services/game.service.ts')),
      ...require(path.join(root, 'ptcg-play/src/app/api/services/cards.service.ts')),
      ...require(path.join(root, 'ptcg-play/src/app/shared/cards/cards-base.service.ts')),
      ...require(path.join(root, 'ptcg-play/src/app/shared/session/session.service.ts'))
    }));
    const { StateSerializer, CardManager, ClientSimulator, GameService, CardsService, CardsBaseService, SessionService } = imported.value;
    const manifest = JSON.parse(fs.readFileSync(path.join(metaDir, 'cards.hash.json'), 'utf8'));
    const metadataText = fs.readFileSync(path.join(metaDir, `cards.${manifest.hash}.json`), 'utf8');
    const parsed = timed(() => JSON.parse(metadataText)), payload = parsed.value;
    Object.defineProperty(globalThis, '__SIMULATOR_STATIC__', { configurable: true, writable: true, value: { urls: {}, json: {
      'assets/simulator/cards.hash.json': manifest, [`assets/simulator/cards.${manifest.hash}.json`]: payload
    } } });
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, writable: true, value: { getItem: () => null } });
    const metadataService = () => new CardsService();
    const validated = timed(() => getCards(metadataService()));
    const catalog = new CardsBaseService({}, { resolve: value => value });
    const phases = {};
    function wrap(object, name, measure) {
      const original = object[name];
      object[name] = function (...values) { return measure(() => original.apply(this, values)); };
      restore.push(() => object[name] = original);
    }
    for (const [object, name] of [[catalog, 'sortCards'], [StateSerializer, 'setKnownCards'], [CardManager.prototype, 'defineSet']]) {
      wrap(object, name, run => {
        const start = performance.now();
        try { return run(); } finally { phases[name] = (phases[name] || 0) + performance.now() - start; }
      });
    }
    const registered = timed(() => catalog.loadCardsInfo(validated.value));
    const coldPhases = { ...phases };
    const cached = metadataService();
    getCards(cached);
    const replayTimes = [], validationTimes = [], catalogTimes = [];
    for (let index = 0; index < config.metadataRuns; index++) {
      replayTimes.push(timed(() => getCards(cached)).ms);
      validationTimes.push(timed(() => getCards(metadataService())).ms);
      catalogTimes.push(timed(() => catalog.loadCardsInfo(payload.cardsInfo)).ms);
    }
    let activeStats, deserializations = 0;
    for (const [object, name, label] of [
      [ClientSimulator.prototype, 'loadSnapshot', 'engineLoadSnapshot'],
      [ClientSimulator.prototype, 'getStateData', 'canonicalGetStateData'],
      [StateSerializer.prototype, 'deserialize', 'deserialize'],
      [GameService.prototype, 'publishState', 'publishPreparedState']
    ]) {
      wrap(object, name, run => {
        if (!activeStats) { return run(); }
        const phase = label === 'deserialize' ? (++deserializations === 1 ? 'engineDeserialize' : 'presentationDeserialize') : label;
        const start = performance.now();
        try { return run(); } finally { activeStats[phase] = (activeStats[phase] || 0) + performance.now() - start; }
      });
    }
    const report = {
      schemaVersion: 1, node: process.version, platform: `${process.platform}/${process.arch}`,
      method: 'Actual frontend services in Node CJS/ts-node, no browser, layout/paint, image loading or network. Nested spans overlap and include timer overhead. Cold is one fresh process with the OS file cache unchanged. Import includes CJS module loading and ts-node work, not browser bundle evaluation. Forced catalog rebuilds are not the normal surviving-page path.',
      runs: config.runs, warmup: config.warmup, metadataRuns: config.metadataRuns,
      metadataHash: manifest.hash, metadataBytes: Buffer.byteLength(metadataText), cards: catalog.getCards().length,
      cold: {
        cjsAndTsNodeImportMs: round(imported.ms), metadataJsonParseMs: round(parsed.ms),
        metadataValidationMs: round(validated.ms), catalogSetupMs: round(registered.ms),
        catalogNestedMs: Object.fromEntries(Object.entries(coldPhases).map(([name, value]) => [name, round(value)]))
      },
      warmMetadataValidation: summary(validationTimes), sameServiceMetadataHit: summary(replayTimes),
      warmCatalogRebuild: summary(catalogTimes), fixtures: []
    };
    for (const input of fixtures) {
      const session = new SessionService();
      let stateMessages = 0;
      const service = new GameService({ toast() {} }, session,
        { translations: { en: { GAME_MESSAGES: {} } }, currentLang: 'en', instant: value => value },
        { endBoardSelection() {}, updateGameLogs() {} }, { run: run => run() },
        { postMessage: message => { if (message.type === 'StateUpdate') { stateMessages++; } } });
      const samples = {};
      try {
        for (let index = 0; index < config.runs + config.warmup; index++) {
          activeStats = {}; deserializations = 0;
          const start = performance.now();
          let failure;
          service.createGameFromState(input.stateData, input.winConditions).subscribe({ error: error => failure = error });
          const overall = performance.now() - start;
          if (failure) { throw failure; }
          if (index >= config.warmup) {
            for (const [name, value] of Object.entries({ ...activeStats, fullGameServiceLoad: overall })) {
              (samples[name] || (samples[name] = [])).push(value);
            }
          }
          activeStats = undefined;
        }
        const game = session.session.gameStates[0], simulator = service.simulator;
        report.fixtures.push({
          file: path.relative(root, input.file), name: input.name,
          snapshotSha256: crypto.createHash('sha256').update(input.stateData).digest('hex'),
          sourceBytes: Buffer.byteLength(input.stateData), stateMessages,
          spans: Object.fromEntries(Object.entries(samples).map(([name, values]) => [name, summary(values)])),
          uiIndependent: {
            state: game.state !== simulator.state, player: game.state.players[0] !== simulator.state.players[0],
            activeList: game.state.players[0].active !== simulator.state.players[0].active,
            activeCard: !game.state.players[0].active.getPokemonCard()
              || game.state.players[0].active.getPokemonCard() !== simulator.state.players[0].active.getPokemonCard(),
            deckArray: game.state.players[0].deck.cards !== simulator.state.players[0].deck.cards
          }
        });
      } finally {
        activeStats = undefined;
        const game = session.session.gameStates[0];
        if (game) { service.removeGameState(game.gameId); }
      }
    }
    report.persistentViewLifecycle = lifecycleProbe();
    return report;
  } finally {
    restore.reverse().forEach(run => run());
    Module._resolveFilename = originalResolve;
    console.log = originalLog;
    for (const [name, descriptor] of globals) {
      if (descriptor) { Object.defineProperty(globalThis, name, descriptor); }
      else { delete globalThis[name]; }
    }
  }
}

if (require.main === module) {
  try {
    const report = main(process.argv.slice(2));
    if (report) { process.stdout.write(JSON.stringify(report, null, 2) + '\n'); }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = { main, options, fixture, summary };
