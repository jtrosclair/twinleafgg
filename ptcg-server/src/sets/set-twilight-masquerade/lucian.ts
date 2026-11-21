import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { Card, GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { CoinFlipSequenceEffect } from '../../game/store/effects/play-card-effects';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Lucian extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '157';
  public name: string = 'Lucian';
  public fullName: string = 'Lucian TWM';
  public text: string =
    'Each player shuffles their hand and puts it on the bottom of their deck. If either player put any cards on the bottom of their deck in this way, each player flips a coin. If heads, that player draws 6 cards. If tails, they draw 3 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    return player.hand.cards.some(card => card !== this) || opponent.hand.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    if (player.supporterTurn > 0) throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    if (!this.canPlay(store, state, player)) throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);

    const players = [player, opponent];
    let moved = false;
    for (const owner of players) {
      const cards = owner.hand.cards.filter(card => owner !== player || card !== this);
      if (cards.length === 0) continue;
      this.shuffleCards(cards);
      const move = new MoveCardsEffect(owner.hand, owner.deck, { cards, toBottom: true, sourceCard: this });
      state = store.reduceEffect(state, move);
      moved = moved || cards.some(card => owner.deck.cards.includes(card));
    }

    if (moved) {
      return store.reduceEffect(state, new CoinFlipSequenceEffect(player, players, results => {
        players.forEach((owner, index) => DRAW_CARDS(owner, results[index] ? 6 : 3));
      }));
    }
    return state;
  }

  private shuffleCards(cards: Card[]): void {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}
