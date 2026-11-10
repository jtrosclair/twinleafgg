import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Shellder extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Shell Rest',
    cost: [C],
    damage: 0,
    text: 'Remove 2 damage counters from Shellder.'
  },
  {
    name: 'Tongue Slap',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Shellder';
  public fullName: string = 'Shellder SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ekans.ts (post-damage healing on the original attacker).
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state, effect, 20);
    return state;
  }
}
