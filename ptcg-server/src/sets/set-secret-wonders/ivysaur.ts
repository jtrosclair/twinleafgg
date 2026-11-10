import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Ivysaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bulbasaur';
  public hp: number = 80;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Leech Seed',
    cost: [G, C],
    damage: 20,
    text: 'Remove 1 damage counter from Ivysaur.'
  },
  {
    name: 'Razor Leaf',
    cost: [G, G, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Ivysaur';
  public fullName: string = 'Ivysaur SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ekans.ts (post-damage healing on the original attacker).
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state, effect, 10);
    return state;
  }
}
