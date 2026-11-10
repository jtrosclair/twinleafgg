#!/usr/bin/env node
'use strict';

// Read-only, deterministic first-action comparison for saved PrizeMap puzzles.
// Usage: node tools/compare-puzzle-actions.cjs BASE_SOURCE CANDIDATE_SOURCE WEB_SOURCE
//   [--mode=all|both|trainers|attacks|abilities] [--limit=N] [--min-comparable=N] [--min-actions=N]
// Only aggregate card names and outcome counts are printed; puzzle contents are not written to disk.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');

const positional = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const options = Object.fromEntries(process.argv.slice(2).filter(arg => arg.startsWith('--')).map(arg => {
  const index = arg.indexOf('=');
  if (index < 3) throw new Error('Options must use --name=value');
  return [arg.slice(2, index), arg.slice(index + 1)];
}));
if (positional.length !== 3 || Object.keys(options).some(key => !['mode', 'limit', 'min-comparable', 'min-actions'].includes(key))) {
  throw new Error('Usage: compare-puzzle-actions.cjs BASE_SOURCE CANDIDATE_SOURCE WEB_SOURCE [--mode=all|both|trainers|attacks|abilities] [--limit=N] [--min-comparable=N] [--min-actions=N]');
}
const [base, candidate, web] = positional.map(value => path.resolve(value));
const mode = options.mode || 'both';
const limit = options.limit === undefined ? undefined : Number(options.limit);
const minComparable = options['min-comparable'] === undefined ? 1 : Number(options['min-comparable']);
const minActions = options['min-actions'] === undefined ? 1 : Number(options['min-actions']);
if (!['all', 'both', 'trainers', 'attacks', 'abilities'].includes(mode) ||
    (limit !== undefined && (!Number.isSafeInteger(limit) || limit <= 0)) ||
    !Number.isSafeInteger(minComparable) || minComparable <= 0 || !Number.isSafeInteger(minActions) || minActions <= 0) {
  throw new Error('Invalid mode, limit or minimum coverage');
}

