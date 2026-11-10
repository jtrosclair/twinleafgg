import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Grovyle extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Treecko';

  public hp: number = 80;

  public cardType: CardType = G;

  public weakness = [{ type: R, value: +20 }];

  public resistance = [{ type: W, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Tail Shake',
    cost: [G],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Slam',
    cost: [G, C, C],
    damage: 60,
    damageCalculation: 'x' as 'x',
    text: 'Flip 2 coins. This attack does 60 damage times the number of heads.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public name: string = 'Grovyle';

  public fullName: string = 'Grovyle SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Grovyle.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => { const base = 60 * results.filter(Boolean).length; effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    return state;
  }
}
