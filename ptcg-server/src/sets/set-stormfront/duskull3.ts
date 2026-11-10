import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Duskull3 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = P;

  public weakness = [{ type: D, value: +10 }];

  public resistance = [{ type: C, value: -20 }];

  public retreat = [C];

  public attacks = [{
    // Tackle
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  }, {
    // Surprise Attack
    name: 'Surprise Attack',
    cost: [P, C],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'SF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public name: string = 'Duskull';

  public fullName: string = 'Duskull SF3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Duskull3.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/prefabs.ts.
    if (WAS_ATTACK_USED(effect, 1, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (!heads) effect.damage = 0; });
    return state;
  }
}
