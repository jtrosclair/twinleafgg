import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayerType, PlayCardAction, SlotType } from '../../game/store/actions/play-card-action';
import { CheckPrizesDestinationEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameWinner, State } from '../../game/store/state/state';
import { PokemonSlotConfig, SetupGameResult, padDeck, setupGame } from './test-helpers';

const dark = 'Darkness Energy SVE';
const light = 'Lightning Energy SVE';
const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const fight = 'Fighting Energy SVE';
const rookidee = 'Rookidee SSH';
const mew = 'Mew ex MEW';
const greninja = 'Radiant Greninja ASR';
const cofagrigus = 'Cofagrigus ex PAR';
const krookodile = 'Krookodile SIT 113';
const stoutland = 'Stoutland CEC';
const stunfisk = 'Stunfisk BKT';
const mantine = { card: 'Mantine FST 61', energy: [water, water, water] };
const miraidon = { card: 'Miraidon ex SVI', energy: [light, light, dark] };
const moon = { card: 'Roaring Moon ex PAR', energy: [dark, dark, dark] };
const regieleki = { card: 'Regieleki V SIT', energy: [light] };
const photon = 'Photon Blaster';
const gouge = 'Frenzied Gouging';
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const ownActive = { ...ownBench, slot: SlotType.ACTIVE };
const otherBench = { ...ownBench, player: PlayerType.TOP_PLAYER };
const otherActive = { ...ownActive, player: PlayerType.TOP_PLAYER };

function battle(attacker: PokemonSlotConfig, defender: PokemonSlotConfig, {
  bench = [{ card: mew }] as PokemonSlotConfig[], defenderBench = [{ card: greninja }] as PokemonSlotConfig[],
  attackerHand = [] as string[], defenderHand = [] as string[], prizes = 5
} = {}) {
  return setupGame({
    turn: 5,
    player1: { active: attacker, bench, deck: padDeck(12), hand: attackerHand, prizeCount: prizes },
    player2: { active: defender, bench: defenderBench, deck: padDeck(12), hand: defenderHand }
  });
}

function beforePrizes(battle: SetupGameResult, verify: () => void) {
  const reduce = battle.store.reduceEffect.bind(battle.store);
  const check = jasmine.createSpy('take Prizes').and.callFake(verify);
  spyOn(battle.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
    if (effect instanceof CheckPrizesDestinationEffect) check();
    return reduce(state, effect);
  });
  return check;
}

