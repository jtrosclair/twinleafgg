import { CardTag } from '../../game/store/card/card-types';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { CoinFlipSequenceEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';

describe('Stakataka UNB', () => {
  it('registers the artwork-backed Ultra Beast printing', () => {
    const card = getCardByName('Stakataka UNB');
    expect([card.set, card.setNumber, card.tags]).toEqual(['UNB', '106', [CardTag.ULTRA_BEAST]]);
  });
  for (const [name, number] of [['Stakataka SMP', '180'], ['Stakataka2 SMP', '209']]) {
    it(`registers ${name} with the same attack and Ability`, () => {
      const card = getCardByName(name);
      expect([card.set, card.setNumber, card.tags]).toEqual(['SMP', number, [CardTag.ULTRA_BEAST]]);
      expect(card.attacks[0].name).toBe('Top Down');
      expect(card.powers[0].name).toBe('Wall of Stone');
      const g = setupGame({ player1: { active: { card: name }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, prizeCount: 3, deck: padDeck(10) } });
      const hp = new CheckHpEffect(g.player1, g.player1.active);
      g.store.reduceEffect(g.state, hp);
      expect(hp.hp).toBe(200);
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipSequenceEffect) { effect.callback([true, false]); return state; }
        return reduce(state, effect);
      });
      const active = g.player1.active.getPokemonCard()!;
      const top = g.player2.deck.cards[0];
      g.store.reduceEffect(g.state, new AttackEffect(g.player1, g.player2, active.attacks[0]));
      expect(g.player2.discard.cards).toEqual([top]);
    });
  }
  for (const count of [2, 3, 4, 6]) {
    it(`uses the opponent's ${count} prizes to check maximum HP`, () => {
      const g = setupGame({ player1: { active: { card: 'Stakataka UNB' }, prizeCount: 6, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, prizeCount: count, deck: padDeck(10) } });
      // Some upstream reducers pass the attacker as effect.player.
      const hp = new CheckHpEffect(g.player2, g.player1.active);
      g.store.reduceEffect(g.state, hp);
      expect(hp.hp).toBe(count <= 3 ? 200 : 120);
    });
  }
  it('does not apply its Ability when Ability use is blocked', () => {
    const g = setupGame({ player1: { active: { card: 'Stakataka UNB' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, prizeCount: 3, deck: padDeck(10) } });
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect) { throw new Error('Ability blocked'); }
      return reduce(state, effect);
    });
    const hp = new CheckHpEffect(g.player1, g.player1.active);
    g.store.reduceEffect(g.state, hp);
    expect(hp.hp).toBe(120);
  });
  it('respects Garbotoxin from an opponent’s Benched Garbodor with a Tool', () => {
    const g = setupGame({ player1: { active: { card: 'Stakataka UNB' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, bench: [{ card: 'Garbodor DRX', tools: ['Bravery Charm PAL'] }], prizeCount: 3, deck: padDeck(10) } });
    const hp = new CheckHpEffect(g.player1, g.player1.active);
    g.store.reduceEffect(g.state, hp);
    expect(hp.hp).toBe(120);
  });
  for (const heads of [0, 1, 3, 10]) {
    it(`discards the top cards for ${heads} heads, up to the deck size`, () => {
      const cards = ['Grass Energy SVE', 'Fire Energy SVE', 'Water Energy SVE', 'Lightning Energy SVE'];
      const g = setupGame({ player1: { active: { card: 'Stakataka UNB' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: cards } });
      const initial = g.player2.deck.cards.slice();
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipSequenceEffect) { expect(effect.mode).toBe('untilTails'); effect.callback([...Array(heads).fill(true), false]); return state; }
        return reduce(state, effect);
      });
      const card = g.player1.active.getPokemonCard()!;
      g.store.reduceEffect(g.state, new AttackEffect(g.player1, g.player2, card.attacks[0]));
      expect(g.player2.discard.cards).toEqual(initial.slice(0, heads));
      expect(g.player2.deck.cards).toEqual(initial.slice(heads));
    });
  }
  it('sends a discarded Prism Star to the Lost Zone', () => {
    const g = setupGame({ player1: { active: { card: 'Stakataka UNB' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: ['Jirachi Prism Star CES', 'Fire Energy SVE'] } });
    const prism = g.player2.deck.cards[0];
    const fire = g.player2.deck.cards[1];
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipSequenceEffect) { effect.callback([true, true, true, false]); return state; }
      return reduce(state, effect);
    });
    const card = g.player1.active.getPokemonCard()!;
    g.store.reduceEffect(g.state, new AttackEffect(g.player1, g.player2, card.attacks[0]));
    expect(g.player2.deck.cards.length).toBe(0);
    expect(g.player2.discard.cards).toEqual([fire]);
    expect(g.player2.lostzone.cards).toEqual([prism]);
  });
});
