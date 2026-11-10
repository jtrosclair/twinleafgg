import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';

export class Chinchou2 extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp = 50;
  public weakness = [{ type: CardType.FIGHTING, value: 10 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Razor Fin", cost: [CardType.COLORLESS], damage: 10, text: "" },
    { name: "Aqua Spark", cost: [CardType.LIGHTNING, CardType.COLORLESS], damage: 20, damageCalculation: "+", text: "If Chinchou has any Water Energy attached to it, this attack does 20 damage plus 10 more damage." }
  ];
  public set = "LA";
  public setNumber = "88";
  public cardImage = 'assets/cardback.png';
  public name = "Chinchou";
  public fullName = "Chinchou LA2";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Chinchou2.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const check = new CheckProvidedEnergyEffect(effect.player, effect.source);
      store.reduceEffect(state, check);
      if (StateUtils.checkEnoughEnergy(check.energyMap, [CardType.WATER])) effect.damage += 10;
    }
    return state;
  }
}
