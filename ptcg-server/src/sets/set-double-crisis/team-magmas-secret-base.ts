import { State, StoreLike } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { AfterPlayBasicFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueBenchStadiumCounters } from '../../game/store/prefabs/bench-play-reactions';

export class TeamMagmasSecretBase extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  protected _trainerType = TrainerType.STADIUM;
  public set = 'DCR';
  public name = "Team Magma's Secret Base";
  public fullName = "Team Magma's Secret Base DCR";
  public text: string =
    'Whenever any player puts a Basic Pokémon (except for Team Magma Pokémon) from his or her hand onto his or her Bench, put 2 damage counters on that Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterPlayBasicFromHandEffect && !effect.pokemonCard.tags.includes(CardTag.TEAM_MAGMA)) {
      queueBenchStadiumCounters(store, state, effect, this);
    }

    return state;
  }
}
