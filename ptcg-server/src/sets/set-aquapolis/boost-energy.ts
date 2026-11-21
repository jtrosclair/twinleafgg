import { RESTRICT_SPECIAL_ENERGY_ATTACHMENT } from '../../game/store/prefabs/special-energy-attachment';
import { AfterAttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { GameError, GameMessage, PlayerType } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_SPECIAL_ENERGY_BLOCKED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BoostEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '145';
  public name = 'Boost Energy';
  public fullName = 'Boost Energy AQ';

  public text =
    'Boost Energy can be attached only to an Evolved Pokémon. Discard Boost Energy at the end of the turn it was attached. Boost Energy provides [C][C][C] Energy. The Pokémon Boost Energy is attached to can\'t retreat.\n\nWhen the Pokémon Boost Energy is attached to is no longer an Evolved Pokémon, discard Boost Energy.';

  public BOOST_MARKER = 'BOOST_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    RESTRICT_SPECIAL_ENERGY_ATTACHMENT(store, state, effect, this, target => target.isEvolved());
    if (effect instanceof AfterAttachEnergyEffect && effect.energyCard === this && !effect.discardEnergy) {
      effect.player.marker.addMarker(this.BOOST_MARKER, this);
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      if (effect.source.isEvolved()) {
        effect.energyMap.push({ card: this, provides: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS] });
      }

      return state;
    }

    if (effect instanceof BetweenTurnsEffect && effect.player.marker.hasMarker(this.BOOST_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.BOOST_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.cards.includes(this) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
          MOVE_CARDS(store, state, cardList, player.discard, { cards: [this], sourceCard: this });
        }
      });
    }

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)
      && !IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.player.active)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    return state;
  }
}