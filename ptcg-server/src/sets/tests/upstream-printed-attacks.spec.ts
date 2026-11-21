import { ensureClientCards } from '../../client/cards';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const psychic = 'Psychic Energy SVE';
const lightning = 'Lightning Energy SVE';
const defender = 'Finneon MT';

function attackGame(card: string, energy: string[], bench: string[] = []) {
  const game = setupGame({
    turn: 5,
    player1: { active: { card, energy }, deck: padDeck(12) },
    player2: { active: { card: defender }, bench: bench.map(card => ({ card })), deck: padDeck(12) },
  });
  const target = game.player2.active.getPokemonCard()!;
  target.hp = 300;
  target.weakness = [];
  return game;
}

describe('Black & White collector-specific attacks', () => {
  beforeAll(ensureClientCards);

  const printed: Array<[string, string, number, number, Array<[string, CardType[], number]>]> = [
    ['Venipede BLW', '52', 70, 2, [['Ram', [CardType.PSYCHIC], 10], ['Rollout', [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], 30]]],
    ['Whirlipede BLW', '53', 90, 2, [['Poison Sting', [CardType.PSYCHIC, CardType.COLORLESS], 20], ['Rollout', [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS], 50]]],
    ['Zebstrika BLW', '43', 90, 1, [['Rear Kick', [CardType.COLORLESS], 30], ['Electrispark', [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING], 70]]],
    ['Musharna BLW', '49', 90, 2, [['Hypnotic Ray', [CardType.PSYCHIC], 20], ['Dream Eater', [CardType.PSYCHIC, CardType.PSYCHIC], 90]]],
    ['Patrat BLW 78', '78', 60, 1, [['Hyper Fang', [CardType.COLORLESS], 30]]],
  ];

  for (const [name, number, hp, retreat, attacks] of printed) {
    it(`preserves ${name}'s saved identity and exposes the printed attacks`, () => {
      const card = getCardByName(name) as PokemonCard;
      expect(card.fullName).toBe(name);
      expect(card.setNumber).toBe(number);
      expect(card.hp).toBe(hp);
      expect(card.retreat).toEqual(Array(retreat).fill(CardType.COLORLESS));
      expect(card.attacks.map(attack => [attack.name, attack.cost, attack.damage])).toEqual(attacks);
    });
  }

  it('does 10 damage with Venipede’s Ram without poisoning', () => {
    const game = attackGame('Venipede BLW', [psychic]);
    useAttack(game.store, game.state, 0, 'Ram');
    expect(game.player2.active.damage).toBe(10);
    expect(game.player2.active.specialConditions).toEqual([]);
    game.store.cleanup();
  });

  for (const copied of [false, true]) {
    it(`applies one counter of poison after Poison Sting damage (${copied ? 'copied' : 'direct'})`, () => {
      const game = attackGame(copied ? 'Mew ex MEW' : 'Whirlipede BLW', [psychic, psychic, psychic]);
      if (copied) {
        game.player2.active.cards[0] = getCardByName('Whirlipede BLW');
        game.player2.active.getPokemonCard()!.weakness = [];
        game.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Poison Sting' }));
      }
      const reduce = game.store.reduceEffect.bind(game.store);
      const application: Array<[number, number | undefined]> = [];
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof AddSpecialConditionsEffect) {
          application.push([effect.target.damage, effect.poisonDamage]);
          expect(effect.source).toBe(game.player1.active);
        }
        return reduce(state, effect);
      });
      useAttack(game.store, game.state, 0, copied ? 'Genome Hacking' : 'Poison Sting');
      expect(application).toEqual([[20, 10]]);
      expect(game.player2.active.damage).toBe(30);
      expect(game.player2.active.specialConditions).toContain(SpecialCondition.POISONED);
      game.store.cleanup();
    });
  }

  it('deals 70 to the Active and 10 to each Bench without applying Bench Weakness or Resistance', () => {
    const game = attackGame('Zebstrika BLW', [lightning, lightning, lightning], [defender, 'Squirtle BS']);
    game.player2.bench[0].getPokemonCard()!.weakness = [{ type: CardType.LIGHTNING }];
    game.player2.bench[1].getPokemonCard()!.resistance = [{ type: CardType.LIGHTNING, value: -30 }];
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PutDamageEffect && game.player2.bench.includes(effect.target)) {
        expect(game.player2.active.damage).toBe(70);
      }
      return reduce(state, effect);
    });
    useAttack(game.store, game.state, 0, 'Electrispark');
    expect(game.player2.active.damage).toBe(70);
    expect(game.player2.bench.map(slot => slot.damage)).toEqual([10, 10, 0, 0, 0]);
    expect(game.player2.active.specialConditions).toEqual([]);
    game.store.cleanup();
  });

  it('puts the defender to Sleep after Hypnotic Ray’s damage', () => {
    const game = attackGame('Musharna BLW', [psychic]);
    game.overridePrompt('Coin flip', () => false);
    useAttack(game.store, game.state, 0, 'Hypnotic Ray');
    expect(game.player2.active.damage).toBe(20);
    expect(game.player2.active.specialConditions).toContain(SpecialCondition.ASLEEP);
    game.store.cleanup();
  });

  for (const asleep of [false, true]) {
    it(`resolves Dream Eater against an ${asleep ? 'asleep' : 'awake'} defender`, () => {
      const game = attackGame('Musharna BLW', [psychic, psychic]);
      if (asleep) game.player2.active.addSpecialCondition(SpecialCondition.ASLEEP);
      useAttack(game.store, game.state, 0, 'Dream Eater');
      expect(game.player2.active.damage).toBe(asleep ? 90 : 0);
      game.store.cleanup();
    });
  }

  for (const heads of [false, true]) {
    it(`resolves Hyper Fang on ${heads ? 'heads' : 'tails'}`, () => {
      const game = attackGame('Patrat BLW 78', [psychic]);
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      game.overridePrompt('Coin flip', () => heads);
      useAttack(game.store, game.state, 0, 'Hyper Fang');
      expect(game.player2.active.damage).toBe(heads ? 30 : 0);
      expect(game.player2.active.specialConditions).toEqual([]);
      game.store.cleanup();
    });
  }
});

