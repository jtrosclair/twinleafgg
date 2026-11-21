import { ensureClientCards } from '../../client/cards';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { endTurn, playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame, SetupGameResult } from './test-helpers';

const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const fighting = 'Fighting Energy SVE';
const lightning = 'Lightning Energy SVE';
const psychic = 'Psychic Energy SVE';
const needleEnergy = [grass, water, water];
const activeName = 'Finneon MT';

function conditions(game: SetupGameResult) {
  const seen: Array<{ turn: number; fromAttack: boolean; damage: number; conditions: SpecialCondition[] }> = [];
  const dispatch = game.store.reduceEffect.bind(game.store);
  spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect) {
      seen.push({ turn: state.turn, fromAttack: effect instanceof AddSpecialConditionsEffect,
        damage: effect.target.damage, conditions: effect.specialConditions });
    }
    return dispatch(state, effect);
  });
  return seen;
}

function roundTrip(game: SetupGameResult): State {
  const cards = game.state.players.flatMap(player => [
    ...[player.active, ...player.bench].flatMap(slot => [...slot.cards, ...slot.energies.cards, ...slot.tools]),
    ...[player.deck, player.hand, player.discard, player.lostzone, player.stadium, player.supporter, ...player.prizes]
      .flatMap(list => list.cards),
  ]);
  const unique = [...new Set(cards)];
  unique.forEach((card, index) => card.id = index);
  game.state.cardNames = unique.map(card => card.fullName);
  const serializer = new StateSerializer();
  const restored = serializer.deserialize(serializer.serialize(game.state));
  game.store.state = restored;
  return restored;
}

