import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
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

  private lastActiveIds: { [key: number]: number } = {};

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (StateUtils.getStadiumCard(state) !== this) {
      this.lastActiveIds = {};
      return state;
    }

    for (const player of state.players) {
      const activePokemon = player.active.getPokemonCard();
      if (!activePokemon) continue;

      const currentId = activePokemon.id;
      const lastId = this.lastActiveIds[player.id];

      if (lastId !== undefined && lastId !== currentId) {
        // Active Pokemon changed - find old active on bench and damage it
        for (const bench of player.bench) {
          const benchPokemon = bench.getPokemonCard();
          if (benchPokemon && benchPokemon.id === lastId) {
            bench.damage += 20;
            break;
          }
        }
      }

      this.lastActiveIds[player.id] = currentId;
    }

    return state;
  }
}
