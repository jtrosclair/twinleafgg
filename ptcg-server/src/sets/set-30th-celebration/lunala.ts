import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { EnergyCard, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lunala extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Cosmoem';
  public hp: number = 160;
  public cardType: CardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Midnight Ray',
    cost: [CardType.PSYCHIC],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each Energy in your discard pile.'
  },
  {
    name: 'Lunar Blast',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 120,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Lunala';
  public fullName: string = 'Lunala 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Midnight Ray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const energyCount = effect.player.discard.cards.filter(c =>
        c instanceof EnergyCard || c.superType === SuperType.ENERGY
      ).length;
      effect.damage += energyCount * 20;
    }

    return state;
  }
}
