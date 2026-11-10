import type { AttackEffect } from '../effects/game-effects';
import type { State } from '../state/state';
import type { StoreLike } from '../store-like';

type AfterDamageCallback = (store: StoreLike, state: State) => State;

// AttackEffect is transient, as are prompt continuations. Keeping callbacks
// outside State avoids persisting executable code in puzzle snapshots.
const pending = new WeakMap<AttackEffect, AfterDamageCallback[]>();
interface AttackDamageScope { state: State; effects: AttackEffect[]; }
const scopes = new WeakMap<State, AttackDamageScope[]>();

/** Track nested legacy copy effects until the parent attack has dealt damage. */
export function beginAttackDamageScope(state: State): AttackDamageScope {
  const scope = { state, effects: [] };
  const stack = scopes.get(state) ?? [];
  stack.push(scope);
  scopes.set(state, stack);
  return scope;
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
