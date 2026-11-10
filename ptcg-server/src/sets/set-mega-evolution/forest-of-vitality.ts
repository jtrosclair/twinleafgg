import { State, StateUtils, StoreLike } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonPlayedTurnEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../game/store/prefabs/stadium-effect';

export class LushForest extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public trainerType = TrainerType.STADIUM;
  public set = 'MEG';
  public name = 'Forest of Vitality';
  public fullName = 'Forest of Vitality MEG';
  public regulationMark = 'I';
  public text = 'Each player\'s [G] Pokémon can evolve into another [G] Pokémon during the turn they play those Pokémon. (Players can\'t evolve a Pokémon during their first turn.)';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ancient-origins/forest-of-giant-plants.ts (Grass evolution
    // Stadium); upstream abc75170d (Forest of Vitality same-turn evolution).
    // Grant the exception only for this prospective evolution. Do not rewrite
    // the Pokémon's actual played turn or confer permission on other Pokémon.
    if (!(effect instanceof CheckPokemonPlayedTurnEffect) ||
      !effect.evolutionCard || state.turn <= 2 || StateUtils.getStadiumCard(state) !== this) {
      return state;
    }
    const evolution = effect.evolutionCard;
    if (evolution.cardType !== CardType.GRASS && !evolution.additionalCardTypes?.includes(CardType.GRASS)) {
      return state;
    }
    if (IS_STADIUM_EFFECT_BLOCKED(store, state, effect.player, effect.target, this)) {
      return state;
    }
    const typeCheck = new CheckPokemonTypeEffect(effect.target);
    store.reduceEffect(state, typeCheck);
    if (typeCheck.cardTypes.includes(CardType.GRASS)) {
      effect.pokemonPlayedTurn = Math.min(effect.pokemonPlayedTurn, state.turn - 1);
    }
    return state;
  }
}
