import { Card, ChooseCardsPrompt, GameError, GameMessage, SelectOptionPrompt, StateUtils } from '../../game';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class PremierBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Premier Ball';
  public fullName: string = 'Premier Ball GE';

  public text: string = 'Search your deck or your discard pile for a Pokémon LV.X, show it to your opponent, and put it into your hand. If you search your deck, shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const isLevelX = (card: Card) => card instanceof PokemonCard && card.stage === Stage.LV_X;
      const levelXInDiscard = player.discard.cards.some(isLevelX);
      if (player.deck.cards.length === 0 && !levelXInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const choose = (source: CardList, fromDeck: boolean) => {
        const blocked = source.cards.map((card, index) => isLevelX(card) ? -1 : index).filter(index => index >= 0);
        store.prompt(state, new ChooseCardsPrompt(
          player, GameMessage.CHOOSE_CARD_TO_HAND, source,
          { superType: SuperType.POKEMON, stage: Stage.LV_X },
          { min: fromDeck ? 0 : 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          if (!Array.isArray(selected) || selected.length > 1 || (!fromDeck && selected.length !== 1) ||
            selected.some(card => !card || !source.cards.includes(card) || !isLevelX(card))) {
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
      } else if (!levelXInDiscard) {
        choose(player.deck, true);
      } else {
        return store.prompt(state, new SelectOptionPrompt(
          player.id, GameMessage.CHOOSE_OPTION,
          ['Search your deck for a Pokémon LV.X',
            'Search your discard pile for a Pokémon LV.X'],
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
