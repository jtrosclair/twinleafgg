import { Card, GameError, GameMessage, Player, State, StoreLike, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class RedeemableTicket extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'I';

  public set: string = 'JTG';

  public name: string = 'Redeemable Ticket';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public fullName: string = 'Redeemable Ticket JTG';

  public text: string =
    'Count your Prize cards and shuffle them face down, then put them at the bottom of your deck. If you do, add that many cards from the top of your deck to your Prize cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.getPrizeLeft() > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const prizes = player.prizes.filter(p => p.cards.length > 0);
      const prizeCount = prizes.reduce((sum, p) => sum + p.cards.length, 0);

      if (prizeCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Collect all prize cards
      const allPrizeCards: Card[] = [];
      prizes.forEach(p => allPrizeCards.push(...p.cards));

      // Shuffle the prize cards
      this.shuffleArray(allPrizeCards);

      // The first deck element is the top. Put the shuffled prizes underneath.
      prizes.forEach(p => {
        p.cards = [];
        p.isSecret = true;
        p.isPublic = false;
        p.faceUpPrize = false;
        p.markedAsNotSecret = false;
      });
      player.deck.cards.push(...allPrizeCards);

      // Draw cards from the top of the deck to the prize cards
      for (let i = 0; i < prizeCount; i++) {
        const prize = player.prizes.find(p => p.cards.length === 0);
        if (!prize || player.deck.cards.length === 0) {
          break;
        }
        state = MOVE_CARDS(store, state, player.deck, prize, { count: 1, sourceCard: this });
        prize.isSecret = true;
        prize.isPublic = false;
        prize.faceUpPrize = false;
        prize.markedAsNotSecret = false;
      }
      return state;
    }

    return state;
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
