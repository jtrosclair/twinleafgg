import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Spinarak';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Big Net',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Evolution Pokémon\'s Retreat Cost is [C] more.'
  }];

  public attacks = [{
    name: 'String Bind',
    cost: [G],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Ariados';
  public fullName: string = 'Ariados TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-black-bolt-white-flare/samurott.ts (probe the opposing Pokémon as the Ability target).
    if (effect instanceof CheckRetreatCostEffect) {
      const { player } = effect;
      const owner = StateUtils.getOpponent(state, player);
      if (player.active.getPokemonCard() && StateUtils.isEvolutionPokemon(player.active)
        && StateUtils.isPokemonInPlay(owner, this) && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, player.active)) {
        effect.colorlessAdjustment++;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const cost = new CheckRetreatCostEffect(effect.opponent);
      store.reduceEffect(state, cost);
      effect.damage += 30 * cost.cost.filter(type => type === CardType.COLORLESS).length;
    }

    return state;
  }
}