import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { State } from '../../game/store/state/state';
import { padDeck, setupGame } from './test-helpers';
import { createActiveDamageEffect, useAttack } from './card-test-helpers';

describe('Flittle SSP Splashing Dodge', () => {
  for (const heads of [false, true]) {
    it(`protects against damage and attack effects only on heads: ${heads}`, () => {
      const game = setupGame({ turn: 2, player1: { active: { card: 'Flittle SSP', energy: ['Psychic Energy SVE'] }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const reduce = game.store.reduceEffect.bind(game.store);
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipEffect) { effect.callback!(heads); return state; }
        return reduce(state, effect);
      });
      useAttack(game.store, game.state, 0, 'Splashing Dodge');
      const damage = createActiveDamageEffect(game, 1, { damage: 10 });
      game.store.reduceEffect(game.state, damage);
      expect(damage.preventDefault).toBe(heads);
      const placed = new PutCountersEffect(damage.attackEffect, 10);
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
      game.player2.active.preventDamageNextTurn = true;
      game.player2.active.preventEffectsOfAttacksNextTurn = true;
      const reduce = game.store.reduceEffect.bind(game.store);
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof CoinFlipEffect) { effect.callback!(true); return state; }
        return reduce(state, effect);
      });
      const attacker = game.player1.active.getPokemonCard()!;
      game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, attacker.attacks[0]));
      expect(game.player1.active.preventDamageNextTurnPending).toBe(true);
      expect(game.player1.active.preventEffectsOfAttacksNextTurnPending).toBe(true);
    });
  }
});
