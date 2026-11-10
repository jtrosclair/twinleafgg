import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { conditionAfterDamage, coinConditionAfterDamage, healAttackerAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Torterra extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = "Grotle";
  public cardType: CardType = CardType.GRASS;
  public hp = 140;
  public weakness = [{ type: CardType.FIRE, value: 30 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Green Blast", cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 40, damageCalculation: "+", text: "Does 40 damage plus 10 more damage for each Grass Energy attached to all of your Pokémon." },
    { name: "Soothing Scent", cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 80, text: "The Defending Pokémon is now Asleep." }
  ];
  public set = 'PL';
  public setNumber = "39";
  public cardImage = 'assets/cardback.png';
  public name = "Torterra";
  public fullName = "Torterra PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Torterra.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let count=0;
      for (const slot of [effect.player.active,...effect.player.bench]) {
        if (!slot.getPokemonCard()) continue;
        const check=new CheckProvidedEnergyEffect(effect.player,slot);store.reduceEffect(state,check);
        for (const entry of check.energyMap) {
          const matched=entry.provides.filter(t=>t===CardType.GRASS||t===CardType.ANY).length;
          const blended=(entry.card as any).blendedEnergies as CardType[] | undefined;
          count+=matched || (!check.specialEnergiesProvideColorless && blended?.includes(CardType.GRASS) ? Math.min(entry.provides.length,(entry.card as any).blendedEnergyCount || 1) : 0);
        }
      }
      effect.damage+=10*count;
    }
    if (WAS_ATTACK_USED(effect, 1, this)) conditionAfterDamage(state,effect,SpecialCondition.ASLEEP);
    return state;
  }
}
