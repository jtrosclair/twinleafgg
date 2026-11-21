import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ShieldEnergy extends EnergyCard {

  public provides: CardType[] = [C];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PRC';

  public name = 'Shield Energy';

  public fullName = 'Shield Energy PRC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '143';

  public text =
    'This card can only be attached to [M] Pokémon. This card provides [M] Energy only while this card is attached to a [M] Pokémon.' +
    '\n\n' +
    'The attacks of your opponent\'s Pokémon do 10 less damage to the [M] Pokémon this card is attached to (before applying Weakness and Resistance).' +
    '\n\n' +
    '(If this card is attached to anything other than a [M] Pokémon, discard this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this, CardType.METAL);

    // Provide energy when attached to Metal Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.METAL)) {
        effect.energyMap.push({ card: this, provides: [CardType.METAL] });
      }
    }


    // Damage reduction
    if (effect instanceof PutDamageEffect && effect.target?.cards?.includes(this)) {
      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.opponent, this, effect.target)) {
        return state;
      }

      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.METAL)) {
        effect.reduceDamage(10);
      }
    }

    return state;
  }

}
