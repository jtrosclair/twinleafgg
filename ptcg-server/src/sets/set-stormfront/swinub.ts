import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { coinConditionsAfterDamage, coinRecoilAfterDamage } from '../round26-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Swinub extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = F;

  public weakness = [{ type: G, value: +10 }];

  public resistance = [{ type: L, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Freezing Breath',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed. If tails, the Defending Pokémon is now Asleep.'
  },
  {
    name: 'Take Down',
    cost: [F],
    damage: 20,
    text: 'Flip a coin. If tails, Swinub does 10 damage to itself.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Swinub';

  public fullName: string = 'Swinub SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Swinub.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: sets/round26-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionsAfterDamage(state, effect, [SpecialCondition.PARALYZED], [SpecialCondition.ASLEEP]);
    // Ref: sets/round26-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) coinRecoilAfterDamage(state, effect, 10);
    return state;
  }
}
