import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { applySpecialDarknessEnergyBonus } from '../../game/store/prefabs/special-darkness-energy';

export class DarknessEnergySpecial extends EnergyCard {

  public provides: CardType[] = [CardType.DARK];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'UD';

  public name = 'Darkness Energy';

  public fullName = 'Darkness Energy UD';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '79';

  public text = 'If the Pokemon Darkness Energy is attached to attacks, ' +
    'the attack does 10 more damage to the Active Pokemon (before applying ' +
    'Weakness and Resistance). Ignore this effect if the Pokemon that ' +
    'Darkness Energy is attached to isn\'t D. Darkness Energy provides ' +
    '[D] Energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    applySpecialDarknessEnergyBonus(store, state, effect, this);
    return state;
  }
}
