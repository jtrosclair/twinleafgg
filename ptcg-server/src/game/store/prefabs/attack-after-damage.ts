import { GameLog } from '../../game-message';
import { CheckHpEffect } from '../effects/check-effects';
import type { AfterAttackEffect } from '../effects/game-phase-effects';
import { CoinFlipEffect } from '../effects/play-card-effects';
import { MarkerConstants } from '../markers/marker-constants';
import type { CardType } from '../card/card-types';
import type { Player } from '../state/player';
import type { AttackEffect } from '../effects/game-effects';
import type { AttackDamageKnockOut, PokemonCardList } from '../state/pokemon-card-list';
import type { State } from '../state/state';
import type { StoreLike } from '../store-like';

type AfterDamageCallback = (store: StoreLike, state: State) => State;

// AttackEffect is transient, as are prompt continuations. Keeping callbacks
// outside State avoids persisting executable code in puzzle snapshots.
const pending = new WeakMap<AttackEffect, AfterDamageCallback[]>();
interface AttackPayment {
  player: Player;
  source: PokemonCardList;
  cost: readonly CardType[];
}
interface AttackDamageScope { state: State; effects: AttackEffect[]; payment?: AttackPayment; }
const scopes = new WeakMap<State, AttackDamageScope[]>();

/** Track nested legacy copy effects until the parent attack has dealt damage. */
export function beginAttackDamageScope(state: State, payment?: AttackPayment): AttackDamageScope {
  const scope: AttackDamageScope = { state, effects: [], payment };
  const stack = scopes.get(state) ?? [];
  stack.push(scope);
  scopes.set(state, stack);
  return scope;
}

/** Copies use the payment for the triggering attack, including its cost modifiers. */
export function getAttackPayment(state: State, player: Player): AttackPayment | undefined {
  const stack = scopes.get(state);
  if (!stack) return;
  for (let index = stack.length - 1; index >= 0; index--) {
    const payment = stack[index].payment;
    if (payment?.player === player) return payment;
  }
}

export function cancelAttackDamageScope(scope: AttackDamageScope): void {
  for (const effect of scope.effects) pending.delete(effect);
  const stack = scopes.get(scope.state);
  if (!stack) return;
  const index = stack.indexOf(scope);
  if (index >= 0) stack.splice(index, 1);
  if (!stack.length) scopes.delete(scope.state);
}

/** Discard continuations when a Store resets or restores this state. */
export function clearAttackDamageScopes(state: State): void {
  const stack = scopes.get(state);
  if (!stack) return;
  for (const scope of stack) for (const effect of scope.effects) pending.delete(effect);
  scopes.delete(state);
}

/** Schedule an attack's non-damage effects after its outgoing damage. */
export function afterAttackDamage(state: State, effect: AttackEffect, callback: AfterDamageCallback): void {
  const effects = pending.get(effect);
  if (effects) effects.push(callback);
  else pending.set(effect, [callback]);
  const stack = scopes.get(state);
  const scope = stack && stack[stack.length - 1];
  if (scope && !scope.effects.includes(effect)) scope.effects.push(effect);
}

/** Resolve in registration order, yielding to any prompts between effects. */
export function* resolveAfterAttackDamage(
  next: () => void, store: StoreLike, state: State, effect: AttackEffect
): IterableIterator<State> {
  let count = 0;
  while (pending.has(effect)) {
    const callbacks = pending.get(effect)!;
    pending.delete(effect);
    if (store.hasPrompts()) yield store.waitPrompt(state, next);
    for (const callback of callbacks) {
      // A buggy effect must not keep the synchronous attack loop alive forever.
      if (++count > 256) throw new Error('Too many post-damage attack effects');
      state = callback(store, state);
      if (store.hasPrompts()) yield store.waitPrompt(state, next);
    }
  }
  return state;
}

/** Finish nested copied attacks that implement their own legacy damage loop. */
export function* finishAttackDamageScope(
  next: () => void, store: StoreLike, state: State, scope: AttackDamageScope
): IterableIterator<State> {
  try {
    let rounds = 0;
    // A later effect may register work on an earlier attack, so continue until
    // every effect in this scope has drained (or a broken cycle is detected).
    while (scope.effects.some(effect => pending.has(effect))) {
      if (++rounds > 256) throw new Error('Too many post-damage attack effect rounds');
      for (let i = 0; i < scope.effects.length; i++) {
        state = yield* resolveAfterAttackDamage(next, store, state, scope.effects[i]);
      }
    }
    return state;
  } finally {
    cancelAttackDamageScope(scope);
  }
}

const checkedForStrongWilled = new WeakSet<AttackDamageKnockOut>();

/** Complete attack effects and their choices before testing effects that can prevent a Knock Out. */
export function* resolveAfterAttack(
  next: () => void, store: StoreLike, state: State, effect: AfterAttackEffect
): IterableIterator<State> {
  state = store.reduceEffect(state, effect);
  if (store.hasPrompts()) yield store.waitPrompt(state, next);

  const { opponent } = effect;
  const target = opponent.active;
  const hit = target.attackDamageKnockOut;
  if (!hit || hit.turn !== state.turn || hit.playerId !== effect.player.id || effect.originalDefender !== target
    || checkedForStrongWilled.has(hit)) return state;

  const strongWilled = target.marker.hasMarker(MarkerConstants.STRONG_WILLED)
    || target.marker.markers.some(marker => marker.name === MarkerConstants.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER
      && marker.source?.fullName === 'Machamp LV.X SF');
  const pokemon = target.getPokemonCard();
  if (!strongWilled || !pokemon) return state;

  const hp = new CheckHpEffect(opponent, target);
  state = store.reduceEffect(state, hp);
  if (target.damage < hp.hp) return state;
  checkedForStrongWilled.add(hit);

  // A switch caused by an attack can clear Strong-Willed before this check.
  const coin = new CoinFlipEffect(opponent, heads => {
    if (!heads) return;
    target.damage = hp.hp - 10;
    target.attackDamageKnockOut = undefined;
    store.log(state, GameLog.LOG_SURVIVES_ON_TEN_HP, { pokemon: pokemon.name, reason: 'Strong-Willed' });
  });
  coin.skipReflipStadium = true;
  state = store.reduceEffect(state, coin);
  if (store.hasPrompts()) yield store.waitPrompt(state, next);
  return state;
}
