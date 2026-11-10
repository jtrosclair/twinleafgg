import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealEffect } from '../../game/store/effects/game-effects';
import { Player } from '../../game/store/state/player';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

function getProvidedEnergyCount(store: StoreLike, state: State, player: Player): number {
  const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
  store.reduceEffect(state, checkEnergy);
  return checkEnergy.energyMap.reduce((sum, entry) => sum + entry.provides.length, 0);
}

export class JumboIce extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'I';
  public set: string = 'PFL';
  public name: string = 'Jumbo Ice Cream';
  public fullName: string = 'Jumbo Ice M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public text: string = 'Heal 80 damage from your Active Pokémon that has 3 or more Energy attached.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const activePokemon = player.active.getPokemonCard();

    // Must have an active Pokemon
    if (!activePokemon) {
      return false;
    }

    // Must have damage on it
    if (player.active.damage === 0) {
      return false;
    }

    // Must have 3 or more Energy attached
    const energyCount = getProvidedEnergyCount(store, state, player);
    if (energyCount < 3) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const activePokemon = player.active.getPokemonCard();

      if (!activePokemon || player.active.damage === 0 || getProvidedEnergyCount(store, state, player) < 3) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const healEffect = new HealEffect(player, player.active, 80);
      store.reduceEffect(state, healEffect);
      player.supporter.moveCardTo(this, player.discard);
    }

    return state;
  }
}
