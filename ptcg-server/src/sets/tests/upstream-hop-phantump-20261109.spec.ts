import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { createActiveDamageEffect, createDamageEffect } from './card-test-helpers';

describe('Hop’s Phantump ASC', () => {
  it('registers the real printing', () => {
    const card = getCardByName("Hop's Phantump ASC");
    expect([card.name, card.set, card.setNumber]).toEqual(["Hop's Phantump", 'ASC', '95']);
  });
  for (const heads of [false, true]) {
    it(`protects against the opponent’s attacks when heads is ${heads}`, () => {
      const game = setupGame({ turn: 2, player1: { active: { card: "Hop's Phantump ASC" }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const reduce = game.store.reduceEffect.bind(game.store);
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipEffect) { effect.callback!(heads); return state; }
        return reduce(state, effect);
      });
      const attack = new AttackEffect(game.player1, game.player2, game.player1.active.getPokemonCard()!.attacks[0]);
      game.store.reduceEffect(game.state, attack);
      const damage = createActiveDamageEffect(game, 1, { damage: 30 });
      game.store.reduceEffect(game.state, damage);
      expect(damage.preventDefault).toBe(heads);
      const placed = createDamageEffect(game, 1, { damage: 20 });
      game.store.reduceEffect(game.state, placed);
      expect(placed.preventDefault).toBe(heads);
      game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
      const later = createActiveDamageEffect(game, 1, { damage: 30 });
      game.store.reduceEffect(game.state, later);
      expect(later.preventDefault).toBe(false);
    });
  }
  it('still gains self-protection against an already protected opponent', () => {
    const game = setupGame({ turn: 2, player1: { active: { card: "Hop's Phantump ASC" }, deck: padDeck(10) }, player2: { active: { card: 'Flittle SSP' }, deck: padDeck(10) } });
    const flittle = game.player2.active.getPokemonCard()!;
    game.player2.active.marker.addMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, flittle, 'attack', 'pokemon');
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipEffect) { effect.callback!(true); return state; }
      return reduce(state, effect);
    });
    const phantump = game.player1.active.getPokemonCard()!;
    game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, phantump.attacks[0]));
    expect(game.player1.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, phantump)).toBe(true);
  });

});
