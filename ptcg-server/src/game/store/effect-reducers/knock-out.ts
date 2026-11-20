import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { CardTag } from '../card/card-types';
import { KnockOutEffect } from '../effects/game-effects';
import { MOVE_CARDS } from '../prefabs/prefabs';
import { SelectPrompt } from '../prompts/select-prompt';
import { CardList } from '../state/card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

export function* resolveKnockOutBeforeDiscard(
  next: () => void, store: StoreLike, state: State, effect: KnockOutEffect
): Generator<State, State, void> {
  const choices = [...effect.beforeDiscard.values()];
  while (choices.length) {
    const available = choices.filter(choice => choice.canResolve());
    if (!available.length) break;

    let chosen = available[0];
    if (available.length > 1) {
      store.prompt(state, new SelectPrompt(
        state.players[state.activePlayer].id,
        GameMessage.CHOOSE_KNOCK_OUT_EFFECT,
        available.map(choice => choice.label),
        { allowCancel: false }
      ), (index: number) => {
        if (!Number.isInteger(index) || !available[index]) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        chosen = available[index];
      });
      yield store.waitPrompt(state, next);
    }
    choices.splice(choices.indexOf(chosen), 1);
    chosen.resolve();
    if (store.hasPrompts()) yield store.waitPrompt(state, next);
  }

  state = discardKnockedOutPokemon(store, state, effect);
  if (store.hasPrompts()) yield store.waitPrompt(state, next);
  return state;
}

export function discardKnockedOutPokemon(store: StoreLike, state: State, effect: KnockOutEffect): State {
  const card = effect.target.getPokemonCard();
  if (!card) return state;

  // A damage-provenance opt-in differs from Lost City: ALL attachments go too.
  if (effect.knockOutDestination === 'lostzone') {
    const allCards = new CardList();
    const seen = new Set<Card>();
    const collect = (attached: Card) => {
      if (seen.has(attached)) { return; }
      seen.add(attached);
      allCards.cards.push(attached);
      if (attached.cards) {
        const nested = attached.cards.cards.splice(0);
        nested.forEach(collect);
      }
    };
    [...effect.target.cards, ...effect.target.tools, ...effect.target.energies.cards].forEach(collect);
    effect.target.cards = [];
    effect.target.tools = [];
    effect.target.energies.cards = [];
    effect.target.damage = 0;
    effect.target.clearEffects();
    state = MOVE_CARDS(store, state, allCards, effect.player.lostzone);
  } else if (effect.target.marker.hasMarker('LOST_CITY_MARKER') || card.tags.includes(CardTag.PRISM_STAR)) {
    const lostZoned = new CardList();
    const attachedCards = new CardList();
    // Fossils played as Pokémon remain Trainer cards. Remember their
    // in-play role before clearing the slot, including an evolution stack.
    const pokemonCards = new Set<Card>(effect.target.getPokemons());
    const additionalAttachments = [...new Set([...effect.target.tools, ...effect.target.energies.cards])]
      .filter(attached => !effect.target.cards.includes(attached));

    // Clear damage and effects before splitting cards
    effect.target.damage = 0;
    effect.target.clearEffects();

    // Splice in reverse so indices remain valid; do NOT pre-move tools/energies
    // or effect.target.cards shrinks and later splice(indices[i], 1) can be out of bounds
    while (effect.target.cards.length > 0) {
      const removedCard = effect.target.cards.splice(effect.target.cards.length - 1, 1)[0];

      // Handle cardlist cards (energy, tools, etc.)
      if (removedCard.cards) {
        const cards = removedCard.cards;
        while (cards.cards.length > 0) {
          const card = cards.cards[0];
          attachedCards.cards.push(card);
          cards.cards.splice(0, 1);
        }
      }

      // Handle the main card
      if (pokemonCards.has(removedCard) || removedCard.tags.includes(CardTag.PRISM_STAR)) {
        lostZoned.cards.push(removedCard);
      } else {
        attachedCards.cards.push(removedCard);
      }
    }

    attachedCards.cards.push(...additionalAttachments);

    // Clear refs so the slot is fully emptied
    effect.target.tools = [];
    effect.target.energies.cards = [];

    // Move attached cards to discard
    if (attachedCards.cards.length > 0) {
      state = MOVE_CARDS(store, state, attachedCards, effect.player.discard);
    }

    // Move Pokémon to lost zone
    if (lostZoned.cards.length > 0) {
      state = MOVE_CARDS(store, state, lostZoned, effect.player.lostzone);
    }
  } else {
    // Default behavior - move to discard
    const tools = new Set(effect.target.tools);
    // Move tools to discard BEFORE clearing effects (directly)
    for (const tool of tools) {
      effect.target.moveCardTo(tool, effect.player.discard);
    }
    // Older slots can reference a Tool in both lists. The full-slot
    // move below must not discard the same physical Tool again.
    effect.target.tools = [];
    effect.target.clearEffects();
    state = MOVE_CARDS(store, state, effect.target, effect.player.discard);
  }
  return state;
}
