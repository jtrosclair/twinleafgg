import type { Player } from './player';
import { GamePhase, State } from './state';

export interface ActiveAbilityLockEntry {
  playerId: number;
  cardId: number;
}

const observedOrders = new WeakMap<State, ActiveAbilityLockEntry[]>();
const playerStates = new WeakMap<Player, State>();

function sameEntry(left: ActiveAbilityLockEntry, right: ActiveAbilityLockEntry): boolean {
  return left.playerId === right.playerId && left.cardId === right.cardId;
}

export function recordActiveAbilityLockOrder(state: State, starting = false): ActiveAbilityLockEntry[] {
  if (!starting && state.phase <= GamePhase.SETUP) {
    return [];
  }
  const active: ActiveAbilityLockEntry[] = [];
  for (const player of state.players) {
    playerStates.set(player, state);
    const card = player.active.getPokemonCard();
    if (card?.activeAbilityLock) {
      active.push({ playerId: player.id, cardId: card.id });
    }
  }

  // Starting Pokémon are revealed together. An older snapshot without
  // activation history uses the turn player to break the same tie.
  const turnPlayer = state.players[state.activePlayer];
  if (active.length === 2 && active[1].playerId === turnPlayer?.id) {
    active.reverse();
  }
  const previous = starting ? [] : Array.isArray(state.activeAbilityLockOrder)
    ? state.activeAbilityLockOrder : observedOrders.get(state) ?? [];
  const order: ActiveAbilityLockEntry[] = [];
  for (const entry of previous) {
    if (entry && active.some(candidate => sameEntry(candidate, entry))
      && !order.some(candidate => sameEntry(candidate, entry))) {
      order.push(entry);
    }
  }
  for (const entry of active) {
    if (!order.some(previousEntry => sameEntry(previousEntry, entry))) {
      order.push(entry);
    }
  }
  observedOrders.set(state, order);
  // A lone Active needs no saved timestamp: it precedes any future challenger.
  if (order.length === 2) {
    state.activeAbilityLockOrder = order;
  } else if (state.activeAbilityLockOrder !== undefined) {
    state.activeAbilityLockOrder = undefined;
  }
  return order;
}

export function recordActiveAbilityLockSwitch(player: Player, state?: State): void {
  const board = state ?? playerStates.get(player);
  if (board) {
    recordActiveAbilityLockOrder(board);
  }
}
