import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

export class LeafyCamoPoncho extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public name: string = 'Leafy Camo Poncho';
  public fullName: string = 'Leafy Camo Poncho SIT';
  public set: string = 'SIT';
  public setNumber: string = '160';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // If this is a supporter effect from the opponent
    if (
      effect instanceof TrainerTargetEffect &&
      effect.trainerCard?.trainerType === TrainerType.SUPPORTER &&
      effect.target &&
      effect.target.tools.includes(this) &&
      (effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_VSTAR) || effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_VMAX))
    ) {
      const owner = StateUtils.getOpponent(state, effect.player);
      const target = effect.target;
      if ((owner.active === target || owner.bench.includes(target)) && !IS_TOOL_BLOCKED(store, state, owner, this)) {
        effect.target = undefined;
      }
    }
    return state;
  }
}