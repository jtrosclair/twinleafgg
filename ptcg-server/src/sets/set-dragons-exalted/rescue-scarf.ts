import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { registerKnockOutRescue } from '../../game/store/prefabs/knock-out-effects';

export class RescueScarf extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DRX';

  public name: string = 'Rescue Scarf';

  public fullName: string = 'Rescue Scarf DRX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public text: string =
    'If the Pokemon this card is attached to is Knocked Out by damage from ' +
    'an attack, put that Pokemon into your hand. (Discard all cards ' +
    'attached to that Pokemon.)';

  public readonly RESCUE_SCARF_MAREKER = 'RESCUE_SCARF_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && effect.target.tools.includes(this) && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      registerKnockOutRescue(store, state, effect, this);
    }

    // Keep resolving older saved matches that already queued this effect.
    if (effect instanceof BetweenTurnsEffect) {
      for (const player of state.players) {
        if (!player.marker.hasMarker(this.RESCUE_SCARF_MAREKER)) continue;
        const cards = player.marker.markers
          .filter(marker => marker.name === this.RESCUE_SCARF_MAREKER)
          .flatMap(marker => marker.source ? [marker.source] : []);
        player.discard.moveCardsTo(cards, player.hand);
        player.marker.removeMarker(this.RESCUE_SCARF_MAREKER);
      }
    }
    return state;
  }
}
