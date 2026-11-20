import { CardType, EnergyType } from '../../game/store/card/card-types';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_SPECIAL_ENERGY_BLOCKED, WAS_KNOCKED_OUT_BY_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { registerKnockOutRescue } from '../../game/store/prefabs/knock-out-effects';

export class RescueEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'TM';

  public name = 'Rescue Energy';

  public fullName = 'Rescue Energy TM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '90';

  public readonly RESCUE_ENERGY_MAREKER = 'RESCUE_ENERGY_MAREKER';

  public text =
    'Rescue Energy provides [C] Energy. If the Pokemon this card is attached ' +
    'to is Knocked Out by damage from an attack, put that Pokemon back into ' +
    'your hand. (Discard all cards attached to that Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && (effect.target.cards.includes(this) || effect.target.energies.cards.includes(this)) && !IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, this, effect.target)) {
      registerKnockOutRescue(store, state, effect, this);
    }

    // Keep resolving older saved matches that already queued this effect.
    if (effect instanceof BetweenTurnsEffect && effect.player.discard.cards.includes(this)) {
      for (const player of state.players) {
        if (!player.marker.hasMarker(this.RESCUE_ENERGY_MAREKER)) continue;
        const cards = player.marker.markers
          .filter(marker => marker.name === this.RESCUE_ENERGY_MAREKER)
          .flatMap(marker => marker.source ? [marker.source] : []);
        player.discard.moveCardsTo(cards, player.hand);
        player.marker.removeMarker(this.RESCUE_ENERGY_MAREKER);
      }
    }
    return state;
  }
}
