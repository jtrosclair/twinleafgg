import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckCoinFlipResultEffect } from '../../game/store/effects/check-effects';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Malamar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Inkay';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'θ Stop',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'Prevent all effects of your opponent\'s Pokémon\'s Abilities done to this Pokémon.'
  }, {
    name: 'Contrary',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon, whenever your opponent flips a coin during his or her turn, treat it as tails.'
  }];

  public attacks = [{
    name: 'Conform',
    cost: [D, C, C],
    damage: 40,
    text: 'If you have the same number of cards in your hand as your opponent, your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'XYP';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Malamar';
  public fullName: string = "Malamar XYP";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // θ Stop is an Ancient Trait and protects against opposing Abilities.
    if (effect instanceof EffectOfAbilityEffect && effect.target?.getPokemonCard() === this
      && StateUtils.getOpponent(state, effect.player).getPokemonInPlay().includes(effect.target)) {
      effect.preventDefault = true;
    }

    // Contrary
    if (effect instanceof CheckCoinFlipResultEffect) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (owner.active.getPokemonCard() === this && !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        effect.forcedTails = true;
      }
    }

    // Conform
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.hand.cards.length === opponent.hand.cards.length) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      }
    }

    return state;
  }
}
