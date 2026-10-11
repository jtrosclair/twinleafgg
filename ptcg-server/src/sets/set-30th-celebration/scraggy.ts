import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED, SHUFFLE_DECK, DRAW_CARDS, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Scraggy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = CardType.DARK;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Find Fault',
    cost: [CardType.DARK],
    damage: 0,
    text: 'Your opponent shuffles their hand into their deck. Then, your opponent draws 4 cards.'
  },
  {
    name: 'Headbutt',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Scraggy';
  public fullName: string = 'Scraggy 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Find Fault
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      MOVE_CARDS(store, state, opponent.hand, opponent.deck, { sourceCard: this });
      SHUFFLE_DECK(store, state, opponent);
      DRAW_CARDS(opponent, 4);
    }

    return state;
  }
}
