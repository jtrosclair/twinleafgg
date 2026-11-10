import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Venonat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: 10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Stun Spore',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
{
    name: 'Signal Beam',
    cost: [G],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Venonat';
  public fullName: string = 'Venonat SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ekans.ts (coin-gated condition after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    return state;
  }
}
