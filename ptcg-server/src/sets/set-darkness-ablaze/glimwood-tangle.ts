import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ConfirmPrompt } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCoinReflipEffect } from '../../game/store/effects/play-card-effects';

export class GlimwoodTangle extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public trainerType = TrainerType.STADIUM;
  public set = 'DAA';
  public name = 'Glimwood Tangle';
  public fullName = 'Glimwood Tangle DAA';

  public text = 'Once during each player\'s turn, after that player flips any coins for an attack, they may ignore all results of those coin flips and begin flipping those coins again.';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckAttackCoinReflipEffect && StateUtils.getStadiumCard(state) === this) {
      effect.sources.set(this.name, this);
    }
    return state;
  }
}
