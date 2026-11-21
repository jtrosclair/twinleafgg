import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueSpecialEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HerbalEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'FFI';

  public name = 'Herbal Energy';

  public fullName = 'Herbal Energy FFI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '103';

  public text =
    'This card can only be attached to [G] Pokémon. This card provides [G] Energy only while this card is attached to a [G] Pokémon.' +
    '\n\n' +
    'When you attach this card from your hand to 1 of your[G] Pokémon, heal 30 damage from that Pokémon.' +
    '\n\n' +
    '(If this card is attached to anything other than a [G] Pokémon, discard this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this, CardType.GRASS);

    // Provide energy when attached to Grass Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.GRASS)) {
        effect.energyMap.push({ card: this, provides: [CardType.GRASS] });
      }
    }


    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      queueSpecialEnergyReaction(store, state, effect, this, () => {
        store.reduceEffect(state, new HealEffect(effect.player, effect.target, 30));
      }, () => {
        const type = new CheckPokemonTypeEffect(effect.target);
        store.reduceEffect(state, type);
        return type.cardTypes.includes(CardType.GRASS);
      });
    }


    return state;
  }

}