describe('Conditional attacks and Abilities on lethal attack damage', () => {
  it('does not search with Gold Coffin after Frenzied Gouging', () => {
    const { store, player1, player2, overridePrompt } = battle(moon, { card: cofagrigus }, { prizes: 2 });
    const search = jasmine.createSpy('search').and.returnValue([0]);
    overridePrompt('Choose cards', search);
    store.dispatch(new AttackAction(player1.id, gouge));
    expect(search).not.toHaveBeenCalled();
    expect(player2.hand.cards).toEqual([]);
    expect(store.state.winner).toBe(GameWinner.PLAYER_1);
  });

  for (const onBench of [false, true]) {
    it(`resolves Gold Coffin before Prizes from the ${onBench ? 'Bench' : 'Active Spot'}`, () => {
      const victim = { card: cofagrigus, damage: 220 };
      const game = onBench
        ? battle({ ...miraidon, card: 'Electivire ex DRI' }, { card: mew }, { defenderBench: [victim], prizes: 2 })
        : battle(miraidon, victim, { prizes: 2 });
      const { store, player1, player2, overridePrompt } = game;
      const selected = player2.deck.cards[1];
      const choose = jasmine.createSpy('search').and.callFake((prompt: ChooseCardsPrompt) => {
        expect(prompt.playerId).toBe(player2.id);
        expect(prompt.options.min).toBe(0);
        expect(prompt.options.max).toBe(1);
        return [1];
      });
      const shuffle = jasmine.createSpy('shuffle').and.callFake(() =>
        player2.deck.cards.map((_, index) => player2.deck.cards.length - 1 - index));
      const check = beforePrizes(game, () => {
        expect(player2.hand.cards).toEqual([selected]);
        expect(shuffle).toHaveBeenCalledTimes(1);
      });
      overridePrompt('Choose pokemon', () => [otherActive, otherBench]);
      overridePrompt('Choose cards', choose);
      overridePrompt('Shuffle deck', shuffle);
      store.dispatch(new AttackAction(player1.id, onBench ? 'Dual Bolt' : photon));
      expect(choose).toHaveBeenCalledTimes(1);
      expect(check).toHaveBeenCalledTimes(1);
      expect(store.state.winner).toBe(GameWinner.PLAYER_1);
    });
  }

  for (const confirmed of [true, false]) {
    it(`lets the Krookodile owner ${confirmed ? 'use' : 'decline'} Bully of the Sands before Prizes`, () => {
      const game = battle(miraidon, { card: krookodile }, { attackerHand: [water, grass], prizes: 1 });
      const { store, player1, player2, overridePrompt } = game;
      const card = player1.hand.cards[1];
      spyOn(Math, 'random').and.returnValue(0.99);
      const ask = jasmine.createSpy('confirm').and.callFake((prompt: ConfirmPrompt) => {
        expect(prompt.playerId).toBe(player2.id);
        return confirmed;
      });
      const check = beforePrizes(game, () => expect(player1.discard.cards.includes(card)).toBe(confirmed));
      overridePrompt('Confirm', ask);
      store.dispatch(new AttackAction(player1.id, photon));
      expect(ask).toHaveBeenCalledTimes(1);
      expect(check).toHaveBeenCalledTimes(1);
    });
  }

  it('does not offer the Krookodile Ability on direct Knock Out or lethal Bench damage', () => {
    const explicit = battle(moon, { card: krookodile }, { attackerHand: [water] });
    const bench = battle({ ...miraidon, card: 'Electivire ex DRI' }, { card: mew }, {
      defenderBench: [{ card: krookodile, damage: 120 }], attackerHand: [water]
    });
    for (const { game, attack } of [{ game: explicit, attack: gouge }, { game: bench, attack: 'Dual Bolt' }]) {
      const ask = jasmine.createSpy('confirm').and.returnValue(true);
      game.overridePrompt('Confirm', ask);
      if (attack === 'Dual Bolt') game.overridePrompt('Choose pokemon', () => [otherActive, otherBench]);
      game.store.dispatch(new AttackAction(game.player1.id, attack));
      expect(ask).not.toHaveBeenCalled();
      expect(game.player2.discard.cards.map(card => card.fullName)).toContain(krookodile);
    }
  });

  for (const { evolution, basic, discardHand } of [
    { evolution: krookodile, basic: 'Krokorok SIT 112', discardHand: true },
    { evolution: stoutland, basic: 'Herdier CEC', discardHand: false }
  ]) {
    it(`offers the printed optional discard after ${evolution} successfully evolves from the hand`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: basic }, { card: mew, energy: [dark] }, {
        attackerHand: [evolution], defenderHand: [water]
      });
      const discard = discardHand ? player2.hand.cards[0] : player2.active.energies.cards[0];
      const ask = jasmine.createSpy('confirm').and.callFake(() => {
        expect(player1.active.getPokemonCard()?.fullName).toBe(evolution);
        return true;
      });
      overridePrompt('Confirm', ask);
      overridePrompt('Choose energy', () => [0]);
      store.dispatch(new PlayCardAction(player1.id, 0, ownActive));
      expect(ask).toHaveBeenCalledTimes(1);
      expect(player2.discard.cards).toContain(discard);
    });
  }

  it('clears the old damage history before Stoutland is knocked out by Frenzied Gouging', () => {
    const { store, player1, player2, overridePrompt } = battle(regieleki, { card: stoutland }, { bench: [moon] });
    overridePrompt('Choose pokemon', () => [ownBench]);
    store.dispatch(new AttackAction(player1.id, 'Switching Bolt'));
    store.dispatch(new PassTurnAction(player2.id));
    const discard = jasmine.createSpy('discard Energy').and.returnValue([0]);
    overridePrompt('Choose energy', discard);
    store.dispatch(new AttackAction(player1.id, gouge));
    expect(discard).not.toHaveBeenCalled();
    expect(player1.active.energies.cards.length).toBe(3);
  });

  for (const confirmed of [false, true]) {
    it(`lets Stoutland ${confirmed ? 'discard' : 'leave'} Energy on the new Active after Crossing Cut-GX`, () => {
      const { store, player1, player2, overridePrompt } = battle(
        { card: 'Golisopod-GX BUS', energy: [grass, dark, dark] }, { card: stoutland, damage: 10 }, {
          bench: [{ card: mew, energy: ['Luminous Energy PAL', 'Jet Energy PAL'] }]
        });
      const energy = player1.bench[0].energies.cards[0];
      overridePrompt('Choose pokemon', () => [ownBench]);
      overridePrompt('Confirm', prompt => {
        expect(prompt.playerId).toBe(player2.id);
        return confirmed;
      });
      const choose = jasmine.createSpy('discard Energy').and.callFake((prompt: ChooseEnergyPrompt) => {
        expect(prompt.playerId).toBe(player2.id);
        return [prompt.energy.findIndex(item => item.card === energy)];
      });
      overridePrompt('Choose energy', choose);
      store.dispatch(new AttackAction(player1.id, 'Crossing Cut-GX'));
      expect(player1.active.getPokemonCard()?.fullName).toBe(mew);
      expect(choose).toHaveBeenCalledTimes(confirmed ? 1 : 0);
      expect(player1.discard.cards.includes(energy)).toBe(confirmed);
      expect(player1.active.energies.cards.includes(energy)).toBe(!confirmed);
    });
  }

  for (const { name, damage } of [{ name: gouge, damage: 220 }, { name: 'Calamity Storm', damage: 100 }]) {
    it(`deals the printed Revenge damage after ${name}`, () => {
      const { store, player1, player2 } = battle(moon, { card: rookidee }, {
        defenderBench: [{ card: stunfisk, energy: [light, water] }]
      });
      store.dispatch(new AttackAction(player1.id, name));
      store.dispatch(new AttackAction(player2.id, 'Revenge'));
      expect(player1.active.getPokemonCard()?.fullName).toBe(moon.card);
      expect(player1.active.damage).toBe(damage);
    });
  }

  for (const { card, energy, attack, priorDamage } of [
    { card: 'Marshadow M1L', energy: [fight, fight], attack: 'Shadowy Side Kick', priorDamage: 30 },
    { card: 'Beautifly LOT', energy: [grass], attack: 'Butterfly Edge', priorDamage: 40 }
  ]) {
    const attacker = { card, energy };
    it(`${attack} blocks damage exactly through the next opponent turn`, () => {
      const { store, player1, player2 } = battle(attacker, { card: rookidee, damage: priorDamage }, {
        defenderBench: [mantine]
      });
      store.dispatch(new AttackAction(player1.id, attack));
      expect(player2.discard.cards.map(card => card.fullName)).toContain(rookidee);
      store.dispatch(new AttackAction(player2.id, 'Wave Splash'));
      expect(player1.active.damage).toBe(0);
      store.dispatch(new PassTurnAction(player1.id));
      store.dispatch(new AttackAction(player2.id, 'Wave Splash'));
      expect(player1.active.damage).toBe(80);
    });

    it(`${attack} protects against explicit attack effects like Frenzied Gouging`, () => {
      const { store, player1, player2 } = battle(attacker, { card: rookidee, damage: priorDamage }, {
        defenderBench: [moon]
      });
      store.dispatch(new AttackAction(player1.id, attack));
      store.dispatch(new AttackAction(player2.id, gouge));
      expect(player1.active.getPokemonCard()?.fullName).toBe(card);
      expect(player1.active.damage).toBe(0);
    });

    it(`${attack} protects the Pokémon using Genome Hacking to copy it`, () => {
      const { store, player1, player2, overridePrompt } = battle({ card: mew, energy: [water, water, water] },
        { card, damage: card === 'Marshadow M1L' ? 30 : 100 }, { defenderBench: [mantine] });
      overridePrompt('Choose attack', () => ({ index: 0, attack }));
      store.dispatch(new AttackAction(player1.id, 'Genome Hacking'));
      expect(player2.discard.cards.map(card => card.fullName)).toContain(card);
      store.dispatch(new AttackAction(player2.id, 'Wave Splash'));
      expect(player1.active.damage).toBe(0);
    });

    it(`${attack} does not grant protection after a nonlethal hit`, () => {
      const { store, player1, player2 } = battle(attacker, mantine);
      store.dispatch(new AttackAction(player1.id, attack));
      store.dispatch(new AttackAction(player2.id, 'Wave Splash'));
      expect(player1.active.damage).toBe(80);
    });

    it(`${attack} permits damage from Shred through its protection`, () => {
      const { store, player1, player2 } = battle(attacker, { card: rookidee, damage: priorDamage }, {
        defenderBench: [{ card: 'Kingdra PRC', energy: [water] }]
      });
      store.dispatch(new AttackAction(player1.id, attack));
      store.dispatch(new AttackAction(player2.id, 'Shred'));
      expect(player1.active.damage).toBe(30);
    });
  }

  it('Butterfly Edge protects Beautifly after knocking out Robo Substitute without taking a Prize', () => {
    const { store, player1, player2 } = battle({ card: 'Beautifly LOT', energy: [grass] }, { card: 'Robo Substitute PHF' }, {
      defenderBench: [mantine]
    });
    store.dispatch(new AttackAction(player1.id, 'Butterfly Edge'));
    expect(player2.discard.cards.map(card => card.fullName)).toContain('Robo Substitute PHF');
    expect(player1.getPrizeLeft()).toBe(5);
    store.dispatch(new AttackAction(player2.id, 'Wave Splash'));
    expect(player1.active.damage).toBe(0);
  });

  it('Butterfly Edge remains inactive if damage would be lethal but Bide leaves 10 HP', () => {
    const { store, player1, player2 } = battle({ card: 'Seedot DP', damage: 20, energy: [dark] },
      { card: 'Beautifly LOT', energy: [grass] });
    spyOn(Math, 'random').and.returnValue(0.1);
    store.dispatch(new AttackAction(player1.id, 'Bide'));
    store.dispatch(new AttackAction(player2.id, 'Butterfly Edge'));
    expect(player1.active.getPokemonCard()?.fullName).toBe('Seedot DP');
    expect(player1.active.damage).toBe(40);
    expect(player2.active.preventDamageNextTurn).toBe(false);
    expect(player2.active.preventEffectsOfAttacksNextTurn).toBe(false);
  });
});
