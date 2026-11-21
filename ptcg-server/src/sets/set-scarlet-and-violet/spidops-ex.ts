import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, CardTag } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';

export class Spidopsex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = CardType.GRASS;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public evolvesFrom = 'Tarountula';

  public powers = [{
    name: 'Trap Territory',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Pokémon\'s Retreat Cost is [C] more.'
  }];

  public attacks = [{
    name: 'Wire Hang',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 90,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Spidops ex';

  public fullName: string = 'Spidops ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-black-bolt-white-flare/samurott.ts (probe the opposing Pokémon as the Ability target).
    if (effect instanceof CheckRetreatCostEffect) {
      const { player } = effect;
      const owner = StateUtils.getOpponent(state, player);
      if (player.active.getPokemonCard()
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
