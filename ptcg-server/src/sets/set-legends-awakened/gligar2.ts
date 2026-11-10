import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Gligar2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp = 50;
  public weakness = [{ type: CardType.WATER, value: 10 }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Poison Sting", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, the Defending Pokémon is now Poisoned." },
    { name: "Slash", cost: [CardType.FIGHTING, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = "LA";
  public setNumber = "95";
  public cardImage = 'assets/cardback.png';
  public name = "Gligar";
  public fullName = "Gligar LA2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Gligar2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) coinConditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}
