import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { recoilAfterDamage } from './sw-attack-effects';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = F;
  public weakness = [{ type: W, value: 10 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flail',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of damage counters on Phanpy.'
  },
{
    name: 'Take Down',
    cost: [F, C],
    damage: 30,
    text: 'Phanpy does 10 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Phanpy';
  public fullName: string = 'Phanpy SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mysterious-treasures/magikarp.ts (Flail on the actual attacking Pokémon).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const base = Math.floor(effect.source.damage / 10) * 10;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    }
    // Ref: set-diamond-and-pearl/goldeen.ts (post-damage recoil to the attacker).
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterDamage(state, effect, 10);
    return state;
  }
}
