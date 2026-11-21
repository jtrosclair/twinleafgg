import { TrainerType } from '../../game/store/card/card-types';
import { GameLog } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { MovedFromActiveToBenchEffect } from '../../game/store/effects/game-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { StateUtils } from '../../game/store/state-utils';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Spikemuth extends TrainerCard {

  public regulationMark = 'D';

  public trainerType = TrainerType.STADIUM;

  public set = 'DAA';

  public setNumber: string = '170';

  public cardImage: string = 'assets/cardback.png';

  public name = 'Spikemuth';

  public fullName = 'Spikemuth DAA';

  public text = 'Whenever a player\'s Active Pokémon moves to the Bench during their turn, put 2 damage counters on that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof MovedFromActiveToBenchEffect)
      || state.players[state.activePlayer] !== effect.player
      || ![GamePhase.PLAYER_TURN, GamePhase.ATTACK, GamePhase.AFTER_ATTACK].includes(state.phase)
      || StateUtils.getStadiumCard(state) !== this) {
      return state;
    }

    const { player, pokemonCard } = effect;
    const target = player.bench.find(slot => slot.getPokemonCard() === pokemonCard);
    if (target && !IS_STADIUM_EFFECT_BLOCKED(store, state, player, target, this)) {
      target.damage += 20;
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
        name: player.name, damage: 20, target: pokemonCard.name, effect: this.name,
      });
    }
    return state;
  }
}
