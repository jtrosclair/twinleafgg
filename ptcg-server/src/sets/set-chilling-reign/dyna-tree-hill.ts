import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { HealEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage } from '../../game';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';

export class DynaTreeHill extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public set = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '135';

  public regulationMark = 'E';

  public name = 'Dyna Tree Hill';

  public fullName = 'Dyna Tree Hill CRE';
  
  public text = 'Pokémon (both yours and your opponent\'s) can\'t be healed.';
    
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    if (effect instanceof HealEffect && StateUtils.getStadiumCard(state) === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_STADIUM_EFFECT_BLOCKED(store, state, owner, effect.target, this)) {
        effect.preventDefault = true;
      }
    }

    return state;
  }



}
