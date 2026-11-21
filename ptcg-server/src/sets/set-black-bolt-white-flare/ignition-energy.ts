import { PlayerType, StateUtils } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_SPECIAL_ENERGY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class IgnitionEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name = 'Ignition Energy';
  public fullName = 'Ignition Energy SV11W';
  public text = `If this card is attached to 1 of your Pokémon, discard it at the end of the turn.

This card provides 1 [C] Energy while it is attached to a Pokémon.

If this card is attached to an Evolution Pokémon, it provides [C][C][C] Energy instead.`;

  public IGNITION_ENERGY_MARKER = 'IGNITION_ENERGY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const provides = StateUtils.isEvolutionPokemon(effect.source)
        ? [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS] : [CardType.COLORLESS];
      effect.energyMap.push({ card: this, provides });
      return state;
    }

    if (effect instanceof BetweenTurnsEffect && effect.player === state.players[state.activePlayer]) {
      const player = effect.player;
      player.marker.removeMarker(this.IGNITION_ENERGY_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.cards.includes(this) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, cardList)) {
          cardList.moveCardTo(this, player.discard);
        }
      });
    }
    return state;
  }
}
