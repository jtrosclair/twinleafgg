'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const project = path.resolve(__dirname, '..');
const compiled = path.join(project, 'browser');
const setsDirectory = path.join(compiled, 'sets');
const source = path.join(project, 'src');
const catalogue = require(path.join(compiled, 'client/cards.js')).ensureClientCards();
const { Card } = require(path.join(compiled, 'game/store/card/card.js'));
const { PokemonCard } = require(path.join(compiled, 'game/store/card/pokemon-card.js'));
const { Stage } = require(path.join(compiled, 'game/store/card/card-types.js'));
const stageOneLinks = [...new Set(catalogue.filter(card => card instanceof PokemonCard && card.stage === Stage.STAGE_1)
  .map(card => JSON.stringify([card.evolvesFrom, card.name])))].sort();

const catalogueHash = createHash('sha256').update(JSON.stringify(catalogue.map(card => card.fullName))).digest('hex');
const cardsTotal = catalogue.length;

const batchExports = new Map();
for (const match of fs.readFileSync(path.join(source, 'sets/index.ts'), 'utf8').matchAll(/^export \* from '(.+)';$/gm)) {
  const modulePath = match[1];
  const moduleExports = require(path.join(setsDirectory, modulePath));
  for (const [name, cards] of Object.entries(moduleExports)) {
    if (!Array.isArray(cards)) continue;
    assert.ok(!batchExports.has(name), `Ambiguous card batch ${name}`);
    batchExports.set(name, { modulePath, cards });
  }
}

// These smaller sets can share a download while keeping independent registry
// batches. Leave the usual puzzle sets in their own chunks.
const chunkGroups = {
  'cards-japanese-event-promos': [
    'setBattleRoadPromos', 'setGiftBoxMewLucario', 'setLPPromos',
    'setPCGLPromotionalCards', 'setPokeParkPremiumFiles', 'setVSPackAurasLucario',
  ],
  'cards-vintage-promos': [
    'setBestOfGame', 'setGameBoyExclusives', 'setNintendoPromos',
    'setUnnumberedPromos', 'setVendingSeries',
  ],
  'cards-small-theme-sets': [
    'setDetectivePikachu', 'setDoubleCrisis', 'setSouthernIslands',
  ],
  'cards-late-neo-sets': [
    'setNeoDestiny', 'setNeoDiscovery', 'setNeoRevelation',
  ],
};
const chunkByBatch = new Map(Object.entries(chunkGroups).flatMap(([chunk, names]) =>
  names.map(name => {
    assert.ok(batchExports.has(name), `Unknown batch ${name} for webpack chunk ${chunk}`);
    return [name, chunk];
  })
));

const definingBatch = new Map();
const batches = [...batchExports.keys()].sort().map((name, batch) => {
  const { modulePath, cards } = batchExports.get(name);
  cards.forEach((card, offset) => {
    if (!definingBatch.has(card)) definingBatch.set(card, [batch, offset]);
  });
  return { name, modulePath };
});

// Whole-catalogue queries must still see all executable template instances.
// At this revision each query module exports its one card class and no effect
// helper, so inherited reprints can be identified through constructor chains.
const setModules = Object.values(require.cache).filter(module => module.filename.startsWith(setsDirectory + path.sep));
const riskyClasses = new Set();
for (const module of setModules) {
  if (!/\.getAllCards\s*\(/.test(fs.readFileSync(module.filename, 'utf8'))) continue;
  const exports = [...new Set(Object.values(module.exports))];
  assert.ok(exports.length === 1 && typeof exports[0] === 'function' && exports[0].prototype instanceof Card,
    `Review catalogue-wide rule dependencies in ${module.filename}`);
  riskyClasses.add(exports[0]);
}
const needsCompleteCatalogue = card => {
  for (let constructor = card.constructor; typeof constructor === 'function'; constructor = Object.getPrototypeOf(constructor)) {
    if (riskyClasses.has(constructor)) return true;
  }
  return false;
};

const rows = catalogue.map(card => {
  const definition = definingBatch.get(card);
  assert.ok(definition, `Cannot locate executable source for ${card.fullName}`);
  return [card.fullName, ...definition, needsCompleteCatalogue(card) ? 1 : 0];
});
assert.equal(new Set(rows.map(([name]) => name)).size, rows.length);

const destination = path.join(project, 'browser-esm/client/card-catalogue.generated.js');
fs.writeFileSync(destination, [
  '// Generated from the executable registry by generate-incremental-card-catalogue.cjs.',
  `export const catalogueIdentity = ${JSON.stringify({ catalogueHash, cardsTotal })};`,
  'export const catalogueBatches = [',
  ...batches.map(({ name, modulePath }) => {
    const chunk = chunkByBatch.get(name);
    const hint = chunk === undefined ? '' : `/* webpackChunkName: ${JSON.stringify(chunk)} */ `;
    return `  { name: ${JSON.stringify(name)}, load: () => import(${hint}'../sets/${modulePath.slice(2)}').then(batch => batch.${name}) },`;
  }),
  '];',
  'export const catalogueRows = [',
  ...rows.map(row => `  ${JSON.stringify(row)},`),
  '];',
  'export const stageOneEvolutionLinks = [',
  ...stageOneLinks.map(row => `  ${row},`),
  '];',
  ''
].join('\n'));
console.log(`Generated ${rows.length} canonical cards, ${batches.length} executable batches, ${rows.filter(row => row[3]).length} catalogue-wide rule dependencies`);
