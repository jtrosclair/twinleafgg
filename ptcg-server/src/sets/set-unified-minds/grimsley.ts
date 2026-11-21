import { State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { moveTrainerDamageCounters } from '../../game/store/prefabs/trainer-damage-counters';

export class Grimsley extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'UNM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '199';

  public name: string = 'Grimsley';

  public fullName: string = 'Grimsley UNM';

  public text: string =
    'Move up to 3 damage counters from 1 of your opponent\'s Pokémon to another of their Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-twilight-masquerade/munkidori.ts (resolve counter removal and placement separately).
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      return moveTrainerDamageCounters(store, state, effect, false);
    }
    return state;
  }
}
