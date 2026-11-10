import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Tandemaus extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public hp: number = 40;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [{
    name: 'Play Rough',
    cost: [C],
    damage: 10,
    damageCalculation: '+' as '+',
    text: 'Flip a coin. If heads, this attack does 10 more damage.'
  }];

  public regulationMark = 'H';

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Tandemaus';

  public fullName: string = 'Tandemaus SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Tandemaus.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 10; });
    return state;
  }
}
