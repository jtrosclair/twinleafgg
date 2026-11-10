import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Shaymin extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp = 70;
  public weakness = [{ type: CardType.FIRE, value: 20 }];
  public resistance = [{ type: CardType.WATER, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Flower Aroma", cost: [CardType.GRASS], damage: 10, text: "Remove 2 damage counters from Shaymin. The Defending Pokémon is now Asleep." },
    { name: "Damage Aid", cost: [CardType.GRASS, CardType.COLORLESS], damage: 30, damageCalculation: "+", text: "If the Defending Pokémon is affected by a Special Condition, this attack does 30 damage plus 50 more damage. Then, remove all Special Conditions from the Defending Pokémon." }
  ];
  public set = 'PL';
  public setNumber = "14";
  public cardImage = 'assets/cardback.png';
  public name = "Shaymin";
  public fullName = "Shaymin PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Shaymin.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) { healAttackerAfterDamage(state,effect,20); conditionAfterDamage(state,effect,SpecialCondition.ASLEEP); }
    if (WAS_ATTACK_USED(effect, 1, this) && effect.opponent.active.specialConditions.length) {
      effect.damage += 50;
      afterAttackDamageForOriginalDefender(state,effect,(s,next,target)=>{ const remove=new RemoveSpecialConditionsEffect(effect,undefined);remove.target=target;return s.reduceEffect(next,remove); });
    }
    return state;
  }
}
