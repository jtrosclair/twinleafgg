import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SpecialCondition } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, DRAW_CARDS, DISCARD_TOP_X_OF_OPPONENTS_DECK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import { selfSwitchAfterAttack } from '../../game/store/prefabs/self-switch-after-attack';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { targetDamageAfter, coinRecoilAfter } from '../set-platinum/round24-attack-helpers';

export class MudkipRound25 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public hp = 60;
  public cardType: CardType = CardType.WATER;
  public weakness = [{ type: CardType.GRASS, value: 10 }];
  public resistance = [];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Mud Sport", cost: [CardType.WATER], damage: 10, damageCalculation: "+" as const, text: "If Mudkip has less Energy attached to it than the Defending Pokémon, this attack does 10 damage plus 10 more damage." },
    { name: "Surf", cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: "" }
  ];
  public set = "SV";
  public setNumber = "116";
  public cardImage = "assets/cardback.png";
  public name = "Mudkip";
  public fullName = "Mudkip SV";
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return MudkipRound25.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Ref: set-ex-dragon-frontiers/swablu.ts (compare attached Energy).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const own=new CheckProvidedEnergyEffect(effect.player,effect.source), other=new CheckProvidedEnergyEffect(effect.opponent,effect.opponent.active);
      store.reduceEffect(state,own); store.reduceEffect(state,other);
      const units=(m: typeof own.energyMap)=>m.reduce((sum,item)=>sum+item.provides.length,0);
      if (units(own.energyMap)<units(other.energyMap)) effect.damage+=10;
    }
    return state;
  }
}
