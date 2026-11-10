import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class DrapionE4 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_SP];

  public hp: number = 100;

  public cardType: CardType = D;

  public weakness = [{ type: F }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C, C, C];

  public attacks = [{
    name: 'Body Slam',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }, {
    name: 'Mega Impact',
    cost: [P, C, C, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'RR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '17';

  public name: string = 'Drapion E4';

  public fullName: string = 'Drapion E4 RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return DrapionE4.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
