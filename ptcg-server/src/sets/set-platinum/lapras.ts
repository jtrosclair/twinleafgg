import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Lapras extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp = 80;
  public weakness = [{ type: CardType.METAL, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Grind", cost: [CardType.COLORLESS], damage: 10, damageCalculation: "x", text: "Does 10 damage times the amount of Energy attached to Lapras." },
    { name: "Ice Beam", cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS], damage: 30, text: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed." }
  ];
  public set = 'PL';
  public setNumber = "79";
  public cardImage = 'assets/cardback.png';
  public name = "Lapras";
  public fullName = "Lapras PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Lapras.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {const check=new CheckProvidedEnergyEffect(effect.player,effect.source);store.reduceEffect(state,check);const n=check.energyMap.reduce((sum,e)=>sum+e.provides.length,0);effect.damage=n?Math.max(0,effect.damage+10*n-effect.attack.damage):0;}
    if (WAS_ATTACK_USED(effect, 1, this)) coinConditionAfterDamage(state, effect, SpecialCondition.PARALYZED);
    return state;
  }
}
