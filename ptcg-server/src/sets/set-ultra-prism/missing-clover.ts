import { ConfirmPrompt, GameError, GameMessage, ShowCardsPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { MOVE_CARDS, TAKE_X_PRIZES } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class MissingClover extends TrainerCard {

  public trainerType = TrainerType.ITEM;

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '129';

  public name: string = 'Missing Clover';

  public fullName: string = 'Missing Clover UPR';

  public text: string = 'You may play 4 Missing Clover cards at once.\n\n• If you played 1 card, look at the top card of your deck.\n• If you played 4 cards, take a Prize card. (This effect works one time for 4 cards.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_TRAINER_USED(effect, this)) return state;

    const { player } = effect;
    const remaining = player.hand.cards.filter(card => card !== this && card.name === this.name).slice(0, 3);
    const canLook = player.deck.cards.length > 0;
    const canTakePrize = remaining.length === 3 && player.getPrizeLeft() > 0;
    const look = () => store.prompt(state, new ShowCardsPrompt(
      player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, [player.deck.cards[0]]
    ), () => {});
    const takePrize = () => {
      MOVE_CARDS(store, state, player.hand, player.discard, { cards: remaining, sourceCard: this });
      return TAKE_X_PRIZES(store, state, player, 1);
    };

    if (canLook && canTakePrize) {
      return store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_PLAY_ALL_CARDS_AT_ONCE), all => {
        if (all) takePrize();
        else look();
      });
    }
    if (canTakePrize) return takePrize();
    if (canLook) return look();
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
}
