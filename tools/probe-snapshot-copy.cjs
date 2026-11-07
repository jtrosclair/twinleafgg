#!/usr/bin/env node
'use strict';
// Reproduce unchanged legacy serializer behavior against any compiled engine tree:
// node tools/probe-snapshot-copy.cjs /path/to/HEAD/ptcg-server/src
// node tools/probe-snapshot-copy.cjs ptcg-server/.client-card-regression
const assert = require('node:assert/strict');
const path = require('node:path');
if (!process.argv[2]) throw new Error('Pass a compiled engine directory containing game/ and sets/.');
const source = path.resolve(process.argv[2]);
const read = name => require(path.join(source, name));
const { Store } = read('game/store/store');
const { StateSerializer } = read('game/serializer/state-serializer');
const { State, GamePhase } = read('game/store/state/state');
const { Player } = read('game/store/state/player');
const { PokemonCardList } = read('game/store/state/pokemon-card-list');
const { CardList } = read('game/store/state/card-list');
const { AttackAction } = read('game/store/actions/game-actions');
const { ResolvePromptAction } = read('game/store/actions/resolve-prompt-action');
const { SpecialCondition } = read('game/store/card/card-types');
const { Arbiter } = read('game/core/arbiter');
const { Mimikyu } = read('sets/set-guardians-rising/mimikyu');
const { Squirtle } = read('sets/set-base-set/squirtle');
const { PsychicEnergy } = read('sets/set-scarlet-and-violet-energy/psychic-energy');
const { FireEnergy } = read('sets/set-scarlet-and-violet-energy/fire-energy');
StateSerializer.setKnownCards([new Mimikyu(), new Squirtle(), new PsychicEnergy(), new FireEnergy()]);
const state = new State();
state.phase = GamePhase.PLAYER_TURN;
state.turn = 7;
state.players = [new Player(), new Player()];
const add = (list, Constructor) => {
  const card = new Constructor();
  card.id = state.cardNames.length;
  state.cardNames.push(card.fullName);
  list.cards.push(card);
  return card;
};
for (const [index, player] of state.players.entries()) {
  player.id = index === 0 ? 43 : 42;
  player.name = 'Player ' + index;
  player.bench = Array.from({ length: 5 }, () => new PokemonCardList());
  player.prizes = Array.from({ length: 6 }, () => new CardList());
  player.prizes.forEach(prize => add(prize, FireEnergy));
  for (let i = 0; i < 8; i++) add(player.deck, FireEnergy);
  add(player.active, index === 0 ? Mimikyu : Squirtle);
}
for (const Constructor of [PsychicEnergy, FireEnergy]) {
  const card = add(state.players[0].active, Constructor);
  state.players[0].active.energies.cards.push(card);
}
const original = state.players[1].active.getPokemonCard();
state.playerLastAttack[42] = { attack: original.attacks[0], sourceCard: original };
const snapshot = new StateSerializer().serialize(state);
Math.random = () => 0.1;
function run(input) {
  const store = new Store({ onStateChange() {} });
  store.state = input; // The original server's actual load-snapshot boundary.
  store.state = store.dispatch(new AttackAction(43, 'Copycat'), 4);
  const arbiter = new Arbiter();
  for (let step = 0; step < 20; step++) {
    const prompt = store.state.prompts.find(item => item.result === undefined);
    if (!prompt) break;
    const action = prompt.type === 'WaitPrompt' ? new ResolvePromptAction(prompt.id, null)
      : arbiter.resolvePrompt(store.state, prompt);
    assert.ok(action, 'Unexpected prompt: ' + prompt.type);
    store.state = store.dispatch(action, 4);
  }
  const prior = store.state.playerLastAttack[42];
  return {
    damage: store.state.players[1].active.damage,
    paralyzed: store.state.players[1].active.specialConditions.includes(SpecialCondition.PARALYZED),
    attackIsSourceAttack: prior.attack === prior.sourceCard.attacks[0]
  };
}
const result = { engine: source, rawLive: run(state), snapshotLoaded: run(new StateSerializer().deserialize(snapshot)) };
console.log(JSON.stringify(result, null, 2));
assert.equal(result.rawLive.damage, 10);
assert.equal(result.snapshotLoaded.damage, 10);
assert.equal(result.rawLive.paralyzed, true);
assert.equal(result.snapshotLoaded.paralyzed, false);
assert.equal(result.rawLive.attackIsSourceAttack, true);
assert.equal(result.snapshotLoaded.attackIsSourceAttack, false);
