import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { AfterAttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_STADIUM_EFFECT_BLOCKED, PREVENT_AND_CLEAR_SPECIAL_CONDITIONS } from '../../game/store/prefabs/prefabs';
import type { Player } from '../../game/store/state/player';
import type { PokemonCardList } from '../../game/store/state/pokemon-card-list';

export class FestivalGrounds extends TrainerCard {

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '149';

  public trainerType = TrainerType.STADIUM;

  public set = 'TWM';

  public name = 'Festival Grounds';

  public fullName = 'Festival Grounds TWM';

  public text = 'Pokémon with any Energy attached cannot be affected by Special Conditions, and they recover from any Special Conditions.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof AfterAttachEnergyEffect || effect instanceof CheckTableStateEffect
      || effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect
      || effect instanceof UseStadiumEffect) || StateUtils.getStadiumCard(state) !== this) {
      return state;
    }
    if (effect instanceof UseStadiumEffect) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    const shouldApply = (target: PokemonCardList, owner: Player) =>
      (target.energies.cards.length > 0 || target.cards.some(card => card.superType === SuperType.ENERGY))
      && !IS_STADIUM_EFFECT_BLOCKED(store, state, owner, target, this);
    if (effect instanceof AfterAttachEnergyEffect) {
      const { target, energyCard } = effect;
      if (target.specialConditions.length > 0 && target.cards.includes(energyCard)
        && shouldApply(target, StateUtils.findOwner(state, target))) {
        target.clearAllSpecialConditions();
      }
    } else {
      PREVENT_AND_CLEAR_SPECIAL_CONDITIONS(state, effect, { shouldApply });
    }
    return state;
  }
}
