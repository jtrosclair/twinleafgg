import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Wurmple extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 50;
  public weakness = [{ type: CardType.FIRE, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Ram", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Poison Sting", cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: "Flip a coin. If heads, the Defending Pokémon is now Poisoned." }
  ];
  public set = 'PL';
  public setNumber = "103";
  public cardImage = 'assets/cardback.png';
  public name = "Wurmple";
  public fullName = "Wurmple PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Wurmple.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.POISONED);
    return state;
  }
}
