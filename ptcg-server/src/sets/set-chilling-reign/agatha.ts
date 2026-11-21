import { State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { moveTrainerDamageCounters } from '../../game/store/prefabs/trainer-damage-counters';

export class Agatha extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '129';

  public name: string = 'Agatha';

  public fullName: string = 'Agatha CRE';
  public text = 'Move up to 3 damage counters from your Active Pokémon to your opponent\'s Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-twilight-masquerade/munkidori.ts (resolve counter removal and placement separately).
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return moveTrainerDamageCounters(store, state, effect, true);
    }
    return state;
  }
}
