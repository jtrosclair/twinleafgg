import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Kricketot extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 60;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Lullaby", cost: [CardType.GRASS], damage: 10, text: "The Defending Pokémon is now Asleep." },
    { name: "Rollout", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = 'PL';
  public setNumber = "78";
  public cardImage = 'assets/cardback.png';
  public name = "Kricketot";
  public fullName = "Kricketot PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Kricketot.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    return state;
  }
}
