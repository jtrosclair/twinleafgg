import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { CardTag, CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';

export class RapidStrikeEnergy extends EnergyCard {

  public tags = [CardTag.RAPID_STRIKE];
  public regulationMark = 'E';
  public provides: CardType[] = [C, C];
  public blendedEnergyCount = 2;
  public energyType = EnergyType.SPECIAL;
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name = 'Rapid Strike Energy';
  public fullName = 'Rapid Strike Energy BST';

  public text = `This card can only be attached to a Rapid Strike Pokémon. If this card is attached to anything other than a Rapid Strike Pokémon, discard this card.

As long as this card is attached to a Pokémon, it provides 2 in any combination of [W] Energy and [F] Energy.`;

  public blendedEnergies = [CardType.FIGHTING, CardType.WATER];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this,
      target => target.getPokemonCard()?.tags.includes(CardTag.RAPID_STRIKE) === true);


    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      try {
        const energyEffect = new EnergyEffect(effect.player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      // Find the first energy type that's not already provided by other energies
      const neededType = this.blendedEnergies.find(type =>
        !effect.energyMap.some(energy => energy.provides.includes(type))
      );

      if (neededType) {
        // Only provide the specific energy type that's needed
        effect.energyMap.push({
          card: this,
          provides: [neededType, neededType]
        });
      }
    }


    return state;
  }

}
