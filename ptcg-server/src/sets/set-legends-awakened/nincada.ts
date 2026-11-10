import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Nincada extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 40;

  public cardType: CardType = G;

  public weakness = [{ type: R, value: +10 }];

  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Big Bite',
    cost: [G],
    damage: 0,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'LA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '108';

  public name: string = 'Nincada';

  public fullName: string = 'Nincada LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Nincada.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/retreat-lock-until-target-end-turn.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) retreatLockAfterDamage(state, effect);
    return state;
  }
}
