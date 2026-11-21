import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayerType, PlayCardAction, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PlayerConfig, padDeck, setupGame } from './test-helpers';

const grass = 'Grass Energy SVE';
const metal = 'Metal Energy SVE';
const water = 'Water Energy SVE';
const fire = 'Fire Energy SVE';
const dark = 'Darkness Energy SVE';
const rainbow = 'Aurora Energy SSH';
const blend = 'Blend Energy WLFM DRX';
const adp = 'Arceus & Dialga & Palkia GX CEC';
const gxAttack = 'Altered Creation-GX';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const board = { ...active, slot: SlotType.BOARD };

function battle(left: PlayerConfig, right: PlayerConfig) {
  return setupGame({
    turn: 5,
    player1: { bench: [{ card: 'Mew ex MEW' }], deck: padDeck(16), ...left },
    player2: { bench: [{ card: 'Rookidee SSH' }], deck: padDeck(16), ...right }
  });
}

function captureFlips(store: ReturnType<typeof battle>['store']) {
  const results: boolean[] = [];
  const reduce = store.reduceEffect.bind(store);
  spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    const next = reduce(state, effect);
    if (effect instanceof CoinFlipEffect && effect.result !== undefined) results.push(effect.result);
    return next;
  });
  return results;
}

describe('Survival flips on final attack damage', () => {
  const beautifly = { card: 'Beautifly LOT', energy: [grass] };

  for (const { card, hp } of [
    { card: 'Mega Hawlucha ex M2a', hp: 250 },
    { card: 'Annihilape M5', hp: 150 },
    { card: 'Hoppip TRR', hp: 30 },
    { card: 'Skiploom TRR', hp: 60 }
  ]) {
    for (const heads of [true, false]) {
      it(`${card} resolves lethal damage on ${heads ? 'heads' : 'tails'}`, () => {
        const { store, player1, player2 } = battle(
          { active: beautifly }, { active: { card, damage: hp - 30 } });
        const results = captureFlips(store);
        spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);

        store.dispatch(new AttackAction(player1.id, 'Butterfly Edge'));
        expect(results).toEqual([heads]);
        expect(player1.active.preventDamageNextTurn).toBe(!heads);
        if (heads) {
          expect(player2.active.getPokemonCard()?.fullName).toBe(card);
          expect(player2.active.damage).toBe(hp - 10);
          expect(player1.getPrizeLeft()).toBe(6);
        } else {
          expect(player2.discard.cards.some(item => item.fullName === card)).toBe(true);
        }
      });
    }
  }

  it('Tenacious Body works after the full damage from Shred', () => {
    const { store, player1, player2 } = battle(
      { active: { card: "N's Zekrom M2a", energy: [dark, dark, dark] } },
      { active: { card: 'Mega Hawlucha ex M2a', damage: 180 } });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Shred'));
    expect(player2.active.damage).toBe(240);
    expect(player1.getPrizeLeft()).toBe(6);
  });

  it('Buffer does not offer a flip for the Knock Out from Frenzied Gouging', () => {
    const { store, player1, player2 } = battle(
      { active: { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] } },
      { active: { card: 'Skiploom TRR' } });
    const results = captureFlips(store);
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Frenzied Gouging'));
    expect(results).toEqual([]);
    expect(player2.discard.cards.some(card => card.fullName === 'Skiploom TRR')).toBe(true);
  });

  for (const holder of ['attacker', 'defender', 'hand']) {
    it(`checks Buffer under Time Crystal with Dialga G LV.X in the ${holder === 'hand' ? 'attacker’s hand' : holder + '’s Bench'}`, () => {
      const dialga = 'Dialga G LV.X PL';
      const { store, player1, player2 } = battle(
        {
          active: beautifly, bench: holder === 'attacker' ? [{ card: dialga }] : [{ card: 'Mew ex MEW' }],
          hand: holder === 'hand' ? [dialga] : []
        },
        {
          active: { card: 'Hoppip TRR' },
          bench: holder === 'defender' ? [{ card: dialga }] : [{ card: 'Rookidee SSH' }]
        });
      const results = captureFlips(store);
      spyOn(Math, 'random').and.returnValue(0.1);
      store.dispatch(new AttackAction(player1.id, 'Butterfly Edge'));
      expect(results).toEqual(holder === 'hand' ? [true] : []);
      expect(player2.discard.cards.some(card => card.fullName === 'Hoppip TRR')).toBe(holder !== 'hand');
    });
  }

  it('Time Crystal leaves a Pokémon SP Poké-Body available', () => {
    const { store, state, player2 } = battle(
      { active: beautifly, bench: [{ card: 'Dialga G LV.X PL' }] }, { active: { card: 'Toxicroak G PL' } });
    expect(IS_POKEBODY_BLOCKED(store, state, player2, player2.active.getPokemonCard()!)).toBe(false);
  });

  for (const { card, damage } of [
    { card: 'Hoppip TRR', damage: 0 }, { card: 'Skiploom TRR', damage: 10 }
  ]) {
    it(`${card} deals its printed damage before the Miracle Powder flip`, () => {
      const { store, player1, player2, overridePrompt } = battle(
        { active: { card, energy: [grass] } }, { active: { card: 'Rookidee SSH' } });
      const reduce = store.reduceEffect.bind(store);
      const damageAtFlip: number[] = [];
      spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipEffect) damageAtFlip.push(player2.active.damage);
        return reduce(state, effect);
      });
      spyOn(Math, 'random').and.returnValue(0.1);
      overridePrompt('Select', () => 1);
      store.dispatch(new AttackAction(player1.id, 'Miracle Powder'));
      expect(damageAtFlip).toEqual([damage]);
      expect(player2.active.damage).toBe(damage);
      expect(player2.active.specialConditions).toContain(SpecialCondition.CONFUSED);
    });
  }
});

