import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class AuroraEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;
  public override readonly discardCostToAttachFromHand = 1;

  public set: string = 'SSH';

  public regulationMark = 'D';

  public name = 'Aurora Energy';

  public fullName = 'Aurora Energy SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '186';

  public text =
    `You can attach this card to 1 of your Pokémon only if you discard another card from your hand.
    
As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.ANY] });
    }

    return state;
  }
}
