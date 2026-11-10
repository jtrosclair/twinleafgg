import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { retreatLockAfterDamage } from '../../game/store/prefabs/retreat-lock-until-target-end-turn';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Poochyena extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = D;

  public weakness = [{ type: F, value: +10 }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Corner',
    cost: [D],
    damage: 0,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Ambush',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+' as '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
  }];

  public set: string = 'LA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public name: string = 'Poochyena';

  public fullName: string = 'Poochyena LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Poochyena.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/retreat-lock-until-target-end-turn.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) retreatLockAfterDamage(state, effect);
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 20; });
    return state;
  }
}