describe('Beedrill RR printed turn history', () => {
  beforeAll(ensureClientCards);

  for (const alwaysAttack of [true, false]) {
    it(`checks the previous turn across physical copies (${alwaysAttack})`, () => {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: 'Beedrill RR', energy: needleEnergy },
          bench: [{ card: 'Beedrill RR', energy: needleEnergy }], hand: ['Switch SVI'], deck: padDeck(12) },
        player2: { active: { card: activeName }, deck: padDeck(12) },
      });
      game.player2.active.getPokemonCard()!.hp = 999;
      game.player2.active.getPokemonCard()!.weakness = [];
      const observed = conditions(game);
      const original = game.player1.active.getPokemonCard();
      useAttack(game.store, game.state, 0, 'Needle Shock');
      expect(observed).toEqual([{ turn: 5, fromAttack: true, damage: 30,
        conditions: [SpecialCondition.PARALYZED, SpecialCondition.POISONED] }]);
      endTurn(game.store, game.state);
      playTrainerCard(game.store, game.state, 0, 'Switch SVI');
      expect(game.player1.active.getPokemonCard()).not.toBe(original);
      if (alwaysAttack) useAttack(game.store, game.state, 0, 'Needle Shock');
      else endTurn(game.store, game.state);
      expect(observed.map(event => event.turn)).toEqual([5]);
      endTurn(game.store, game.state);
      useAttack(game.store, game.state, 0, 'Needle Shock');
      expect(observed.map(event => event.turn)).toEqual(alwaysAttack ? [5] : [5, 9]);
      game.store.cleanup();
    });
  }

  it('records a copied Needle Shock for the copying player through a snapshot', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Mew ex MEW', energy: needleEnergy },
        bench: [{ card: 'Beedrill RR', energy: needleEnergy }], hand: ['Switch SVI'], deck: padDeck(12) },
      player2: { active: { card: 'Beedrill RR' }, deck: padDeck(12) },
    });
    const seen = conditions(game);
    game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Needle Shock' }));
    useAttack(game.store, game.state, 0, 'Genome Hacking');
    expect(seen.map(event => event.turn)).toEqual([5]);
    expect(game.player1.marker.hasMarker('CLEAR_NEEDLE_SHOCK_MARKER')).toBe(true);
    expect(game.player2.marker.hasMarker('CLEAR_NEEDLE_SHOCK_MARKER')).toBe(false);
    const restored = roundTrip(game);
    endTurn(game.store, restored);
    playTrainerCard(game.store, restored, 0, 'Switch SVI');
    useAttack(game.store, restored, 0, 'Needle Shock');
    expect(seen.map(event => event.turn)).toEqual([5]);
    game.store.cleanup();
  });

  it('recognizes and expires legacy card-scoped history when its owner passes', () => {
    const game = setupGame({
      turn: 7,
      player1: { active: { card: 'Beedrill RR', energy: needleEnergy },
        discard: ['Beedrill RR'], deck: padDeck(12) },
      player2: { active: { card: activeName }, deck: padDeck(12) },
    });
    const source = game.player1.discard.cards[0];
    game.player1.marker.addMarker('NEEDLE_SHOCK_MARKER', source);
    game.player1.marker.addMarker('CLEAR_NEEDLE_SHOCK_MARKER', source);
    const restored = roundTrip(game);
    expect(restored.players[0].marker.hasMarker('CLEAR_NEEDLE_SHOCK_MARKER')).toBe(true);
    endTurn(game.store, restored);
    expect(restored.players[0].marker.hasMarker('CLEAR_NEEDLE_SHOCK_MARKER')).toBe(false);
    expect(restored.players[0].marker.hasMarker('NEEDLE_SHOCK_MARKER')).toBe(false);
    game.store.cleanup();
  });

  it('limits Flutter Wings to once per copy and refreshes it on the next owner turn', () => {
    const game = setupGame({
      turn: 5,
      player1: { active: { card: 'Beedrill RR' }, bench: [{ card: 'Beedrill RR' }],
        hand: ['Switch SVI'], deck: ['Bulbasaur BS', 'Oddish JU', 'Exeggcute RG', ...padDeck(12)] },
      player2: { active: { card: activeName }, deck: padDeck(12) },
    });
    const choose = (name: string) => game.overridePrompt('Choose cards', prompt =>
      [(prompt as ChooseCardsPrompt).cards.cards.findIndex(card => card.fullName === name)]);
    choose('Bulbasaur BS');
    useAbility(game.store, game.state, 0, 'Flutter Wings');
    expect(game.player1.hand.cards.some(card => card.fullName === 'Bulbasaur BS')).toBe(true);
    expect(() => useAbility(game.store, game.state, 0, 'Flutter Wings')).toThrow();
    // A rejected action restores the store's saved state.
    const state = game.store.state;
    playTrainerCard(game.store, state, 0, 'Switch SVI');
    choose('Oddish JU');
    useAbility(game.store, state, 0, 'Flutter Wings');
    expect(state.players[0].hand.cards.some(card => card.fullName === 'Oddish JU')).toBe(true);
    endTurn(game.store, state);
    endTurn(game.store, state);
    game.overridePrompt('Choose cards', () => []);
    useAbility(game.store, state, 0, 'Flutter Wings');
    game.store.cleanup();
  });
});

const cancellationAttacks: Array<[string, string, string[], number, number]> = [
  ['Weezing DX', 'Smogscreen', [grass, water], 20, 1],
  ['Octillery M4', 'Corner Stop', [water], 30, 2],
  ['Octillery M4 17', 'Jet of Ink', [water], 30, 2],
  ['Hippopotas DP', 'Sand Attack', [fighting], 10, 1],
  ['Koffing HS', 'Smokescreen', [water], 10, 1],
  ['Koffing GE', 'Smogscreen', [psychic, water], 10, 1],
  ['Dustox PL', 'Smogscreen', [grass, water], 20, 1],
  ['Octillery UL', 'Ink Bomb', [water, water, water], 50, 1],
];

function cancellationGame(card: string, energy: string[], responseEnergy = [water, water], bench: string[] = []) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card, energy }, bench: [{ card: 'Squirtle BS' }], deck: padDeck(12) },
    player2: { active: { card: activeName, energy: responseEnergy }, bench: bench.map(card => ({ card, energy: [water, water] })),
      hand: ['Switch SVI', 'Switch SVI'], deck: padDeck(12) },
  });
  for (const player of game.state.players) {
    player.active.getPokemonCard()!.hp = 300;
    player.active.getPokemonCard()!.weakness = [];
  }
  return game;
}

