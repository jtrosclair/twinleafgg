import { GameError, GameMessage, PlayerType, State, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

// DLR 93 is not present in the upstream Delta Reign set as of this port.
export class Grisham extends TrainerCard {
  public trainerType = TrainerType.SUPPORTER; public regulationMark = 'J'; public set = 'DLR'; public setNumber = '93';
  public name = 'Grisham'; public fullName = 'Grisham M6'; public cardImage = 'assets/cardback.png';
  public text = "Heal 50 damage from each Pokémon (both yours and your opponent's).";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const damaged = state.players.some(player => player.getPokemonInPlay().some(slot => slot.damage > 0));
      if (!damaged) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      for (const player of state.players) player.forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => {
        if (slot.damage > 0) state = store.reduceEffect(state, new HealEffect(player, slot, 50));
      });
    }
    return state;
  }
}
