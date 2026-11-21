import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { State, StoreLike } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AbstractAttackEffect, ApplyWeaknessEffect, PutDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class WonderEnergy extends EnergyCard {
  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PRC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '144';

  public name = 'Wonder Energy';

  public fullName = 'Wonder Energy PRC';

  public text = 'This card can only be attached to [Y] Pokémon. This card provides [Y] Energy only while this card is attached to a [Y] Pokémon.' +
    '\n\n' +
    'Prevent all effects of your opponent\'s attacks, except damage, done to the [Y] Pokémon that this card is attached to. (Existing effects are not removed.)' +
    '\n\n' +
    '(If this card is attached to anything other than a [Y] Pokémon, discard this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this, CardType.FAIRY);

    // Provide energy when attached to Fairy Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.FAIRY)) {
        effect.energyMap.push({ card: this, provides: [CardType.FAIRY] });
      }
    }


    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.source.getPokemonCard();

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.opponent, this, effect.target)) {
        return state;
      }

      if (sourceCard) {
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        if (effect instanceof DealDamageEffect) {
          return state;
        }
        effect.preventDefault = true;
      }
    }

    return state;
  }
}