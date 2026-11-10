import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, GameError, GameMessage, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Pyukumuku extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Pitch a Pyukumuku',
    useFromHand: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in your hand, you may reveal it and put it on the bottom of your deck. If you do, draw a card. You can\'t use more than 1 Pitch a Pyukumuku Ability each turn.'
  }];

  public attacks = [{
    name: ' Knuckle Punch',
    cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public set: string = 'FST';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Pyukumuku';

  public fullName: string = 'Pyukumuku FST';

  public readonly PYUK_MARKER = 'PYUK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.PYUK_MARKER)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const deckBottom = new CardList();
      player.marker.addMarker(this.PYUK_MARKER, this);
      player.hand.moveCardTo(this, deckBottom);
      deckBottom.moveTo(player.deck);
      player.deck.moveTo(player.hand, 1);
    }

    return state;
  }

  // A used Ability belongs to the player for the turn even if its source
  // leaves play or enters the Lost Zone. Store dispatches this after an
  // accepted end turn using the marker's retained source reference.
  public reducePlayerMarkerEffect(_store: StoreLike, state: State, effect: Effect, owner: import('../../game/store/state/player').Player, marker: import('../../game/store/state/card-marker').MarkerItem): State {
    if (effect instanceof EndTurnEffect && effect.player === owner && marker.name === this.PYUK_MARKER) {
      owner.marker.removeMarker(this.PYUK_MARKER, this);
    }
    return state;
  }

}
