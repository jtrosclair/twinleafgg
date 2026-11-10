import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';

export class Doduo extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 50;
  public weakness = [{ type: CardType.LIGHTNING, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [];
  public attacks = [
    { name: "Take Down", cost: [CardType.COLORLESS], damage: 20, text: "Doduo does 10 damage to itself." }
  ];
  public set = 'SV';
  public setNumber = "102";
  public cardImage = 'assets/cardback.png';
  public name = "Doduo";
  public fullName = "Doduo SV";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Doduo.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) recoilAfterAttack(state, effect, 10);
    return state;
  }
}
