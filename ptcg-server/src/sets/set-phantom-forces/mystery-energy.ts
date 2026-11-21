import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckPokemonTypeEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class MysteryEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'PHF';

  public name = 'Mystery Energy';

  public fullName = 'Mystery Energy PHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '112';

  public readonly STRONG_ENERGY_MAREKER = 'STRONG_ENERGY_MAREKER';

  public text =
    'This card can only be attached to [P] Pokemon. This card provides [P] Energy, but only while this card is attached to a [P] Pokemon.' +
    '\n\n' +
    'The Retreat Cost of the Pokemon this card is attached to is [C][C] less.' +
    '\n\n' +
    '(If this card is attached to anything other than a [P] Pokemon, discard this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this, CardType.PSYCHIC);

    // Provide energy when attached to Psychic Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.PSYCHIC)) {
        effect.energyMap.push({ card: this, provides: [CardType.PSYCHIC] });
      }
    }


    // Subtract CC from retreat cost
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, player.active)) {
        return state;
      }

      if (player.active.cards.includes(this)) {
        for (let i = 0; i < 2; i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    return state;
  }

}
