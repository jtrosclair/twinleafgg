import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { coinConditionsAfterDamage } from '../round26-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Koffing extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 60;

  public cardType: CardType = P;

  public weakness = [{ type: P, value: +10 }];

  public retreat = [C, C];

  public attacks = [{
    name: 'Offensive Gas',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and Poisoned.'
  }, {
    name: 'Gas Bomb',
    cost: [P],
    damage: 30,
    text: 'Koffing does 30 damage to itself, and don\'t apply Weakness and Resistance to this damage.'
  }];

  public set: string = 'RR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Koffing';

  public fullName: string = 'Koffing RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Koffing.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: sets/round26-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionsAfterDamage(state, effect, [SpecialCondition.CONFUSED, SpecialCondition.POISONED], []);
    // Ref: game/store/prefabs/recoil-after-attack.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) recoilAfterAttack(state, effect, 30);
    return state;
  }
}