function entry(root) {
  const file = name => JSON.stringify(path.join(root, 'ptcg-server/src', name));
  return `
import { ensureClientCards } from ${file('client/cards.ts')};
import { ClientSimulator } from ${file('client/simulator.ts')};
import { StateSerializer } from ${file('game/serializer/state-serializer.ts')};
import { AttackAction, UseAbilityAction } from ${file('game/store/actions/game-actions.ts')};
import { PlayCardAction, PlayerType, SlotType } from ${file('game/store/actions/play-card-action.ts')};
import { SuperType, TrainerType } from ${file('game/store/card/card-types.ts')};

export function signature(serialized: string, kind: string) {
  ensureClientCards();
  const parsed = JSON.parse(serialized);
  parsed[1].cardNames = parsed[1].cardNames.map((name: string) => {
    if (StateSerializer.hasKnownCard(name)) return name;
    return StateSerializer.normalizeCardName(name.replace('é', 'e')) || name;
  });
  const data = Buffer.from(JSON.stringify(parsed)).toString('base64');
  const initial = new ClientSimulator();
  const initialRandom = Math.random;
  const initialNow = Date.now;
  let initialSeed = 0x9e3779b9;
  Math.random = () => { initialSeed ^= initialSeed << 13; initialSeed ^= initialSeed >>> 17; initialSeed ^= initialSeed << 5; return (initialSeed >>> 0) / 4294967296; };
  Date.now = () => 1700000000000;
  try { initial.loadSnapshot({stateData: data}); } catch (error) { initial.cleanup(); throw error; }
  finally { Math.random = initialRandom; Date.now = initialNow; }
  const player = initial.state.players[0];
  if (initial.state.activePlayer !== 0 || initial.complete) { initial.cleanup(); return []; }
  const active = player.active.getPokemonCard();
  let candidates: any[];
  if (kind === 'attacks') {
    candidates = (active?.attacks || []).map((attack, index) => ({index, actionName:attack.name, name:active!.fullName + ' / ' + attack.name}));
  } else if (kind === 'abilities') {
    const slots = [{list:player.active, slot:SlotType.ACTIVE, slotIndex:0},
      ...player.bench.map((list, slotIndex) => ({list, slot:SlotType.BENCH, slotIndex}))];
    candidates = slots.flatMap(({list, slot, slotIndex}, ordinal) => {
      const card = list.getPokemonCard();
      return (card?.powers || []).map((power, powerIndex) => ({index:ordinal * 1000 + powerIndex,
        actionName:power.name, name:card!.fullName + ' / ' + power.name,
        target:{player:PlayerType.BOTTOM_PLAYER, slot, index:slotIndex}, enabled:!!power.useWhenInPlay}))
        .filter(candidate => candidate.enabled);
    });
  } else {
    candidates = player.hand.cards.map((card, index) => ({card,index})).filter(({card}) =>
      card.superType === SuperType.TRAINER &&
      ((card as any).trainerType === TrainerType.ITEM || (card as any).trainerType === TrainerType.SUPPORTER) &&
      player.playableCardIds.includes(card.id)).map(({card,index}) => ({index, actionName:'', name:card.fullName}));
  }
  initial.cleanup();
  const results = [];
  for (const {index, actionName, name, target} of candidates) {
    const sim = new ClientSimulator();
    const oldRandom = Math.random;
    const oldNow = Date.now;
    let seed = (0x9e3779b9 ^ index) >>> 0;
    Math.random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
    Date.now = () => 1700000000000 + index;
    try {
      sim.loadSnapshot({stateData:data});
      if (kind === 'attacks') sim.dispatch(new AttackAction(sim.humanPlayerId, actionName));
      else if (kind === 'abilities') sim.dispatch(new UseAbilityAction(sim.humanPlayerId, actionName, target));
      else sim.dispatch(new PlayCardAction(sim.humanPlayerId, index, {player:PlayerType.BOTTOM_PLAYER, slot:SlotType.BOARD, index:0}));
      const state = sim.state;
      const markers = (marker: any) => marker.markers.map((m:any)=>[m.name,m.source?.id??null,m.sourceType??null,m.targetScope??null]);
      const slot = (p: any) => ({cards:p.cards.map((c:any)=>c.id),damage:p.damage,conditions:[...p.specialConditions].sort(),
        markers:markers(p.marker),
        restricted:[...p.cannotUseAttacksNextTurn].sort(),pending:[...p.cannotUseAttacksNextTurnPending].sort()});
      const prompt = (p: any) => ({type:p.type,message:p.message,options:p.options??null,filter:p.filter??null,
        cards:Array.isArray(p.cards) ? p.cards.map((c:any)=>c.id) : Array.isArray(p.cards?.cards) ? p.cards.cards.map((c:any)=>c.id) : null,
        energy:Array.isArray(p.energy) ? p.energy.map((e:any)=>[e.card?.id??null,e.provides]) : null});
      // Logs contain wall-clock timestamps; prompts contain runtime callbacks.
      // Compare the rest of the serializable state as well as prompt details.
      const snapshot = JSON.parse(new StateSerializer().serialize(state));
      snapshot[1].logs = [];
      snapshot[1].prompts = [];
      results.push({index,name,ok:true,phase:state.phase,turn:state.turn,activePlayer:state.activePlayer,
        winner:state.winner,complete:sim.complete,snapshot,
        prompts:state.prompts.filter(p => p.result === undefined && p.playerId === sim.humanPlayerId).map(prompt),
        zones:state.players.map(p => ({hand:p.hand.cards.map(c=>c.id),deck:p.deck.cards.map(c=>c.id),
          discard:p.discard.cards.map(c=>c.id),lost:p.lostzone.cards.map(c=>c.id),
          stadium:p.stadium.cards.map(c=>c.id),supporter:p.supporter.cards.map(c=>c.id),
          supporterTurn:p.supporterTurn,energyPlayedTurn:p.energyPlayedTurn,retreatedTurn:p.retreatedTurn,
          active:slot(p.active),bench:p.bench.map(slot),prizes:p.prizes.map(prize=>prize.cards.map(c=>c.id)),
          markers:markers(p.marker)}))});
    } catch (error) { results.push({index,name,ok:false,error:(error as Error)?.message || 'unknown'}); }
    finally {
      try { sim.cleanup(); } finally { Math.random = oldRandom; Date.now = oldNow; }
    }
  }
  return results;
}`;
}

