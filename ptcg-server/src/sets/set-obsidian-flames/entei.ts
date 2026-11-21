import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ApplyWeaknessEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { REDUCE_ATTACK_DAMAGE_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Entei extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 130;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Pressure',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon do 20 less damage (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Blaze Ball',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each [R] Energy ' +
        'attached to this Pokémon.'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public regulationMark = 'G';

  public name: string = 'Entei';

  public fullName: string = 'Entei OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, effect.source);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.FIRE || cardType === CardType.ANY
        ).length;
      });
      effect.damage += energyCount * 20;
    }

    // Ref: the Pressure ruling on Tough Hammer (reduction applies to the attack’s damage).
    if (effect instanceof ApplyWeaknessEffect || effect instanceof PutDamageEffect) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (owner.active.getPokemonCard() === this) {
        REDUCE_ATTACK_DAMAGE_FROM_ABILITY(store, state, effect, owner, this, 20);
      }
    }

    return state;
  }

}