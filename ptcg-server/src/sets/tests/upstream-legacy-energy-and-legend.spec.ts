import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardTag, CardType } from '../../game/store/card/card-types';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { getCardByName, padDeck, PlayerConfig, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const lightning = 'Lightning Energy SVE';
const fire = 'Fire Energy SVE';
const metal = 'Metal Energy SVE';
const fighting = 'Fighting Energy SVE';
const special = 'Double Turbo Energy BRS';
const arceus = { card: 'Arceus V BRS' };
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const hand = { ...active, slot: SlotType.HAND };

function game(player1: PlayerConfig, player2: PlayerConfig = { active: arceus }) {
  return setupGame({
    turn: 5,
    player1: { bench: [{ card: 'Rookidee SSH' }], deck: padDeck(16), ...player1 },
    player2: { deck: padDeck(16), ...player2 }
  });
}

describe('Physical attachment from deck and discard', () => {
  for (const card of ['Solgaleo-GX SUM', 'Solgaleo-GX UPR']) {
    for (const select of [true, false]) {
      it(`${card} shuffles after Sol Burst-GX ${select ? 'attaches two different Energy cards' : 'takes zero'}`, () => {
        const { store, player1, overridePrompt } = game({
          active: { card, energy: [metal] }, deck: [special, water, ...padDeck(16)]
        });
        const [selectedSpecial, selectedBasic] = player1.deck.cards;
        player1.marker.addMarkerToState(player1.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK);
        const shuffle = jasmine.createSpy('shuffle').and.callFake(() => player1.deck.cards.map((_, index) => index));
        overridePrompt('Shuffle deck', shuffle);
        overridePrompt('Attach energy', () => select ? [{ index: 0, to: active }, { index: 1, to: bench }] : []);
        store.dispatch(new AttackAction(player1.id, 'Sol Burst-GX'));
        expect(player1.usedGX).toBe(true);
        expect(shuffle).toHaveBeenCalledTimes(1);
        expect(player1.active.cards.includes(selectedSpecial)).toBe(select);
        expect(player1.bench[0].cards.includes(selectedBasic)).toBe(select);
        expect(player1.deck.cards.includes(selectedSpecial)).toBe(!select);
        expect(player1.deck.cards.includes(selectedBasic)).toBe(!select);
      });
    }
  }

  for (const select of [true, false]) {
    it(`Energy Glide ${select ? 'switches after moving the selected Lightning Energy' : 'shuffles without switching when the search fails'}`, () => {
      const { store, player1, overridePrompt } = game({
        active: { card: 'Emolga-EX XY', energy: [water] }, deck: [lightning, ...padDeck(16)]
      });
      const selected = player1.deck.cards[0];
      const emolga = player1.active.getPokemonCard();
      const shuffle = jasmine.createSpy('shuffle').and.callFake(() => player1.deck.cards.map((_, index) => index));
      const choose = jasmine.createSpy('switch').and.callFake(() => {
        expect(shuffle).toHaveBeenCalledTimes(1);
        return [bench];
      });
      overridePrompt('Attach energy', () => select ? [{ index: 0, to: active }] : []);
      overridePrompt('Shuffle deck', shuffle);
      overridePrompt('Choose pokemon', choose);
      store.dispatch(new AttackAction(player1.id, 'Energy Glide'));
      expect(shuffle).toHaveBeenCalledTimes(1);
      expect(choose).toHaveBeenCalledTimes(select ? 1 : 0);
      const slot = select ? player1.bench[0] : player1.active;
      expect(slot.getPokemonCard()).toBe(emolga);
      expect(slot.cards.includes(selected)).toBe(select);
      expect(player1.deck.cards.includes(selected)).toBe(!select);
    });
  }

  it('Never Give Up requires and attaches every eligible Lightning Energy across targets', () => {
    const { store, player1, overridePrompt } = game({
      active: { card: 'Raichu UNB', energy: [water] }, discard: [lightning, water, lightning]
    }, { active: arceus, prizeCount: 3 });
    const [first, other, third] = player1.discard.cards;
    overridePrompt('Attach energy', prompt => {
      const { options } = prompt as AttachEnergyPrompt;
      expect(options.min).toBe(2);
      expect(options.max).toBe(2);
      return [{ index: 0, to: active }, { index: 2, to: bench }];
    });
    store.dispatch(new AttackAction(player1.id, 'Never Give Up'));
    expect(player1.active.cards.includes(first)).toBe(true);
    expect(player1.bench[0].cards.includes(third)).toBe(true);
    expect(player1.discard.cards).toEqual([other]);
  });

  it('Never Give Up rejects a Prize deficit of only two', () => {
    const { store, player1 } = game({
      active: { card: 'Raichu UNB', energy: [water] }, discard: [lightning]
    }, { active: arceus, prizeCount: 4 });
    expect(() => store.dispatch(new AttackAction(player1.id, 'Never Give Up'))).toThrow();
    expect(player1.discard.cards.length).toBe(1);
  });

  for (const count of [1, 2, 3]) {
    it(`Radiant Star takes the required number from ${count} eligible cards against two Pokémon`, () => {
      const { store, player1, overridePrompt } = game({
        active: { card: 'Solgaleo ◇ UPR', energy: [metal] }, discard: [...Array(count).fill(metal), water]
      }, { active: arceus, bench: [{ card: 'Rookidee SSH' }] });
      const amount = Math.min(2, count);
      const selected = player1.discard.cards.slice(0, amount);
      const rest = player1.discard.cards.slice(amount);
      overridePrompt('Attach energy', prompt => {
        const { options } = prompt as AttachEnergyPrompt;
        expect(options.min).toBe(amount);
        expect(options.max).toBe(amount);
        return selected.map((_, index) => ({ index, to: index === 0 ? bench : active }));
      });
      store.dispatch(new AttackAction(player1.id, 'Radiant Star'));
      expect(player1.bench[0].cards.includes(selected[0])).toBe(true);
      if (selected[1]) expect(player1.active.cards.includes(selected[1])).toBe(true);
      expect(player1.discard.cards).toEqual(rest);
    });
  }

  for (const eligible of [true, false]) {
    it(`Mend ${eligible ? 'attaches the selected Metal Energy before healing' : 'cannot heal with no Metal Energy to attach'}`, () => {
      const { player1, store, overridePrompt } = game({
        active: { card: 'Steelix GL RR', energy: [water, water], damage: 30 },
        discard: [eligible ? 'Metal Energy SW' : water]
      });
      const selected = player1.discard.cards[0];
      const prompt = jasmine.createSpy('Mend').and.callFake((raw: AttachEnergyPrompt) => {
        expect((raw as AttachEnergyPrompt).options.min).toBe(1);
        return [{ index: 0, to: active }];
      });
      overridePrompt('Attach energy', prompt);
      store.dispatch(new AttackAction(player1.id, 'Mend'));
      expect(prompt).toHaveBeenCalledTimes(eligible ? 1 : 0);
      expect(player1.active.cards.includes(selected)).toBe(eligible);
      expect(player1.discard.cards.includes(selected)).toBe(!eligible);
      expect(player1.active.damage).toBe(eligible ? 20 : 30);
    });
  }

  it('Gather Sand moves a Basic Fighting Energy from discard and makes Grind usable', () => {
    const { store, player1, player2, overridePrompt } = game({
      active: { card: 'Trapinch RR' }, discard: [fighting]
    });
    const selected = player1.discard.cards[0];
    overridePrompt('Attach energy', () => [{ index: 0, to: active }]);
    store.dispatch(new UseAbilityAction(player1.id, 'Gather Sand', active));
    expect(player1.active.cards.includes(selected)).toBe(true);
    expect(player1.discard.cards.includes(selected)).toBe(false);
    store.dispatch(new AttackAction(player1.id, 'Grind'));
    expect(player2.active.damage).toBe(20);
  });

  it('Spreading Flames moves only selected Fire Energy to the chosen Pokémon', () => {
    const { store, player1, overridePrompt } = game({
      active: { card: 'Victini VMAX BST', energy: [water] }, discard: [fire, water, fire]
    });
    const [first, other, third] = player1.discard.cards;
    overridePrompt('Attach energy', () => [{ index: 0, to: bench }, { index: 2, to: active }]);
    store.dispatch(new AttackAction(player1.id, 'Spreading Flames'));
    expect(player1.active.cards.includes(third)).toBe(true);
    expect(player1.bench[0].cards.includes(first)).toBe(true);
    expect(player1.discard.cards).toEqual([other]);
  });

  it('Victini VMAX has 310 HP and Max Victory deals 220 against Pokémon V', () => {
    const { store, player1, player2 } = game({ active: { card: 'Victini VMAX BST', energy: [fire, fire] } },
      { active: { card: 'Mew VMAX FST' } });
    expect(player1.active.getPokemonCard()?.hp).toBe(310);
    store.dispatch(new AttackAction(player1.id, 'Max Victory'));
    expect(player2.active.damage).toBe(220);
  });

  for (const attach of [true, false]) {
    it(`Happy Chance calculates damage after ${attach ? 'moving the selected card' : 'declining the attachment'}`, () => {
      const { store, player1, player2, overridePrompt } = game({
        active: { card: 'Blissey MT', energy: [water] }, discard: [fire]
      });
      const selected = player1.discard.cards[0];
      overridePrompt('Attach energy', () => attach ? [{ index: 0, to: active }] : []);
      store.dispatch(new AttackAction(player1.id, 'Happy Chance'));
      expect(player1.active.cards.includes(selected)).toBe(attach);
      expect(player1.discard.cards.includes(selected)).toBe(!attach);
      expect(player2.active.damage).toBe(attach ? 40 : 30);
    });
  }
});

const first = ['Ho-Oh LEGEND HS', 'Ho-Oh LEGEND HS 112'];
const second = ['Raikou & Suicune LEGEND UL', 'Raikou & Suicune LEGEND UL 93'];
const lugia = ['Lugia LEGEND HS', 'Lugia LEGEND HS 114'];

describe('LEGEND assembly and rules', () => {
  for (const pair of [first, second, lugia]) {
    for (const index of [0, 1]) {
      it(`assembles ${pair[0]} from either half, chosen half ${index + 1}`, () => {
        const { store, player1, overridePrompt } = game({ active: arceus, hand: pair, bench: [] });
        const [top, bottom] = player1.hand.cards;
        overridePrompt('Confirm', () => false);
        store.dispatch(new UseAbilityAction(player1.id, 'Legend Assembly', { ...hand, index }));
        expect(player1.bench[0].cards).toEqual([bottom, top]);
        expect(player1.bench[0].getPokemonCard()?.id).toBe(top.id);
        expect(player1.bench[0].getPokemonCard()?.tags).toContain(CardTag.LEGEND);
      });
    }

    it(`rejects two copies of the same ${pair[0]} half`, () => {
      const { store, player1 } = game({ active: arceus, hand: [pair[0], pair[0]], bench: [] });
      expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Legend Assembly', hand))).toThrow();
      expect(player1.hand.cards.length).toBe(2);
    });

    it(`awards the printed Prize count on a Knock Out of ${pair[0]}`, () => {
      const { store, player1, player2, overridePrompt } = game({
        active: arceus, hand: [...pair, 'Switch SVI'], bench: []
      }, { active: { card: 'Charizard ex OBF', energy: [fire, fire] } });
      overridePrompt('Confirm', () => false);
      store.dispatch(new UseAbilityAction(player1.id, 'Legend Assembly', hand));
      overridePrompt('Choose pokemon', () => [bench]);
      store.dispatch(new PlayCardAction(player1.id, 0, { ...active, slot: SlotType.BOARD }));
      const target = player1.active.getPokemonCard();
      store.dispatch(new PassTurnAction(player1.id));
      store.dispatch(new AttackAction(player2.id, 'Burning Darkness'));
      expect(player1.discard.cards.some(card => card === target)).toBe(true);
      expect(player2.getPrizeLeft()).toBe(pair === second ? 4 : 5);
    });
  }

  it('checks Lightning and Water for Raikou & Suicune and both printed weaknesses', () => {
    const { state, store, player1 } = game({ active: { card: second[0] } });
    const query = new CheckPokemonTypeEffect(player1.active);
    store.reduceEffect(state, query);
    expect(query.cardTypes).toEqual([CardType.LIGHTNING, CardType.WATER]);
    expect(player1.active.getPokemonCard()?.weakness).toEqual([{ type: CardType.FIGHTING }, { type: CardType.LIGHTNING }]);
  });

  it('Sacred Rainbow changes Water and both units of Double Colorless to Fire', () => {
    const { state, store, player1 } = game({ active: { card: first[0], energy: [water, 'Double Colorless Energy HS'] } });
    const query = new CheckProvidedEnergyEffect(player1);
    store.reduceEffect(state, query);
    expect(query.energyMap.map(row => row.provides)).toEqual([[CardType.FIRE], [CardType.FIRE, CardType.FIRE]]);
    expect(getCardByName(water).name).toBe('Water Energy');
  });
});
