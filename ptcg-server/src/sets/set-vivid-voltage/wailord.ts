import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Wailord extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wailmer';

  public cardType: CardType = CardType.WATER;

  public hp: number = 200;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Water Veil',
    powerType: PowerType.ABILITY,
    text: 'Whenever you attach an Energy card from your hand to this Pokémon, remove all Special Conditions from it.'
  }];

  public attacks = [
    {
      name: 'Hydro Pump',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 40 more damage for each [W] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'VIV';

  public name: string = 'Wailord';

  public fullName: string = 'Wailord VIV';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.WATER || cardType === CardType.ANY
        ).length;
      });
      effect.damage += energyCount * 40;
    }

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        effect.target.clearAllSpecialConditions();
      });
    }

    return state;
  }

}
