import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike, State, PowerType } from '../../game';
import { applyDamp } from '../../game/store/prefabs/ability-lock';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Golduck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Psyduck';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Damp',
    powerType: PowerType.ABILITY,
    text: 'Pokémon in play (both yours and your opponent\'s) lose any Ability that requires the Pokémon using it to Knock Out itself.'
  }];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [C, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each [W] Energy attached to this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'MEP';
  public setNumber = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golduck';
  public fullName: string = 'Golduck MEP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    applyDamp(store, state, effect, this);
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER;
        }).length;
      });
      effect.damage += energyCount * 20;
    }
    return state;
  }
}