describe('Clefairy and Golduck printed conditions', () => {
  beforeAll(ensureClientCards);

  it('uses Clefairy RCL 74’s Shining Fingers and Magical Shot', () => {
    const clefairy = getCardByName('Clefairy RCL') as PokemonCard;
    expect(clefairy.setNumber).toBe('74');
    expect(clefairy.hp).toBe(60);
    expect(clefairy.attacks.map(attack => attack.name)).toEqual(['Shining Fingers', 'Magical Shot']);
    const game = attackGame('Clefairy RCL', [psychic]);
    game.overridePrompt('Coin flip', () => false);
    useAttack(game.store, game.state, 0, 'Shining Fingers');
    expect(game.player2.active.damage).toBe(0);
    expect(game.player2.active.specialConditions).toContain(SpecialCondition.ASLEEP);
    game.store.cleanup();
  });

  for (const accept of [false, true]) {
    it(`applies Break Beam's Confusion only after the bonus damage is chosen (${accept})`, () => {
      const game = attackGame('Golduck SW', [psychic, 'Water Energy SVE']);
      game.overridePrompt('Confirm', () => accept);
      const reduce = game.store.reduceEffect.bind(game.store);
      const confusion: number[] = [];
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        expect(effect instanceof AddSpecialConditionsPowerEffect).toBe(false);
        if (effect instanceof AddSpecialConditionsEffect) {
          expect(effect.target).toBe(game.player1.active);
          confusion.push(game.player2.active.damage);
        }
        return reduce(state, effect);
      });
      useAttack(game.store, game.state, 0, 'Break Beam');
      expect(game.player2.active.damage).toBe(accept ? 60 : 40);
      expect(confusion).toEqual(accept ? [60] : []);
      game.store.cleanup();
    });
  }
});
