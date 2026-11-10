import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';

export class Grotle extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Turtwig";
  public cardType: CardType = CardType.GRASS;
  public hp = 90;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Absorb", cost: [CardType.GRASS, CardType.COLORLESS], damage: 30, text: "Remove 1 damage counter from Grotle." },
    { name: "Razor Leaf", cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS], damage: 60, text: "" }
  ];
  public set = 'PL';
  public setNumber = "49";
  public cardImage = 'assets/cardback.png';
  public name = "Grotle";
  public fullName = "Grotle PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Grotle.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) healAttackerAfterDamage(state,effect,10);
    return state;
  }
}
