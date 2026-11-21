import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { AfterAttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, StateUtils } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TripleAccelerationEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '190';

  public name = 'Triple Acceleration Energy';

  public fullName = 'Triple Acceleration Energy UNB';

  public text =
    'This card can only be attached to Evolution Pokémon. If this card is attached to 1 of your Pokémon, discard it at the end of the turn.' +
    '\n\n' +
    'This card provides [C][C][C] Energy only while it is attached to an Evolution Pokémon.' +
    '\n\n' +
    'If this card is attached to anything other than an Evolution Pokémon, discard this card.';

  public TRIPLE_ACCELERATION_MARKER = 'TRIPLE_ACCELERATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this, StateUtils.isEvolutionPokemon);

    if (effect instanceof AfterAttachEnergyEffect && effect.energyCard === this && !effect.discardEnergy) {
      effect.player.marker.addMarker(this.TRIPLE_ACCELERATION_MARKER, this);
    }

    // Provide CCC when attached to Evolution Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)
      && StateUtils.isEvolutionPokemon(effect.source)) {
      effect.energyMap.push({ card: this, provides: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS] });
    }

    // Discard at end of turn
    if (effect instanceof BetweenTurnsEffect && effect.player.marker.hasMarker(this.TRIPLE_ACCELERATION_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.TRIPLE_ACCELERATION_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (!cardList.cards.includes(this) || IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
          return;
        }

        cardList.moveCardTo(this, player.discard);
      });
    }

    return state;
  }
}