function forceCoinFlips(game: SetupGameResult, results: boolean[]) {
  const seen: boolean[] = [];
  const reduceEffect = game.store.reduceEffect.bind(game.store);
  spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof CoinFlipEffect) {
      const result = results[seen.length] ?? true;
      seen.push(result);
      effect.forcedResult = result;
    }
    return reduceEffect(state, effect);
  });
  return seen;
}

describe('Printed Smokescreen and two-coin attack restrictions', () => {
  beforeAll(ensureClientCards);

  for (const [card, attack, energy, damage, flipCount] of cancellationAttacks) {
    for (const heads of [false, true]) {
      it(`${card} ${attack} checks exactly ${flipCount} coin flips before the response (${heads})`, () => {
        const game = cancellationGame(card, energy);
        const chosen = Array<boolean>(flipCount).fill(true);
        if (!heads) chosen[flipCount - 1] = false;
        const seen = forceCoinFlips(game, chosen);
        useAttack(game.store, game.state, 0, attack);
        expect(game.player2.active.damage).toBe(damage + (attack === 'Smogscreen' ? 10 : 0));
        expect(game.player2.active.coinFlipCancelAttackNextTurn).toBe(flipCount);
        useAttack(game.store, game.state, 1, 'Tackle');
        expect(game.state.activePlayer).toBe(0);
        expect(seen).toEqual(chosen);
        expect(game.player1.active.damage).toBe(heads ? 20 : 0);
        expect(game.player2.active.coinFlipCancelAttackNextTurn).toBe(0);
        game.store.cleanup();
      });
    }
    it(`${card} ${attack} respects protection from effects independently of damage`, () => {
      const game = cancellationGame(card, energy);
      game.player2.active.preventEffectsOfAttacksNextTurn = true;
      useAttack(game.store, game.state, 0, attack);
      expect(game.player2.active.damage).toBe(damage);
      expect(game.player2.active.specialConditions).toEqual([]);
      expect(game.player2.active.coinFlipCancelAttackNextTurn).toBe(0);
      game.store.cleanup();
    });
  }

  for (const [card, damage, type] of [
    ['Weezing DX', 20, grass], ['Koffing GE', 10, psychic], ['Dustox PL', 20, grass],
  ] as [string, number, string][]) {
    it(`${card} applies Smogscreen's Poison after its attack damage`, () => {
      const game = cancellationGame(card, [type, water]);
      const observed = conditions(game);
      useAttack(game.store, game.state, 0, 'Smogscreen');
      expect(observed).toEqual([{ turn: 5, fromAttack: true, damage, conditions: [SpecialCondition.POISONED] }]);
      game.store.cleanup();
    });
  }

  it('continues Octazooka for subsequent turns, without stacking when applied again', () => {
    const game = cancellationGame('Octillery PL', [water, water]);
    const seen = forceCoinFlips(game, [false, true, false]);
    useAttack(game.store, game.state, 0, 'Octazooka');
    useAttack(game.store, game.state, 1, 'Tackle');
    expect(game.player1.active.damage).toBe(0);
    useAttack(game.store, game.state, 0, 'Octazooka');
    useAttack(game.store, game.state, 1, 'Tackle');
    expect(game.player1.active.damage).toBe(20);
    endTurn(game.store, game.state);
    useAttack(game.store, game.state, 1, 'Tackle');
    expect(seen).toEqual([false, true, false]);
    expect(game.player1.active.damage).toBe(20);
    game.store.cleanup();
  });

  it('only keeps the saved Octazooka effect while the same target remains Active', () => {
    const game = cancellationGame('Octillery PL', [water, water], [water, water], ['Squirtle BS']);
    useAttack(game.store, game.state, 0, 'Octazooka');
    const state = roundTrip(game);
    const seen = forceCoinFlips(game, [false]);
    useAttack(game.store, state, 1, 'Tackle');
    expect(seen).toEqual([false]);
    endTurn(game.store, state);
    playTrainerCard(game.store, state, 1, 'Switch SVI');
    playTrainerCard(game.store, state, 1, 'Switch SVI');
    useAttack(game.store, state, 1, 'Tackle');
    expect(seen).toEqual([false]);
    expect(state.players[0].active.damage).toBe(20);
    game.store.cleanup();
  });

  it('rejects an unaffordable attack before flipping without consuming the turn', () => {
    const game = cancellationGame('Hippopotas DP', [fighting], []);
    const seen = forceCoinFlips(game, [false]);
    useAttack(game.store, game.state, 0, 'Sand Attack');
    expect(() => useAttack(game.store, game.state, 1, 'Tackle')).toThrow();
    expect(seen).toEqual([]);
    expect(game.state.activePlayer).toBe(1);
    expect(game.player2.active.coinFlipCancelAttackNextTurn).toBe(1);
    game.store.cleanup();
  });

  it('ends a failed Smokescreen attack before the Confusion coin flip', () => {
    const game = cancellationGame('Koffing HS', [water]);
    const seen = forceCoinFlips(game, [false]);
    useAttack(game.store, game.state, 0, 'Smokescreen');
    game.player2.active.addSpecialCondition(SpecialCondition.CONFUSED);
    useAttack(game.store, game.state, 1, 'Tackle');
    expect(seen).toEqual([false]);
    expect(game.player2.active.damage).toBe(10);
    expect(game.player1.active.damage).toBe(0);
    game.store.cleanup();
  });

  it('clears the restriction if the affected Pokémon goes to the Bench and comes back', () => {
    const game = cancellationGame('Octillery M4 17', [water], [water, water], ['Squirtle BS']);
    const seen = forceCoinFlips(game, [false, false]);
    useAttack(game.store, game.state, 0, 'Jet of Ink');
    playTrainerCard(game.store, game.state, 1, 'Switch SVI');
    playTrainerCard(game.store, game.state, 1, 'Switch SVI');
    expect(game.player2.active.getPokemonCard()?.fullName).toBe(activeName);
    useAttack(game.store, game.state, 1, 'Tackle');
    expect(seen).toEqual([]);
    expect(game.player1.active.damage).toBe(20);
    game.store.cleanup();
  });

  for (const [card, name, flips] of [
    ['Weezing DX', 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER', [false]],
    ['Octillery M4', 'OCTILLERY_M4_CORNER_STOP_MARKER', [true, false]],
    ['Hippopotas DP', PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN, [false]],
  ] as [string, string, boolean[]][]) {
    it(`restores and consumes the saved ${card} cancellation marker`, () => {
      const game = cancellationGame('Squirtle BS', [water]);
      const source = getCardByName(card);
      game.player1.discard.cards.push(source);
      game.player2.active.marker.addMarker(name, source);
      const saved = roundTrip(game);
      const seen = forceCoinFlips(game, flips);
      endTurn(game.store, saved);
      useAttack(game.store, saved, 1, 'Tackle');
      expect(seen).toEqual(flips);
      expect(saved.players[0].active.damage).toBe(0);
      if (card !== 'Hippopotas DP') expect(saved.players[1].active.marker.hasMarker(name)).toBe(false);
      game.store.cleanup();
    });
  }
});

describe('Sword & Shield printed collector aliases', () => {
  beforeAll(ensureClientCards);
  const entries: Array<[string, string, string, string[], number, number, number]> = [
    ['Galarian Ponyta SSH', '81', 'Psy Bolt', [psychic], 10, 70, 1],
    ['Clobbopus SSH', '111', 'Bind', [fighting], 20, 60, 2],
    ['Galvantula SSH', '71', 'Volt Wave', [lightning, water], 60, 100, 1],
    ['Galvantula SSH 71', '71', 'Volt Wave', [lightning, water], 60, 100, 1],
  ];

  for (const [card, number, attack, energy, damage, hp, retreat] of entries) {
    it(`${card} keeps its saved identity and applies printed Paralysis after damage`, () => {
      const definition = getCardByName(card) as PokemonCard;
      expect(definition.fullName).toBe(card);
      expect(definition.setNumber).toBe(number);
      expect(definition.hp).toBe(hp);
      expect(definition.retreat.length).toBe(retreat);
      const game = cancellationGame(card, energy);
      const observed = conditions(game);
      spyOn(Math, 'random').and.returnValue(0.1);
      useAttack(game.store, game.state, 0, attack);
      expect(observed).toEqual([{ turn: 5, fromAttack: true, damage, conditions: [SpecialCondition.PARALYZED] }]);
      game.store.cleanup();
    });
  }
});
