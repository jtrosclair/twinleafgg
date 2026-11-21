import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { GET_PLAYER_BENCH_SLOTS, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { queueSpecialEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';

export class TelepathPsychicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.PSYCHIC];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'J';
  public set: string = 'M3';
  public name = 'Telepath Psychic Energy';
  public fullName = 'Telepath [P] Energy M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public usSetNumber = 'POR 88';
  public text = 'This card provides [P] Energy while this card is attached to a Pokemon.\n\nWhen you attach this card from your hand to 1 of your [P] Pokemon, search your deck for up to 2 Basic [P] Pokémon and put them onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Provide [P] Energy
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.PSYCHIC] });
    }

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.energyCard === this) {
      const { player, target } = effect;
      queueSpecialEnergyReaction(store, state, effect, this, () => {
        SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player,
          { stage: Stage.BASIC, cardType: CardType.PSYCHIC },
          { min: 0, max: Math.min(2, GET_PLAYER_BENCH_SLOTS(player).length), allowCancel: false });
      }, () => {
        if (player.deck.cards.length === 0 || GET_PLAYER_BENCH_SLOTS(player).length === 0) return false;
        const type = new CheckPokemonTypeEffect(target);
        store.reduceEffect(state, type);
        return type.cardTypes.includes(CardType.PSYCHIC);
      });
    }

    return state;
  }
}
