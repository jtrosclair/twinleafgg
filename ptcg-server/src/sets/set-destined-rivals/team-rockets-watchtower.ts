import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PokemonCard, PowerType } from '../../game';

export class TeamRocketsWatchtower extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'DRI';
  public regulationMark = 'I';
  public name: string = 'Team Rocket\'s Watchtower';
  public fullName: string = 'Team Rocket\'s Watchtower DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '180';

  public text: string =
    '[C] Pokémon in play (both yours and your opponent\'s) have no Abilities.';

  private blocksAbility(store: StoreLike, state: State, card: PokemonCard): boolean {
    if (card.cardType !== CardType.COLORLESS || StateUtils.getStadiumCard(state) !== this) return false;
    const slot = StateUtils.findPokemonSlot(state, card);
    return !!slot && !IS_STADIUM_EFFECT_BLOCKED(store, state, StateUtils.findOwner(state, slot), slot, this);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPokemonPowersEffect && effect.target && this.blocksAbility(store, state, effect.target)) {
      effect.powers = effect.powers.filter(power =>
        power.powerType !== PowerType.ABILITY || power.exemptFromAbilityLock || power.useFromHand || power.useFromDiscard);
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY
      && !effect.power.exemptFromAbilityLock && !effect.power.useFromHand && !effect.power.useFromDiscard
      && this.blocksAbility(store, state, effect.card)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
