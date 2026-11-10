import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Cherubi extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = G;

  public weakness = [{ type: R, value: +10 }];

  public resistance = [{ type: W, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Nap',
    cost: [],
    damage: 0,
    text: 'Remove 2 damage counters from Cherubi.'
  },
  {
    name: 'Bullet Seed',
    cost: [G],
    damage: 10,
    damageCalculation: 'x' as 'x',
    text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public name: string = 'Cherubi';

  public fullName: string = 'Cherubi SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Cherubi.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state, effect, 20);
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => { const base = 10 * results.filter(Boolean).length; effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    return state;
  }
}
