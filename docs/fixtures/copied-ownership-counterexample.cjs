/* Non-shipping research: run from the repository root with Node. */
const assert = require('node:assert/strict');
const path = require('node:path');
const root = process.cwd();
const server = path.join(root, 'ptcg-server');
const tsNode = require(require.resolve('ts-node', { paths: [server] }));
const esbuild = require(require.resolve('esbuild', { paths: [path.join(root, 'cloudflare')] }));
tsNode.register({ transpileOnly: true, compilerOptions: { module: 'commonjs', target: 'es2018' } });
const src = path.join(server, 'src');
const { PokemonCard } = require(path.join(src, 'game/store/card/pokemon-card'));
const { PowerType } = require(path.join(src, 'game/store/card/pokemon-types'));
const { Player } = require(path.join(src, 'game/store/state/player'));
const { State } = require(path.join(src, 'game/store/state/state'));
const { AttackEffect } = require(path.join(src, 'game/store/effects/game-effects'));
const { cloneAttacks, openCopyAttackSession, resolveCopyAttackSessions } =
  require(path.join(src, 'game/store/prefabs/copy-attack-delegation'));

class AmbiguousSource extends PokemonCard {
  constructor() {
    super();
    this.name = this.fullName = 'Ambiguous source';
    this.set = 'TEST';
    this.attacks = [{ name: 'Ambiguous attack', cost: [], damage: 40, text: 'Apply its attack bonus.' }];
    this.powers = [{ name: 'Ambiguous Ability', powerType: PowerType.ABILITY, text: 'Apply its Ability bonus.' }];
  }
  reduceEffect(_store, state, effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) effect.damage += 10;
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) effect.damage += 40;
    return state;
  }
}

const a = new AmbiguousSource(), b = new AmbiguousSource();
assert.equal(a.reduceEffect, b.reduceEffect);
assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
function direct(card) {
  const effect = new AttackEffect(new Player(), new Player(), card.attacks[0]);
  card.reduceEffect(null, new State(), effect);
  return effect.damage;
}
function delegated(card) {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent];
  const copycat = new PokemonCard();
  player.active.cards = [copycat];
  const attacks = cloneAttacks(card.attacks);
  openCopyAttackSession(state, player, copycat, card, attacks, attacks[0]);
  const effect = new AttackEffect(player, opponent, attacks[0]);
  resolveCopyAttackSessions({}, state, effect);
  return effect.damage;
}
assert.equal(direct(a), 90); assert.equal(direct(b), 90);
assert.equal(delegated(a), 90); assert.equal(delegated(b), 90);

// External semantic assignments, absent from inputs and engine state.
// Both describe the same full direct damage; copied damage must differ.
const interpretationA = { attackBonus: 10, abilityBonus: 40 };
const interpretationB = { attackBonus: 40, abilityBonus: 10 };
assert.equal(a.attacks[0].damage + interpretationA.attackBonus, 50);
assert.equal(b.attacks[0].damage + interpretationB.attackBonus, 80);
console.log('Identical card data and handler; both direct results:', direct(a));
console.log('Current legacy delegation yields:', delegated(a), delegated(b));
console.log('Different externally intended copy results:', 50, 80);

const sourceA = 'function f(e) { if(e.ok) e.damage += 10; /* attack */ if(e.ok) e.damage += 40; /* ability */ }';
const sourceB = 'function f(e) { if(e.ok) e.damage += 10; /* ability */ if(e.ok) e.damage += 40; /* attack */ }';
const options = { minify: true, legalComments: 'none', loader: 'ts', target: 'es2020' };
assert.equal(esbuild.transformSync(sourceA, options).code, esbuild.transformSync(sourceB, options).code);
console.log('Swapping ordinary ownership comments produces identical minified code.');
