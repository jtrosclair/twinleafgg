import {
  CardType,
  PlayerType,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike
} from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckSpecialConditionRemovalEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 130;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Poison Sacs',
    powerType: PowerType.ABILITY,
    text: 'The Special Condition Poisoned is not removed when your opponent\'s Pokémon evolve or devolve.'
  }];

  public attacks = [{
    name: 'Toxic Secretion',
    cost: [CardType.PSYCHIC],
    damage: 40,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
  }];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Muk';
  public fullName: string = 'Muk TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Sacs - prevent poison from being removed on evolution
    if (effect instanceof CheckSpecialConditionRemovalEffect && effect.target.specialConditions.includes(SpecialCondition.POISONED)) {
      const cardList = StateUtils.findCardList(state, this);
      const mukOwner = StateUtils.findOwner(state, cardList);
      const opponent = StateUtils.getOpponent(state, mukOwner);

      // Check if the evolving Pokémon belongs to the opponent
      if (effect.player === opponent) {
        let mukInPlay = false;
        mukOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list) => {
          if (list.getPokemonCard() === this) {
            mukInPlay = true;
          }
        });

        if (mukInPlay && !IS_ABILITY_BLOCKED(store, state, mukOwner, this)) {
          if (!effect.preservedConditions.includes(SpecialCondition.POISONED)) {
            effect.preservedConditions.push(SpecialCondition.POISONED);
          }
        }
      }
    }

    // Toxic Secretion - apply double poison (20 damage instead of 10)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this, 20);
    }

    return state;
  }
}
