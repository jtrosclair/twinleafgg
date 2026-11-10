import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { opponentSwitchAfterAttack } from '../../game/store/prefabs/opponent-switch-after-attack';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Houndour extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;

  public hp: number = 50;

  public cardType: CardType = D;

  public weakness = [{ type: W, value: +10 }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C];

  public attacks = [{
    name: 'Roar',
    cost: [C],
    damage: 0,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
  {
    name: 'Bite',
    cost: [D],
    damage: 10,
    text: ''
  }];

  public set: string = 'LA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '103';

  public name: string = 'Houndour';

  public fullName: string = 'Houndour LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Houndour.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: game/store/prefabs/opponent-switch-after-attack.ts.
    if (WAS_ATTACK_USED(effect, 0, this)) opponentSwitchAfterAttack(state, effect, effect.source.getPokemonCard() || this);
    return state;
  }
}
