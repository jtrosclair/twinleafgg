import { Player, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from '../../game/store/prefabs/prefabs';

export class HoleDiggingShovel extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'I';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Hole-Digging Shovel';
  public fullName: string = 'Hole-Digging Shovel M3';
  public text: string = 'Discard the top 2 cards of your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      effect.preventDefault = true;

      const count = Math.min(2, player.deck.cards.length);
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, count, this, this);
    }

    return state;
  }
}
