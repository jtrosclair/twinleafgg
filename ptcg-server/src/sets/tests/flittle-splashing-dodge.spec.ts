import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { padDeck, setupGame } from './test-helpers';
import { createActiveDamageEffect, createDamageEffect } from './card-test-helpers';

describe('Flittle SSP Splashing Dodge', () => {
  for (const heads of [false, true]) {
    it(`protects against damage and attack effects only on heads: ${heads}`, () => {
      const game = setupGame({ turn: 2, player1: { active: { card: 'Flittle SSP' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const reduce = game.store.reduceEffect.bind(game.store);
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipEffect) { effect.callback!(heads); return state; }
        return reduce(state, effect);
      });
      const flittle = game.player1.active.getPokemonCard()!;
      game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, flittle.attacks[0]));
      const damage = createActiveDamageEffect(game, 1, { damage: 10 });
      game.store.reduceEffect(game.state, damage);
      expect(damage.preventDefault).toBe(heads);
      const placed = createDamageEffect(game, 1, { damage: 10 });
      game.store.reduceEffect(game.state, placed);
      expect(placed.preventDefault).toBe(heads);
      game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
      const later = createActiveDamageEffect(game, 1, { damage: 30 });
      game.store.reduceEffect(game.state, later);
      expect(later.preventDefault).toBe(false);
    });
  }

  for (const attackingCard of ['Flittle SSP', 'Charcadet PAR']) {
  it(`${attackingCard} gains protection on heads even when the defending Pokémon has protection`, () => {
    const game = setupGame({ turn: 2, player1: { active: { card: attackingCard }, deck: padDeck(10) }, player2: { active: { card: "Hop's Phantump ASC" }, deck: padDeck(10) } });
    const phantump = game.player2.active.getPokemonCard()!;
    game.player2.active.marker.addMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, phantump, 'attack', 'pokemon');
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipEffect) { effect.callback!(true); return state; }
      return reduce(state, effect);
    });
    const attacker = game.player1.active.getPokemonCard()!;
    game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, attacker.attacks[0]));
    expect(game.player1.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, attacker)).toBe(true);
  });
  }
});
