import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { GameLog } from '../../game';
import { APPLY_ONCE_PER_CARD, IS_TOOL_BLOCKED, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { Player } from '../../game/store/state/player';

export class AmuletofHope extends TrainerCard {

  public tags = [CardTag.ACE_SPEC];

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SSP';

  public setNumber = '162';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Amulet of Hope';

  public fullName: string = 'Amulet of Hope SSP';

  public text: string =
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.';

  public readonly AMULET_OF_HOPE_MARKER = 'AMULET_OF_HOPE_MARKER';

  private searchDeck(store: StoreLike, state: State, player: Player, effect: Effect): void {
    if (player.deck.cards.length === 0) return;
    store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: this.name });
    SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 0, max: 3, allowCancel: false }, effect);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.target.tools.includes(this)
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)) {
      if (effect.resolveBeforeDiscard) {
        effect.beforeDiscard.set(this, {
          label: this.name,
          canResolve: () => effect.player.deck.cards.length > 0,
          resolve: () => this.searchDeck(store, state, effect.player, effect)
        });
      } else if (APPLY_ONCE_PER_CARD(effect, this)) {
        this.searchDeck(store, state, effect.player, effect);
      }
    }

    if (effect instanceof BetweenTurnsEffect) {
      // Older snapshots may already have a queued search from a Knock Out.
      for (const player of state.players) {
        if (!player.marker.hasMarker(this.AMULET_OF_HOPE_MARKER)) continue;
        player.marker.removeMarker(this.AMULET_OF_HOPE_MARKER);
        this.searchDeck(store, state, player, effect);
      }
    }

    return state;
  }

}
