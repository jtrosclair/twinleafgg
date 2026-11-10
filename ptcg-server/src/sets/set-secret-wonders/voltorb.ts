import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { recoilAfterDamage } from './sw-attack-effects';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = L;
  public weakness = [{ type: F, value: +10 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Speed Ball',
    cost: [L],
    damage: 20,
    text: ''
  },
  {
    name: 'Big Explosion',
    cost: [L, C],
    damage: 50,
    text: 'Voltorb does 50 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/goldeen.ts (post-damage recoil to the attacker).
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterDamage(state, effect, 50);
    return state;
  }
}
