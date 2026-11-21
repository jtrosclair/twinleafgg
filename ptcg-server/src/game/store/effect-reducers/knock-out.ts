import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { CardTag } from '../card/card-types';
import { KnockOutEffect } from '../effects/game-effects';
import { MOVE_CARDS } from '../prefabs/prefabs';
import { SelectPrompt } from '../prompts/select-prompt';
import { CardList } from '../state/card-list';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { discardStadiumSlot } from '../stadium-utils';

function lostCityMarker(effect: KnockOutEffect) {
  return effect.target.marker.markers.find(marker => marker.name === 'LOST_CITY_MARKER');
}

function getBeforeDiscardChoices(effect: KnockOutEffect) {
  const choices = [...effect.beforeDiscard.values()];
  const city = lostCityMarker(effect);
  if (effect.rescueSource || (effect.knockOutDestination === 'lostzone' && city)) {
    const pokemonCanBeRedirected = () => !effect.pokemonGoingToLostZone && !!effect.target.getPokemonCard();
    if (effect.knockOutDestination === 'lostzone') {
      choices.push({
        label: effect.knockOutDestinationLabel ?? 'Lost Zone',
        canResolve: pokemonCanBeRedirected,
        resolve: () => { effect.pokemonGoingToLostZone = true; }
      });
    }
    if (city) {
      choices.push({
        label: city.source?.name ?? 'Lost City',
        canResolve: pokemonCanBeRedirected,
        resolve: () => {
          effect.pokemonGoingToLostZone = true;
          // Lost City resolved first. Only the Pokémon goes to the Lost Zone.
          effect.knockOutDestination = undefined;
        }
      });
    }
  }
  return choices;
}

export function* resolveKnockOutGroup(
  next: () => void, store: StoreLike, state: State, effects: KnockOutEffect[]
): Generator<State, State, void> {
  const choices = effects.flatMap(effect => {
    const holder = effect.target.getPokemonCard()?.name;
    const benchIndex = effect.player.bench.indexOf(effect.target);
    const location = benchIndex < 0 ? 'Active' : String(benchIndex + 1);
    const suffix = effects.length > 1 && holder ? ` (${holder}, ${location})` : '';
    return getBeforeDiscardChoices(effect).map(choice => ({ ...choice, label: choice.label + suffix }));
  });
  const turnPlayer = state.players[state.activePlayer];
  const orderPlayer = state.phase === GamePhase.BETWEEN_TURNS && !turnPlayer.usedTurnSkip
    ? state.players.find(player => player !== turnPlayer) ?? turnPlayer : turnPlayer;
  while (choices.length) {
    const available = choices.filter(choice => choice.canResolve());
    if (!available.length) break;

    let chosen = available[0];
    if (available.length > 1) {
      store.prompt(state, new SelectPrompt(
        orderPlayer.id,
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

  for (const effect of effects) {
    state = discardKnockedOutPokemon(store, state, effect);
    if (store.hasPrompts()) yield store.waitPrompt(state, next);
  }
  for (const effect of effects) {
    // Resolve the mandatory discard reactions before Water Rescue can remove the discarded cards.
    const reactions = [...effect.afterDiscard.values()]
      .sort((left, right) => Number(!!left.recovery) - Number(!!right.recovery));
    for (const reaction of reactions) {
      reaction.resolve();
      if (store.hasPrompts()) yield store.waitPrompt(state, next);
    }
  }
  return state;
}

export function discardKnockedOutPokemon(store: StoreLike, state: State, effect: KnockOutEffect): State {
  const rescued = effect.rescuedPokemon;
  const card = rescued?.card ?? effect.target.getPokemonCard();
  if (!card) return state;

  const stadium = effect.stadiumReplacement;
  if (stadium && effect.target.cards.includes(stadium)) {
    for (const owner of state.players) discardStadiumSlot(owner, true);
    const nested = stadium.cards.cards.splice(0);
    for (const attachment of nested) {
      if (!effect.target.cards.includes(attachment) && !effect.target.tools.includes(attachment)
        && !effect.target.energies.cards.includes(attachment)) effect.target.cards.push(attachment);
    }
    state = MOVE_CARDS(store, state, effect.target, effect.player.stadium, { cards: [stadium], sourceCard: stadium });
  }

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
    [...effect.target.cards, ...effect.target.tools, ...effect.target.energies.cards, ...(rescued?.attachments ?? [])]
      .forEach(collect);
    effect.target.cards = [];
    effect.target.tools = [];
    effect.target.energies.cards = [];
    effect.target.damage = 0;
    effect.target.clearEffects();
    state = MOVE_CARDS(store, state, allCards, effect.player.lostzone);
  } else if (rescued || lostCityMarker(effect) || card.tags.includes(CardTag.PRISM_STAR)) {
    const lostZoned = new CardList();
    const attachedCards = new CardList();
    // Fossils played as Pokémon remain Trainer cards. Remember their
    // in-play role before clearing the slot, including an evolution stack.
    const pokemonCards = new Set<Card>(effect.target.getPokemons());
    const additionalAttachments = [...new Set([
      ...effect.target.tools, ...effect.target.energies.cards, ...(rescued?.attachments ?? [])
    ])]
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
