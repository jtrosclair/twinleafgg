import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SpecialEnergyEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class TempleofSinnoh extends TrainerCard {

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';

  public trainerType = TrainerType.STADIUM;

  public set = 'ASR';

  public name = 'Temple of Sinnoh';

  public fullName = 'Temple of Sinnoh ASR';

  public text = 'All Special Energy attached to Pokémon (both yours and your opponent\'s) provide [C] Energy and have no other effect.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (StateUtils.getStadiumCard(state) === this) {

      if (effect instanceof UseStadiumEffect) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      if (effect instanceof SpecialEnergyEffect || effect instanceof CheckProvidedEnergyEffect) {
        const slot = effect instanceof SpecialEnergyEffect ? effect.attachedTo : effect.source;
        const owner = state.players.find(player => player.active === slot || player.bench.includes(slot));
        if (!owner || !slot.getPokemonCard() || IS_STADIUM_EFFECT_BLOCKED(store, state, owner, slot, this)) return state;

        if (effect instanceof SpecialEnergyEffect) throw new GameError(GameMessage.CANNOT_USE_POWER);
        effect.specialEnergiesProvideColorless = true;
      }
    }

    return state;
  }
}
