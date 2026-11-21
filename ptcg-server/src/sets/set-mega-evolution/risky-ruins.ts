import { GamePhase, State, StoreLike } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { AfterBenchBasicPokemonEffect } from '../../game/store/effects/play-card-effects';
import { queueBenchStadiumCounters } from '../../game/store/prefabs/bench-play-reactions';

export class DangerousRuins extends TrainerCard {
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '127';
  public trainerType = TrainerType.STADIUM;
  public set = 'MEG';
  public name = 'Risky Ruins';
  public fullName = 'Risky Ruins MEG';
  public text = 'Whenever either player puts a non-[D] Basic Pokémon onto their Bench during their turn, put 2 damage counters on that Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterBenchBasicPokemonEffect && state.players[state.activePlayer] === effect.player
      && [GamePhase.PLAYER_TURN, GamePhase.ATTACK, GamePhase.AFTER_ATTACK, GamePhase.CHOOSE_PRIZES].includes(state.phase)) {
      queueBenchStadiumCounters(store, state, effect, this, () => {
        const types = new CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, types);
        return !types.cardTypes.includes(CardType.DARK);
      });
    }

    return state;
  }

}
