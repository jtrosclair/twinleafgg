import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { registerKnockOutRetaliation } from '../../game/store/prefabs/knock-out-effects';

export class VengefulPunch extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '197';

  public name = 'Vengeful Punch';

  public fullName = 'Vengeful Punch OBF';

  public text: string =
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 4 damage counters on the Attacking Pokémon.';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: knock-out-effects.ts (use the original attacking Pokémon).
    registerKnockOutRetaliation(store, state, effect, this, 40);
    return state;
  }
}
