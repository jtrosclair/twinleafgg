import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PokemonCard, StoreLike, State } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cinccinoex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Minccino';
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 240;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];
  public powers = [{
    name: 'Smooth Coat',
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokemon by attacks, flip a coin. If heads, prevent that damage.'
  }];
  public attacks = [{
    name: 'Energized Slap',
    cost: [C],
    damage: 0,
    damageCalculation: 'x' as 'x',
    text: 'This attack does 40 damage for each Energy attached to this Pokemon.'
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public usSetNumber = 'CRI 73';
  public name: string = 'Cinccino ex';
  public fullName: string = 'Cinccino ex M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      effect.damagePreventionCoin = { source: this };
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(effect.player, effect.source);
      store.reduceEffect(state, checkProvidedEnergy);
      const energyProvided = checkProvidedEnergy.energyMap
        .reduce((sum, energy) => sum + energy.provides.length, 0);
      effect.damage = 40 * energyProvided;
    }
    return state;
  }
}