describe('Altered Creation-GX pays for extra Water separately', () => {
  for (const { name, energy, bonus } of [
    { name: 'Metal alone', energy: [metal], bonus: false },
    { name: 'one Aurora Energy', energy: [rainbow], bonus: false },
    { name: 'one flexible Blend Energy', energy: [blend], bonus: false },
    { name: 'Metal and Water', energy: [metal, water], bonus: true },
    { name: 'Metal and a flexible Blend Energy', energy: [blend, metal], bonus: true },
    { name: 'Double Dragon Energy', energy: ['Double Dragon Energy ROS'], bonus: true },
  ]) {
    it(`checks distinct Energy units with ${name}`, () => {
      const { store, player1 } = battle({ active: { card: adp, energy } },
        { active: { card: 'Mew ex MEW' } });
      store.dispatch(new AttackAction(player1.id, gxAttack));
      expect(player1.alteredCreationDamage).toBe(true);
      expect(player1.usedGX).toBe(true);
      expect(player1.usedAlteredCreation).toBe(bonus);
    });
  }

  it('subtracts a Colorless cost increase before checking for extra Water', () => {
    const { store, player1 } = battle(
      { active: { card: adp, energy: [metal, water] } }, { active: { card: 'Mew ex MEW' } });
    player1.active.attackCostIncreaseDuringNextTurn = 1;
    store.dispatch(new AttackAction(player1.id, gxAttack));
    expect(player1.alteredCreationDamage).toBe(true);
    expect(player1.usedAlteredCreation).toBe(false);
  });

  it('uses the current types supplied by special Energy', () => {
    const { store, player1 } = battle(
      { active: { card: adp, energy: [metal, blend] }, hand: ['Temple of Sinnoh ASR'] },
      { active: { card: 'Mew ex MEW' } });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    store.dispatch(new AttackAction(player1.id, gxAttack));
    expect(player1.alteredCreationDamage).toBe(true);
    expect(player1.usedAlteredCreation).toBe(false);
  });

  for (const bonus of [false, true]) {
    it(`uses Nine-Tailed Shapeshifter's paid cost with ${bonus ? 'four' : 'three'} Energy`, () => {
      const energy = bonus ? [fire, fire, fire, water] : [fire, fire, water];
      const { store, player1, overridePrompt } = battle(
        { active: { card: 'Ninetales V RCL', energy } }, { active: { card: adp } });
      overridePrompt('Choose attack', () => ({ index: 0, attack: gxAttack }));
      store.dispatch(new AttackAction(player1.id, 'Nine-Tailed Shapeshifter'));
      expect(player1.alteredCreationDamage).toBe(true);
      expect(player1.usedAlteredCreation).toBe(bonus);
    });

    it(`uses Trace's paid cost for a delegated copy with ${bonus ? 'two' : 'one'} Water`, () => {
      const energy = bonus ? [water, water] : [water];
      const { store, player1, overridePrompt } = battle(
        { active: { card: 'Smeargle SW', energy } },
        { active: { card: 'Mew ex MEW' }, bench: [{ card: adp }] });
      spyOn(Math, 'random').and.returnValue(0.1);
      overridePrompt('Choose attack', () => ({ index: 0, attack: gxAttack }));
      store.dispatch(new AttackAction(player1.id, 'Trace'));
      expect(player1.alteredCreationDamage).toBe(true);
      expect(player1.usedAlteredCreation).toBe(bonus);
    });

    it(`uses the chosen attack's cost when Perfection ${bonus ? 'has spare Water' : 'uses its only Energy'}`, () => {
      const { store, player1, overridePrompt } = battle(
        { active: { card: 'Mewtwo & Mew-GX UNM', energy: bonus ? [metal, water] : [rainbow] }, discard: [adp] },
        { active: { card: 'Mew ex MEW' } });
      overridePrompt('Choose attack', () => ({ index: 0, attack: gxAttack }));
      store.dispatch(new UseAbilityAction(player1.id, 'Perfection', active));
      expect(player1.alteredCreationDamage).toBe(true);
      expect(player1.usedAlteredCreation).toBe(bonus);
    });
  }
});
