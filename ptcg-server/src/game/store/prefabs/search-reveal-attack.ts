import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { PokemonCard } from '../card/pokemon-card';
import { AttackEffect } from '../effects/game-effects';
import { ChooseCardsPrompt, FilterType } from '../prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../prompts/show-cards-prompt';
import { StateUtils } from '../state-utils';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { MOVE_CARDS, SHUFFLE_DECK } from './prefabs';

/** Private-deck search with public reveal followed by movement and shuffle. */
export function SEARCH_DECK_REVEAL_AND_MOVE(
  store: StoreLike, state: State, effect: AttackEffect, source: PokemonCard,
  filter: FilterType, max: number,
): State {
  const player = effect.player;
  if (player.deck.cards.length === 0) return state;
  const opponent = StateUtils.getOpponent(state, player);
  // Capture the real attacker before any asynchronous prompt: legacy copy
  // helpers can invoke the original card's reducer with its own `this`.
  const attacker = effect.source.getPokemonCard() || source;
  return store.prompt(state, new ChooseCardsPrompt(
    player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck, filter,
    { min: 0, max, allowCancel: false }
  ), selected => {
    if (!Array.isArray(selected) || selected.length > max || new Set(selected).size !== selected.length ||
      selected.some((card: Card) => !card || !player.deck.cards.includes(card) ||
        Object.entries(filter).some(([key, value]) => (card as any)[key] !== value))) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    if (selected.length === 0) {
      SHUFFLE_DECK(store, state, player);
      return;
    }
    return store.prompt(state, new ShowCardsPrompt(
      opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected
    ), () => {
      MOVE_CARDS(store, state, player.deck, player.hand, {
        cards: selected, sourceCard: attacker, sourceEffect: effect
      });
      SHUFFLE_DECK(store, state, player);
    });
  });
}
