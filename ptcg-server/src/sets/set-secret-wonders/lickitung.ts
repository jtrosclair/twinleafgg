import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Lickitung extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Lick',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Stomp',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 30 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Lickitung';
  public fullName: string = 'Lickitung SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ekans.ts (coin-gated condition after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    // Ref: set-great-encounters/mudkip.ts (coin-gated damage modifier).
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 30; });
    return state;
  }
}
