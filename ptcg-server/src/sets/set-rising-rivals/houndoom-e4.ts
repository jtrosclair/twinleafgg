import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class HoundoomE4 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_SP];

  public hp: number = 80;

  public cardType: CardType = D;

  public weakness = [{ type: F }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Corner',
    cost: [C, C],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }, {
    name: 'Fire Fang',
    cost: [R, C, C],
    damage: 40,
    text: 'The Defending Pokémon is now Burned.'
  }];

  public set: string = 'RR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '65';

  public name: string = 'Houndoom E4';

  public fullName: string = 'Houndoom E4 RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return HoundoomE4.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/retreat-lock-until-target-end-turn.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) retreatLockAfterDamage(state, effect);
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) conditionAfterDamage(state, effect, SpecialCondition.BURNED);
    return state;
  }
}
