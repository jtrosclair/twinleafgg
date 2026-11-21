import { BoardEffect } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonReplacedEffect } from '../effects/game-effects';
import { CardList } from '../state/card-list';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { recordActiveAbilityLockSwitch } from '../state/active-ability-lock-order';
import { canPlacePokemon } from './bench-play-reactions';
import { MOVE_CARDS } from './prefabs';

/** Switch just the top card, keeping the same Pokémon's in-play history. */
export function swapInPlayPokemon(store: StoreLike, state: State, player: Player,
  target: PokemonCardList, source: CardList, replacement: PokemonCard, destination: CardList,
  sourceAbility?: PokemonCard): boolean {
  const previous = target.getPokemonCard();
  if (!previous || (target !== player.active && !player.bench.includes(target))
    || !source.cards.includes(replacement) || !canPlacePokemon(store, state, player, replacement, sourceAbility)) {
    return false;
  }

  source.moveCardTo(replacement, target);
  if (destination === player.discard) {
    MOVE_CARDS(store, state, target, destination, { cards: [previous], sourceCard: sourceAbility });
  } else {
    target.moveCardTo(previous, destination);
  }
  const movedToActive = player.movedToActiveThisTurn.includes(previous.id);
  player.movedToActiveThisTurn = player.movedToActiveThisTurn
    .filter(id => id !== previous.id && id !== replacement.id);
  if (movedToActive) player.movedToActiveThisTurn.push(replacement.id);
  replacement.movedToActiveThisTurn = previous.movedToActiveThisTurn;
  replacement.damageTakenLastTurn = previous.damageTakenLastTurn;
  replacement.knockOutAtEndOfTurnPlayerId = previous.knockOutAtEndOfTurnPlayerId;
  replacement.retreatCostIncreaseNextTurn = previous.retreatCostIncreaseNextTurn;
  clearPokemonCardHistory(previous);
  if (!replacement.powers.some(power => previous.powers.some(old => old.name === power.name))) {
    target.removeBoardEffect(BoardEffect.ABILITY_USED);
  }
  if (target === player.active) recordActiveAbilityLockSwitch(player, state);
  store.reduceEffect(state, new PokemonReplacedEffect(player, target, previous, replacement));
  return true;
}

function clearPokemonCardHistory(card: PokemonCard): void {
  card.movedToActiveThisTurn = false;
  card.damageTakenLastTurn = 0;
  card.knockOutAtEndOfTurnPlayerId = undefined;
  card.retreatCostIncreaseNextTurn = undefined;
}

/** Discard the whole old Pokémon and put a new Pokémon into its position. */
export function replaceAndDiscardPokemon(store: StoreLike, state: State, player: Player,
  target: PokemonCardList, source: CardList, replacement: PokemonCard, sourceCard: PokemonCard): boolean {
  const benchIndex = player.bench.indexOf(target);
  if (target.getPokemonCard() !== sourceCard || (target !== player.active && benchIndex < 0)
    || !source.cards.includes(replacement) || !canPlacePokemon(store, state, player, replacement, sourceCard)) {
    return false;
  }

  const discarded = new CardList();
  discarded.cards = [...new Set([...target.cards, ...target.energies.cards, ...target.tools])];
  discarded.cards.forEach(card => card.clearAttachedEnergyForm?.());
  const leaving = target.getPokemons();
  leaving.forEach(clearPokemonCardHistory);
  clearPokemonCardHistory(replacement);
  player.movedToActiveThisTurn = player.movedToActiveThisTurn
    .filter(id => id !== replacement.id && !leaving.some(card => card.id === id));
  const fresh = new PokemonCardList();
  fresh.isPublic = target.isPublic;
  fresh.isSecret = target.isSecret;
  fresh.pokemonPlayedTurn = state.turn;
  source.moveCardTo(replacement, fresh);
  target.cards = [];
  target.energies.cards = [];
  target.tools = [];
  if (target === player.active) {
    player.marker.removePokemonScopedMarkers();
    player.active = fresh;
    recordActiveAbilityLockSwitch(player, state);
  } else {
    player.bench[benchIndex] = fresh;
  }
  MOVE_CARDS(store, state, discarded, player.discard, { sourceCard });
  return true;
}
