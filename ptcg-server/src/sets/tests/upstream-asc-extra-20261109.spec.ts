import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { createActiveDamageEffect, createDamageEffect } from './card-test-helpers';

describe('Ascended Heroes Poochyena, Noivern and Drampa', () => {
  it('registers the correct printed identities and evolution names', () => {
    const details = ['Poochyena ASC', 'Noivern ASC', 'Drampa ASC'].map(name => {
      const card = getCardByName(name);
      return [card.fullName, card.set, card.setNumber, (card as any).evolvesFrom || ''];
    });
    expect(details).toEqual([['Poochyena ASC', 'ASC', '128', ''], ['Noivern ASC', 'ASC', '157', 'Noibat'], ['Drampa ASC', 'ASC', '176', '']]);
  });

  for (const heads of [false, true]) {
    it(`applies Poochyena's Gnaw Off bonus only on heads: ${heads}`, () => {
      const game = setupGame({ player1: { active: { card: 'Poochyena ASC' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const reduce = game.store.reduceEffect.bind(game.store);
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipEffect) { effect.callback!(heads); return state; }
        return reduce(state, effect);
      });
      const card = game.player1.active.getPokemonCard()!;
      const attack = new AttackEffect(game.player1, game.player2, card.attacks[0]);
      game.store.reduceEffect(game.state, attack);
      expect(attack.damage).toBe(heads ? 50 : 30);
    });
  }

  it('Noivern still protects itself when the opposing Active has attack protection', () => {
    const game = setupGame({ turn: 2, player1: { active: { card: 'Noivern ASC' }, deck: padDeck(10) },
      player2: { active: { card: 'Flittle SSP' }, deck: padDeck(10) } });
    const flittle = game.player2.active.getPokemonCard()!;
    game.player2.active.marker.addMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, flittle, 'attack', 'pokemon');
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipEffect) { effect.callback!(true); return state; }
      return reduce(state, effect);
    });
    const card = game.player1.active.getPokemonCard()!;
    game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, card.attacks[0]));
    expect(game.player1.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, card)).toBe(true);
  });

  for (const heads of [false, true]) {
    it(`applies and expires Noivern's Agility protection on heads: ${heads}`, () => {
      const game = setupGame({ turn: 2, player1: { active: { card: 'Noivern ASC' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const reduce = game.store.reduceEffect.bind(game.store);
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipEffect) { effect.callback!(heads); return state; }
        return reduce(state, effect);
      });
      const card = game.player1.active.getPokemonCard()!;
      game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, card.attacks[0]));
      const damage = createActiveDamageEffect(game, 1, { damage: 30 });
      const effect = createDamageEffect(game, 1, { damage: 20 });
      game.store.reduceEffect(game.state, damage); game.store.reduceEffect(game.state, effect);
      expect(damage.preventDefault).toBe(heads); expect(effect.preventDefault).toBe(heads);
      game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
      const later = createActiveDamageEffect(game, 1, { damage: 30 });
      game.store.reduceEffect(game.state, later); expect(later.preventDefault).toBe(false);
    });
  }

  for (const tool of [false, true]) {
    it(`adds Noivern's Enhanced Blade bonus only with an attached Tool: ${tool}`, () => {
      const game = setupGame({ player1: { active: { card: 'Noivern ASC', tools: tool ? ['Bravery Charm PAL'] : [] }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const card = game.player1.active.getPokemonCard()!;
      const attack = new AttackEffect(game.player1, game.player2, card.attacks[1]);
      game.store.reduceEffect(game.state, attack);
      expect(attack.damage).toBe(tool ? 140 : 70);
    });
  }

  it('locks only Drampa’s Dragon Strike for its next turn and then clears it', () => {
    const game = setupGame({ turn: 2, player1: { active: { card: 'Drampa ASC' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    const card = game.player1.active.getPokemonCard()!;
    game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, card.attacks[1]));
    expect(game.player1.active.cannotUseAttacksNextTurnPending).toEqual(['Dragon Strike']);
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player1));
    expect(game.player1.active.cannotUseAttacksNextTurn).toEqual(['Dragon Strike']);
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
    expect(game.player1.active.cannotUseAttacksNextTurn).toEqual(['Dragon Strike']);
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player1));
    expect(game.player1.active.cannotUseAttacksNextTurn).toEqual([]);
  });
});
