import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { recoilAfterDamage } from './sw-attack-effects';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F, value: 20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Thundershock',
    cost: [L],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Thunder',
    cost: [L, L, C],
    damage: 60,
    text: 'Flip a coin. If tails, Electabuzz does 30 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ekans.ts (coin-gated condition after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    // Ref: set-diamond-and-pearl/goldeen.ts (post-damage recoil to the attacker).
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterDamage(state, effect, 30, true);
    return state;
  }
}
