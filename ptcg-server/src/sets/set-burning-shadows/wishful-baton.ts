import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { registerKnockOutEnergyTransfer, wasActiveWhenDamaged } from '../../game/store/prefabs/knock-out-effects';

export class WishfulBaton extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BUS';

  public name: string = 'Wishful Baton';

  public fullName: string = 'Wishful Baton BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public text: string =
    'If the Pokémon this card is attached to is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, move up to 3 basic Energy cards from that Pokémon to 1 of your Benched Pokémon.';

  public readonly WISHFUL_BATON_MARKER: string = 'WISHFUL_BATON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && wasActiveWhenDamaged(effect) && effect.target.tools.includes(this)
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      registerKnockOutEnergyTransfer(store, state, effect, this, { max: 3, sameTarget: true });
    }
    return state;
  }
}
