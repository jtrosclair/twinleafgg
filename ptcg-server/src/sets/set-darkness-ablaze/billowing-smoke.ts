import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';

export class BillowingSmoke extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'D';

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '158';

  public name: string = 'Billowing Smoke';

  public fullName: string = 'Billowing Smoke DAA';

  public text: string =
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, ' +
    'that player discards any Prize cards they would take for that Knock Out instead of putting those cards into their hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.target.tools.includes(this)
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      effect.prizeDestination = StateUtils.getOpponent(state, effect.player).discard;
    }
    return state;
  }
}
