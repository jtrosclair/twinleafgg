import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import { coinConditionsAfterDamage } from '../round26-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Skorupi extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 60;

  public cardType: CardType = G;

  public weakness = [{ type: P, value: +10 }];

  public retreat = [C, C];

  public attacks = [{
    name: 'Stalk',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Dangerous Claw',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed. If tails, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '73';

  public name: string = 'Skorupi';

  public fullName: string = 'Skorupi SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Skorupi.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/retreat-lock-until-target-end-turn.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) retreatLockAfterDamage(state, effect);
    // Ref: sets/round26-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionsAfterDamage(state, effect, [SpecialCondition.PARALYZED], [SpecialCondition.POISONED]);
    return state;
  }
}