function counter() {
  return {comparable:0, beforeOnlyError:0, afterOnlyError:0, bothError:0, actions:0,
    matching:0, succeededInBoth:0, rejectedInBoth:0, changed:0, noActions:0,
    changedCards:{}, changedFields:{}, rejectionReasons:{}};
}

// Report structural paths, never values, so a mismatch can be investigated
// without printing puzzle state or user data.
function differingFields(left, right) {
  const paths = new Set();
  const structuralKeys = new Set([
    'index', 'name', 'ok', 'error', 'phase', 'turn', 'activePlayer', 'winner', 'complete',
    'snapshot', 'prompts', 'zones', 'type', 'message', 'options', 'filter', 'cards', 'energy',
    'players', 'active', 'bench', 'hand', 'deck', 'discard', 'lostzone', 'stadium', 'supporter',
    'prizes', 'marker', 'markers', 'damage', 'conditions', 'specialConditions', 'source',
    'sourceType', 'targetScope', 'path', 'card', 'cardNames', 'gameStats', 'topPokemon',
    'pokemonDamageStats', 'cardId', 'supporterTurn', 'energyPlayedTurn', 'retreatedTurn',
    'cannotUseAttacksNextTurn', 'cannotUseAttacksNextTurnPending', 'restricted', 'pending',
    'playerLastAttack', 'lastAttack', 'sourceCard', 'attack', 'rules', 'gameSettings', 'winConditions'
  ]);
  function visit(a, b, current, depth) {
    if (paths.size >= 100 || JSON.stringify(a) === JSON.stringify(b)) return;
    if (depth >= 14 || !a || !b || typeof a !== 'object' || typeof b !== 'object' ||
      Array.isArray(a) !== Array.isArray(b)) {
      paths.add(current); return;
    }
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const part = Array.isArray(a) ? '[]' : (structuralKeys.has(key) ? `.${key}` : '.*');
      visit(a[key], b[key], current + part, depth + 1);
    }
  }
  visit(left, right, 'result', 0);
  return paths;
}

function compare(summary, before, after) {
  if (!before && !after) { summary.bothError++; return; }
  if (!before) { summary.beforeOnlyError++; return; }
  if (!after) { summary.afterOnlyError++; return; }
  summary.comparable++;
  if (!before.length && !after.length) summary.noActions++;
  const indices = new Set([...before.map(result => result.index), ...after.map(result => result.index)]);
  for (const index of indices) {
    summary.actions++;
    const left = before.find(result => result.index === index);
    const right = after.find(result => result.index === index);
    if (JSON.stringify(left) === JSON.stringify(right)) {
      summary.matching++;
      if (left?.ok) summary.succeededInBoth++;
      else {
        summary.rejectedInBoth++;
        const knownReasons = new Set(['ACTION_IN_PROGRESS', 'NOT_ENOUGH_ENERGY', 'CANNOT_USE_POWER',
          'CANNOT_PLAY_THIS_CARD', 'BLOCKED_BY_EFFECT', 'BLOCKED_BY_ABILITY', 'INVALID_TARGET',
          'SUPPORTER_ALREADY_PLAYED', 'NOT_YOUR_TURN', 'ILLEGAL_ACTION']);
        const reason = knownReasons.has(left?.error) ? left.error : 'OTHER_ERROR';
        summary.rejectionReasons[reason] = (summary.rejectionReasons[reason] || 0) + 1;
      }
      continue;
    }
    summary.changed++;
    const name = left?.name || right?.name || '(unknown card)';
    const difference = !left ? 'new candidate' : !right ? 'missing candidate'
      : !left.ok && right.ok ? 'now succeeds' : left.ok && !right.ok ? 'now fails' : 'result changed';
    const key = `${name} / ${difference}`;
    summary.changedCards[key] = (summary.changedCards[key] || 0) + 1;
    for (const field of differingFields(left, right)) {
      summary.changedFields[field] = (summary.changedFields[field] || 0) + 1;
    }
  }
}

