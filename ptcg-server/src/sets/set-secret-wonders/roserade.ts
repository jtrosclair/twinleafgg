import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roselia';
  public hp: number = 90;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sleep Poison',
    cost: [G],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep and Poisoned.'
  },
  {
    name: 'Magical Leaf',
    cost: [G, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 40 damage plus 30 more damage and remove 3 damage counters from Roserade.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/drowzee.ts (condition on original defender).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (postStore, nextState, target) => {
        const conditions = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP, SpecialCondition.POISONED]); conditions.target = target; return postStore.reduceEffect(nextState, conditions);
      });
    }
    // Ref: set-secret-wonders/lickitung.ts (bonus) and set-great-encounters/ekans.ts (post-damage heal).
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) { effect.damage += 30; healAttackerAfterDamage(state, effect, 30); } });
    return state;
  }
}
