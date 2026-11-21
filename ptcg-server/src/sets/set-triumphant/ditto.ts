import { PowerType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Ditto extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Dittobolic',
    powerType: PowerType.POKEBODY,
    text: 'The number of Benched Pokémon your opponent can have is now 4. If your opponent has 5 Benched Pokémon, your opponent must discard 1 of them and all cards attached to it.'
  }];

  public attacks = [{
    name: 'Sharp Point',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Ditto';
  public fullName: string = 'Ditto TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect) {
      const owner = state.players.find(player => StateUtils.isPokemonInPlay(player, this));
      if (owner && !IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        const opponent = StateUtils.getOpponent(state, owner);
        effect.limitBench(state.players.indexOf(opponent), 4);
      }
    }
    return state;
  }
}
