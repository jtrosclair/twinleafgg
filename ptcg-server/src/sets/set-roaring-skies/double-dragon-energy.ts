import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class DoubleDragonEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'ROS';

  public name = 'Double Dragon Energy';

  public fullName = 'Double Dragon Energy ROS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public text =
    'This card can only be attached to [N] Pokémon.' +
    '\n\n' +
    'This card provides every type of Energy, but provides only 2 Energy at a time, only while this card is attached to a [N] Pokémon.' +
    '\n\n' +
    '(If this card is attached to anything other than a [N] Pokémon, discard this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this, CardType.DRAGON);

    // Provide energy when attached to Dragon Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.DRAGON)) {
        effect.energyMap.push({ card: this, provides: [CardType.ANY, CardType.ANY] });
      }
    }


    return state;
  }

}
