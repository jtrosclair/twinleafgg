import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { PowerEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, PokemonCardList, PowerType } from '../../game';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Power } from '../../game/store/card/pokemon-types';

const RULE_BOX_TAGS = [CardTag.POKEMON_V, CardTag.POKEMON_VMAX, CardTag.POKEMON_VSTAR,
  CardTag.POKEMON_EX, CardTag.BREAK, CardTag.POKEMON_GX, CardTag.PRISM_STAR,
  CardTag.RADIANT, CardTag.POKEMON_VUNION];

function isLockedPower(power: Power): boolean {
  return power.powerType === PowerType.ABILITY && !power.exemptFromAbilityLock
    && !power.useFromHand && !power.useFromDiscard;
}

export class PathToThePeak extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public set = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public regulationMark = 'E';

  public name = 'Path to the Peak';

  public fullName = 'Path to the Peak CRE';

  public text = 'Pokémon with a Rule Box in play (both yours and your opponent\'s) have no Abilities. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';

  private hasRuleBox(card: PokemonCard): boolean {
    // Matches upstream Card.hasRuleBox(): older, pre-regulation lowercase ex
    // cards do not have a Rule Box. Modern Mega ex also has the ex tag.
    return (card.tags.includes(CardTag.POKEMON_ex) && !!card.regulationMark)
      || RULE_BOX_TAGS.some(tag => card.tags.includes(tag));
  }

  private affectsSlot(store: StoreLike, state: State, slot: PokemonCardList): boolean {
    const owner = StateUtils.findOwner(state, slot);
    return !IS_STADIUM_EFFECT_BLOCKED(store, state, owner, slot, this);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: upstream 9d4e1c72d (Stadium Ability lock); set-mega-evolution/forest-of-vitality.ts (Stadium immunity).
    if (effect instanceof CheckPokemonPowersEffect && StateUtils.getStadiumCard(state) === this) {
      const targetPokemon = effect.target;
      if (!targetPokemon) {
        return state;
      }

      // Check if target is in play
      const targetCardList = StateUtils.findPokemonSlot(state, targetPokemon);
      if (!targetCardList) {
        return state;
      }

      // Check if Pokemon has a Rule Box
      if (this.hasRuleBox(targetPokemon) && this.affectsSlot(store, state, targetCardList)) {
        // Filter out all abilities
        effect.powers = effect.powers.filter(power =>
          !isLockedPower(power)
        );
      }
    }

    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this &&
      isLockedPower(effect.power) && this.hasRuleBox(effect.card)) {
      const slot = StateUtils.findPokemonSlot(state, effect.card);
      // Entering-play Abilities are probed before the Pokémon occupies a slot.
      if (!slot || this.affectsSlot(store, state, slot)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    return state;
  }
}
