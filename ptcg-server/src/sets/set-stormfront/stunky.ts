import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Stunky extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 60;

  public cardType: CardType = D;

  public weakness = [{ type: F, value: +10 }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Gnaw and Run',
    cost: [D],
    damage: 10,
    text: 'Switch Stunky with 1 of your Benched Pokémon.'
  },
  {
    name: 'Double Scratch',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x' as 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '76';

  public name: string = 'Stunky';

  public fullName: string = 'Stunky SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Stunky.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/self-switch-after-attack.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) selfSwitchAfterAttack(state, effect);
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => { const base = 20 * results.filter(Boolean).length; effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    return state;
  }
}
