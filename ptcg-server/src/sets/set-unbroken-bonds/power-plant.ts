import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Power } from '../../game/store/card/pokemon-types';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';

function isLockedPower(power: Power): boolean {
  return power.powerType === PowerType.ABILITY && !power.exemptFromAbilityLock
    && !power.useFromHand && !power.useFromDiscard;
}

export class PowerPlant extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'UNB';
  public name: string = 'Power Plant';
  public fullName: string = 'Power Plant UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '183';

  public text: string =
    'Pokémon-GX and Pokémon-EX in play (both yours and your opponent\'s) have no Abilities.';

  private isExOrGx(card: PokemonCard): boolean {
    return card.tags.includes(CardTag.POKEMON_GX) || card.tags.includes(CardTag.POKEMON_EX);
  }

  private affectsSlot(store: StoreLike, state: State, slot: PokemonCardList): boolean {
    const owner = StateUtils.findOwner(state, slot);
    return !IS_STADIUM_EFFECT_BLOCKED(store, state, owner, slot, this);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: upstream 9d4e1c72d (Stadium Ability lock); set-mega-evolution/forest-of-vitality.ts (Stadium immunity).
    if (effect instanceof CheckPokemonPowersEffect && StateUtils.getStadiumCard(state) === this && this.isExOrGx(effect.target)) {
      const slot = StateUtils.findPokemonSlot(state, effect.target);
      if (slot && this.affectsSlot(store, state, slot)) {
        effect.powers = effect.powers.filter(power => !isLockedPower(power));
      }
    }
    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this &&
      isLockedPower(effect.power) && this.isExOrGx(effect.card)) {
      const slot = StateUtils.findPokemonSlot(state, effect.card);
      // Entering-play Abilities are probed before the Pokémon occupies a slot.
      if (!slot || this.affectsSlot(store, state, slot)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
