import { Card, ChooseCardsPrompt, GameError, GameMessage, SelectOptionPrompt, StateUtils } from '../../game';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HolonTransceiver extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Holon Transceiver';
  public fullName: string = 'Holon Transceiver DS';

  public text: string = 'Search your deck for a Supporter card that has Holon in its name, show it to your opponent, and put it into your hand. Shuffle your deck afterward. Or, search your discard pile for a Supporter card that has Holon in its name, show it to your opponent, and put it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const isHolonSupporter = (card: Card) => card instanceof TrainerCard
        && card.trainerType === TrainerType.SUPPORTER && card.name.includes('Holon');
      const holonInDiscard = player.discard.cards.some(isHolonSupporter);
      if (player.deck.cards.length === 0 && !holonInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const choose = (source: CardList, fromDeck: boolean) => {
        const blocked = source.cards.map((card, index) => isHolonSupporter(card) ? -1 : index).filter(index => index >= 0);
        store.prompt(state, new ChooseCardsPrompt(
          player, GameMessage.CHOOSE_CARD_TO_HAND, source,
          { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
          { min: fromDeck ? 0 : 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          if (!Array.isArray(selected) || selected.length > 1 || (!fromDeck && selected.length !== 1) ||
            selected.some(card => !card || !source.cards.includes(card) || !isHolonSupporter(card))) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
          }
          if (selected.length === 0) {
            if (fromDeck) SHUFFLE_DECK(store, state, player);
            return;
          }
          // Keep the chosen public reveal before movement, and shuffle only after movement.
          store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
            MOVE_CARDS(store, state, source, player.hand, { cards: selected, sourceCard: this, sourceEffect: effect });
            if (fromDeck) SHUFFLE_DECK(store, state, player);
          });
        });
      };

      if (player.deck.cards.length === 0) {
        choose(player.discard, false);
      } else if (!holonInDiscard) {
        choose(player.deck, true);
      } else {
        return store.prompt(state, new SelectOptionPrompt(
          player.id, GameMessage.CHOOSE_OPTION,
          ['Search your deck for a Supporter card that has Holon in its name',
            'Search your discard pile for a Supporter card that has Holon in its name'],
          { allowCancel: false }
        ), choice => {
          if (choice !== 0 && choice !== 1) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
          choose(choice === 0 ? player.deck : player.discard, choice === 0);
        });
      }
    }
    return state;
  }
}
