import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Crobat2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom: string = 'Golbat';

  public hp: number = 110;

  public cardType: CardType = P;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -20 }];

  public retreat = [];

  public attacks = [{
    name: 'Supersonic',
    cost: [P],
    damage: 30,
    text: 'The Defending Pokémon is now Confused.'
  },
  {
    name: 'Hurricane Wing',
    cost: [P, C, C],
    damage: 30,
    damageCalculation: 'x' as 'x',
    text: 'Flip 4 coins. This attack does 30 damage times the number of heads.'
  }];

  public set: string = 'UL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Crobat';

  public fullName: string = 'Crobat UL2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Crobat2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-great-encounters/ge-attack-effects.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.CONFUSED);
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => { const base = 30 * results.filter(Boolean).length; effect.damage = base ? Math.max(0, effect.damage + base - effect.attack.damage) : 0; });
    return state;
  }
}
