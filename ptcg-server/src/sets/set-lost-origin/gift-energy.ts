import { CardType, EnergyType } from '../../game/store/card/card-types';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, IS_SPECIAL_ENERGY_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';


export class GiftEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '171';

  public regulationMark = 'F';

  public name = 'Gift Energy';

  public fullName = 'Gift Energy LOR';

  public readonly GIFT_ENERGY_MARKER = 'GIFT_ENERGY_MARKER';

  public text =
    'As long as this card is attached to a Pokémon, it provides [C] Energy. ' +
    ' ' +
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, draw cards until you have 7 cards in your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect)
      && (effect.target.cards.includes(this) || effect.target.energies.cards.includes(this))) {
      const player = effect.player;
      if (!IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.target)) {
        if (effect.resolveBeforeDiscard) {
          effect.beforeDiscard.set(this, {
            label: this.name,
            canResolve: () => player.hand.cards.length < 7 && player.deck.cards.length > 0,
            resolve: () => DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7)
          });
        } else {
          DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);
        }
      }
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {

        if (!player.marker.hasMarker(this.GIFT_ENERGY_MARKER)) {
          return;
        }

        // Resolve a pending draw from a snapshot saved by an older engine.
        DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);
        player.marker.removeMarker(this.GIFT_ENERGY_MARKER);
      });
    }
    return state;
  }
}
