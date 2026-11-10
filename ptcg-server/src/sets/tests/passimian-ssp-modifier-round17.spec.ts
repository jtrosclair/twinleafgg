import { setupGame, padDeck } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

class Bonus extends TrainerCard {
  public name = 'Bonus'; public fullName = 'Bonus TST'; public set = 'TST'; public trainerType = TrainerType.STADIUM;
  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect) effect.damage += 30;
    return state;
  }
}
describe('Passimian SSP Coordinated Throwing modifiers', () => {
  for (const [name, move, energy] of [['Passimian SSP', 'Coordinated Throwing', 'Fighting Energy SVE'], ['Victini LOT', 'V-Beatdown', 'Fire Energy SVE']]) for (const copied of [false, true]) for (const bonus of [false, true]) {
    it(`${name}: ${copied ? 'copies' : 'uses'} the attack with bonus ${bonus}`, () => {
      const g = setupGame({turn: 2, player1: {
        active: {card: copied ? 'Mew ex 30C' : name, energy: [energy, 'Water Energy SVE']},
        bench: copied ? [{card:name}, {card:'Charmander BS'}] : [{card:'Charmander BS'}], deck: padDeck(10)
      }, player2: {active: {card:'Mew ex MEW'}, deck:padDeck(10)}});
      g.player2.active.getPokemonCard()!.resistance = [];
      if (bonus) g.player1.stadium.cards.push(new Bonus());
      if (copied) {g.overridePrompt('Choose attack', () => ({index:0, attack:move})); useAbility(g.store,g.state,0,'Memory Helix');}
      else useAttack(g.store,g.state,0,move);
      expect(g.player2.active.damage).toBe((copied ? 60 : 40) + (bonus ? 30 : 0));
    });
  }
});