async function main() {
  const requireWeb = createRequire(path.join(web, 'package.json'));
  const dotenvFile = path.join(web, '.env');
  const env = fs.existsSync(dotenvFile) ? requireWeb('dotenv').parse(fs.readFileSync(dotenvFile)) : {};
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || env.DIRECT_URL || env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Missing database connection');
  requireWeb('tsx/cjs/api').register();
  const { normalizeSimulatorValidationState } = require(path.join(web, 'lib/simulator-gzip.ts'));
  const { Client } = requireWeb('pg');
  const requireCloudflare = createRequire(path.join(__dirname, '../cloudflare/package.json'));
  const esbuild = requireCloudflare('esbuild');
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'prizemap-action-compare-'));
  const db = new Client({connectionString:databaseUrl, connectionTimeoutMillis:12000, application_name:'prizemap-readonly-action-comparison'});
  const kinds = mode === 'all' ? ['trainers', 'attacks', 'abilities'] : mode === 'both' ? ['trainers', 'attacks'] : [mode];
  const totals = () => ({rows:0, skipped:0, missingFragment:0, invalidPayload:0, unsupportedFormat:0,
    modes:Object.fromEntries(kinds.map(kind => [kind, counter()]))});
  const summary = totals();
  summary.active = totals();
  summary.minimumCoverage = {comparable:minComparable, actions:minActions};
  try {
    const runners = [base, candidate].map((root, index) => {
      const output = path.join(temporary, `source-${index}.cjs`);
      esbuild.buildSync({stdin:{contents:entry(root), resolveDir:root, sourcefile:'puzzle-action-comparison.ts', loader:'ts'},
        bundle:true, platform:'node', format:'cjs', target:'node20', outfile:output, logLevel:'silent'});
      return require(output);
    });
    await db.connect();
    await db.query('BEGIN READ ONLY');
    await db.query("SET LOCAL statement_timeout = '30s'");
    const puzzles = (await db.query('SELECT "webviewUrl" AS old, "newWebviewUrl" AS updated, "deleted" IS NULL AS active FROM "Puzzle" ORDER BY "id"')).rows;
    const created = (await db.query('SELECT "boardUrl" AS board, "deleted" IS NULL AS active FROM "CreatedPuzzle" ORDER BY "id"')).rows;
    await db.query('ROLLBACK');
    const rows = [...puzzles.map(p => ({url:p.updated || p.old, active:p.active})),
      ...created.map(p => ({url:p.board, active:p.active}))];
    const originalLog = console.log;
    console.log = () => {};
    try {
      for (const {url, active} of limit === undefined ? rows : rows.slice(0, limit)) {
        summary.rows++;
        if (active) summary.active.rows++;
        const skip = category => {
          summary.skipped++; summary[category]++;
          if (active) { summary.active.skipped++; summary.active[category]++; }
        };
        if (typeof url !== 'string' || !url.includes('#')) { skip('missingFragment'); continue; }
        let json;
        try {
          const encoded = normalizeSimulatorValidationState(decodeURIComponent(url.slice(url.indexOf('#') + 1)));
          json = Buffer.from(encoded, 'base64').toString('utf8');
        } catch { skip('invalidPayload'); continue; }
        let state;
        try { state = JSON.parse(json); } catch { skip('invalidPayload'); continue; }
        if (!Array.isArray(state) || !Array.isArray(state[1]?.cardNames)) { skip('unsupportedFormat'); continue; }
        for (const kind of kinds) {
          let before, after;
          try { before = runners[0].signature(json, kind); } catch { /* counted below */ }
          try { after = runners[1].signature(json, kind); } catch { /* counted below */ }
          compare(summary.modes[kind], before, after);
          if (active) compare(summary.active.modes[kind], before, after);
        }
      }
    } finally { console.log = originalLog; }
    console.log(JSON.stringify(summary, null, 2));
    if (Object.values(summary.modes).some(result => result.comparable < minComparable || result.actions < minActions || result.changed ||
      result.beforeOnlyError || result.afterOnlyError || result.bothError)) process.exitCode = 1;
  } finally {
    await db.end().catch(() => {});
    fs.rmSync(temporary, {recursive:true, force:true});
  }
}

main().catch(error => {
  console.error(JSON.stringify({error:error.code || error.name, message:'Read-only action comparison failed'}));
  process.exitCode = 1;
});
