import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Wurmple extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: 10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Needling Sting',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.'
  },
{
    name: 'String Shot',
    cost: [G],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Wurmple';
  public fullName: string = 'Wurmple DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/skorupi.ts (coin-gated damage).
    // Needling Sting
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    // Ref: set-diamond-and-pearl/skorupi.ts (coin-gated condition).
    // String Shot applies the condition after damage to the original defender.
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const target = effect.opponent.active;
      const defender = target.getPokemonCard();
      afterAttackDamage(state, effect, (postStore, postState) =>
        COIN_FLIP_PROMPT(postStore, postState, effect.player, result => {
          if (!result || !defender || effect.opponent.active !== target || target.getPokemonCard() !== defender) return;
          const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          condition.target = target;
          postStore.reduceEffect(postState, condition);
        })
      );
    }

    return state;
  }
}
