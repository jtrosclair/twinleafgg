import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils, TrainerCard } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';


export class RockChestplate extends TrainerCard {

  public regulationMark = 'G';
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '192';
  public name = 'Rock Chestplate';
  public fullName = 'Rock Chestplate SVI';

  public text =
    'The [F] Pokémon this card is attached to takes 30 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof PutDamageEffect) || state.phase !== GamePhase.ATTACK || !effect.target.tools.includes(this)) {
      return state;
    }
    const owner = StateUtils.findOwner(state, effect.target);
    if (owner === effect.player || !effect.source.getPokemonCard() || IS_TOOL_BLOCKED(store, state, owner, this)) {
      return state;
    }
    const type = new CheckPokemonTypeEffect(effect.target);
    state = store.reduceEffect(state, type);
    if (type.cardTypes.includes(CardType.FIGHTING)) {
      effect.reduceDamageAfterWeakness(30, this.fullName + ':' + this.id);
    }
    return state;
  }
}
