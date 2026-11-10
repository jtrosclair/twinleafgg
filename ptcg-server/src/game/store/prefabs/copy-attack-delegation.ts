import { GameLog, GameMessage } from '../../game-message';
import { GameError } from '../../game-error';
import { Attack } from '../card/pokemon-types';
import { PokemonCard } from '../card/pokemon-card';
import { AfterDamageEffect, DealDamageEffect, PutCountersEffect, PutDamageEffect } from '../effects/attack-effects';
import { Effect } from '../effects/effect';
import { beginAttackDamageScope, cancelAttackDamageScope, finishAttackDamageScope, resolveAfterAttackDamage } from './attack-after-damage';
import { CheckAttackCostEffect } from '../effects/check-effects';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../effects/game-effects';
import {
  AfterAttackEffect,
  BeforeDoingDamageEffect,
  BeginTurnEffect,
  BetweenTurnsEffect,
  EndTurnEffect,
} from '../effects/game-phase-effects';
import { Player } from '../state/player';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { PlayerType } from '../actions/play-card-action';

export function cloneAttack(attack: Attack): Attack {
  return { ...attack, cost: [...(attack.cost || [])] };
}

export function cloneAttacks(attacks: Attack[]): Attack[] {
  return attacks.map(cloneAttack);
}

export function findAttackIndex(source: PokemonCard, attack: Attack): number {
  const byRef = source.attacks.indexOf(attack);
  if (byRef >= 0) {
    return byRef;
  }
  return source.attacks.findIndex(a => a.name === attack.name);
}

export function withTemporaryDelegatedAttacks<T>(
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  fn: (clonedAttacks: Attack[]) => T,
  clonedAttacks?: Attack[],
): T {
  const saved = copycatCard.attacks;
  const cloned = clonedAttacks ?? cloneAttacks(sourceCard.attacks || []);
  copycatCard.attacks = cloned;
  try {
    return fn(cloned);
  } finally {
    copycatCard.attacks = saved;
  }
}

/** Validate a cloned attack as the copycat, never as the original card's attack. */
export function checkCopiedAttackCost(
  store: StoreLike,
  state: State,
  player: Player,
  sourceCard: PokemonCard,
  attack: Attack,
  copycatCard = player.active.getPokemonCard(),
): { state: State; effect: CheckAttackCostEffect } {
  const clonedAttacks = cloneAttacks(sourceCard.attacks);
  const clonedAttack = clonedAttacks[findAttackIndex(sourceCard, attack)] ?? cloneAttack(attack);
  const effect = new CheckAttackCostEffect(player, clonedAttack);
  const reduce = () => {
    state = store.reduceEffect(state, effect);
    return { state, effect };
  };
  return copycatCard
    ? withTemporaryDelegatedAttacks(copycatCard, sourceCard, reduce, clonedAttacks)
    : reduce();
}

function withSourceMarkerConstants<T>(
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  fn: () => T,
): T {
  const saved: { key: string; hadOwn: boolean; value: unknown }[] = [];

  for (const key of Object.keys(sourceCard)) {
    if (!/MARKER/i.test(key)) {
      continue;
    }
    const value = (sourceCard as any)[key];
    if (typeof value !== 'string') {
      continue;
    }
    saved.push({
      key,
      hadOwn: Object.prototype.hasOwnProperty.call(copycatCard, key),
      value: (copycatCard as any)[key],
    });
    (copycatCard as any)[key] = value;
  }

  try {
    return fn();
  } finally {
    for (const entry of saved) {
      if (entry.hadOwn) {
        (copycatCard as any)[entry.key] = entry.value;
      } else {
        delete (copycatCard as any)[entry.key];
      }
    }
  }
}

/**
 * A class may opt in only when this method implements ALL effects of its
 * attacks, including delayed reactions and cleanup, and no Ability effects.
 * Subclasses overriding reduceEffect must opt in again, because the inherited
 * contract cannot describe their changes. Reprints which inherit that reducer
 * also inherit the contract, including printed attack metadata changes; the
 * subclass is responsible for overriding both methods if its attack behavior
 * changes. In-flight prompt callbacks are not restored by Store.restoreState.
 * Both method lookup and the implementation come from the card prototype, not
 * from a serialized snapshot.
 */
export interface CopiedAttackOwnershipContract {
  reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, attackIndex: number, sourceCard?: PokemonCard): State;
}
type OwnedCopiedAttackReducer = CopiedAttackOwnershipContract['reduceCopiedAttackEffect'];

function ownedCopiedAttackReducer(sourceCard: PokemonCard): OwnedCopiedAttackReducer | undefined {
  // An instance-level override can change attack behavior; do not silently
  // replace it with an inherited implementation. Executable ownership is
  // accepted only from a card class prototype, not data in a snapshot.
  if (Object.prototype.hasOwnProperty.call(sourceCard, 'reduceEffect') ||
      Object.prototype.hasOwnProperty.call(sourceCard, 'reduceCopiedAttackEffect')) return undefined;
  let prototype = Object.getPrototypeOf(sourceCard);
  let depth = 0;
  let effectDepth: number | undefined;
  let reducerDepth: number | undefined;
  let reducer: OwnedCopiedAttackReducer | undefined;
  while (prototype && prototype !== Object.prototype) {
    if (effectDepth === undefined && Object.prototype.hasOwnProperty.call(prototype, 'reduceEffect')) {
      effectDepth = depth;
    }
    if (reducerDepth === undefined && Object.prototype.hasOwnProperty.call(prototype, 'reduceCopiedAttackEffect')) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'reduceCopiedAttackEffect');
      if (typeof descriptor?.value !== 'function') return undefined;
      reducerDepth = depth;
      reducer = descriptor.value;
    }
    prototype = Object.getPrototypeOf(prototype);
    depth++;
  }
  return reducerDepth !== undefined && effectDepth !== undefined && reducerDepth <= effectDepth ? reducer : undefined;
}

function delegateToSource(
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  clonedAttacks: Attack[],
  attackIndex: number,
  store: StoreLike,
  state: State,
  effect: Effect,
): State {
  // Only source-handler calls see this facade. The real Store still fans out to
  // the copycat, Tools, Stadiums, etc., with their own Abilities unchanged.
  // Permission-checked source Abilities are denied: a copied attack does not
  // grant source Ability permission, even during delayed effects. This facade
  // cannot split legacy passive branches that omit PowerEffect permission checks.
  const attackOnlyStore = new Proxy(store, {
    get(target, key) {
      if (key === 'reduceEffect') {
        return (s: State, nestedEffect: Effect) => {
          if (nestedEffect instanceof PowerEffect
            && (nestedEffect.card === copycatCard || nestedEffect.card === sourceCard)) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
          return target.reduceEffect(s, nestedEffect);
        };
      }
      const value = Reflect.get(target, key);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
  const ownedReducer = ownedCopiedAttackReducer(sourceCard);
  return withTemporaryDelegatedAttacks(
    copycatCard,
    sourceCard,
    () => withSourceMarkerConstants(copycatCard, sourceCard, () =>
      ownedReducer
        ? ownedReducer.call(copycatCard, attackOnlyStore, state, effect, attackIndex, sourceCard)
        : sourceCard.reduceEffect.call(copycatCard, attackOnlyStore, state, effect)
    ),
    clonedAttacks,
  );
}

/**
 * Sticky session: keep source reduceEffect bound to the copycat through damage,
 * KO prizes, and multi-turn marker cleanup (attack-only; not Abilities).
 */
interface CopyAttackSession {
  copycatCard: PokemonCard;
  sourceCard: PokemonCard;
  clonedAttacks: Attack[];
  playerId: number;
  attackIndex: number;
  /** Safety cap across either player's EndTurns (turn-skip + Harden linger). */
  endTurnsRemaining: number;
}

// Each State identity is owned by one game; unrelated Stores cannot prune it.
let copyAttackSessions = new WeakMap<State, CopyAttackSession[]>();

const DEFAULT_END_TURN_BUDGET = 4;

/** Serialize only the information needed to rebuild live handler sessions. */
function persistCopyAttackSessions(state: State, sessions: CopyAttackSession[]): void {
  if (!sessions.length) {
    delete state.copiedAttackCheckpoints;
    return;
  }
  state.copiedAttackCheckpoints = sessions.map(session => ({
    copycatCard: session.copycatCard,
    sourceCard: session.sourceCard,
    playerId: session.playerId,
    attackIndex: session.attackIndex,
    selectedAttack: session.clonedAttacks[session.attackIndex],
    endTurnsRemaining: session.endTurnsRemaining,
  }));
}

function sessionsForState(state: State): CopyAttackSession[] {
  const existing = copyAttackSessions.get(state);
  if (existing) return existing;
  const sessions: CopyAttackSession[] = [];
  const checkpoints = Array.isArray(state.copiedAttackCheckpoints) ? state.copiedAttackCheckpoints : [];
  for (const checkpoint of checkpoints) {
    if (!checkpoint || !(checkpoint.copycatCard instanceof PokemonCard) || !(checkpoint.sourceCard instanceof PokemonCard)
      || !Number.isInteger(checkpoint.attackIndex) || checkpoint.attackIndex < 0
      || checkpoint.attackIndex >= checkpoint.sourceCard.attacks.length
      || !Number.isInteger(checkpoint.endTurnsRemaining) || checkpoint.endTurnsRemaining <= 0
      || checkpoint.endTurnsRemaining > DEFAULT_END_TURN_BUDGET
      || !state.players.some(player => player.id === checkpoint.playerId)) continue;
    const clonedAttacks = cloneAttacks(checkpoint.sourceCard.attacks);
    const attack = checkpoint.selectedAttack;
    if (attack && attack.name === clonedAttacks[checkpoint.attackIndex].name) {
      // The checkpoint retains this exact object, including any reference
      // shared with playerLastAttack. Names alone are not unique identities.
      const effect = checkpoint.sourceCard.attacks[checkpoint.attackIndex].effect;
      // Executable behavior always comes from the trusted card definition,
      // never from the serialized snapshot.
      if (typeof effect === 'function') attack.effect = effect;
      else delete attack.effect;
      const reactive = checkpoint.sourceCard.attacks[checkpoint.attackIndex].copiedReactiveAfterDamage;
      if (typeof reactive === 'function') attack.copiedReactiveAfterDamage = reactive;
      else delete attack.copiedReactiveAfterDamage;
      clonedAttacks[checkpoint.attackIndex] = attack;
    }
    sessions.push({ ...checkpoint, clonedAttacks });
  }
  copyAttackSessions.set(state, sessions);
  return sessions;
}

function isCopycatInPlay(state: State, copycatCard: PokemonCard): boolean {
  for (const player of state.players) {
    let found = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
      if (card === copycatCard) {
        found = true;
      }
    });
    if (found) {
      return true;
    }
  }
  return false;
}

function isClonedAttack(session: CopyAttackSession, attack: Attack | undefined): boolean {
  if (attack === undefined) {
    return false;
  }
  return session.clonedAttacks.includes(attack);
}

function targetIncludesCopycat(effect: { target?: { cards?: unknown[] } }, copycatCard: PokemonCard): boolean {
  return !!effect.target?.cards?.includes(copycatCard);
}

/**
 * Attack-only filters so Ability DealDamage boosts do not bleed onto the copycat.
 */
export function shouldDelegateCopyAttackSession(session: CopyAttackSession, state: State, effect: Effect): boolean {
  if (effect instanceof EndTurnEffect
    || effect instanceof BetweenTurnsEffect
    || effect instanceof BeginTurnEffect) {
    return true;
  }

  if (effect instanceof KnockOutEffect) {
    if (state.phase !== GamePhase.ATTACK) {
      return false;
    }
    const attacker = state.players[state.activePlayer];
    return attacker !== undefined && attacker.id === session.playerId;
  }

  if (effect instanceof DealDamageEffect) {
    // Harden-style only — do not match by cloned attack (Ability DealDamage bleed).
    return targetIncludesCopycat(effect, session.copycatCard);
  }

  if (effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) {
    if (targetIncludesCopycat(effect, session.copycatCard)) {
      return true;
    }
    return isClonedAttack(session, effect.attack);
  }

  if (effect instanceof AfterDamageEffect) {
    return isClonedAttack(session, effect.attack);
  }

  if (effect instanceof AttackEffect
    || effect instanceof BeforeDoingDamageEffect
    || effect instanceof AfterAttackEffect) {
    return isClonedAttack(session, effect.attack);
  }

  return false;
}

export function openCopyAttackSession(
  state: State,
  player: Player,
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
  clonedAttacks: Attack[],
  selectedClonedAttack: Attack,
): void {
  const sessions = sessionsForState(state);
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].copycatCard === copycatCard) {
      sessions.splice(i, 1);
    }
  }

  sessions.push({
    copycatCard,
    sourceCard,
    clonedAttacks,
    playerId: player.id,
    attackIndex: clonedAttacks.indexOf(selectedClonedAttack),
    endTurnsRemaining: DEFAULT_END_TURN_BUDGET,
  });

  if (!state.playerLastAttack) {
    state.playerLastAttack = {};
  }
  state.playerLastAttack[player.id] = {
    attack: selectedClonedAttack,
    sourceCard: copycatCard,
  };
  persistCopyAttackSessions(state, sessions);
}

/**
 * After global fan-out: run source handlers as `.call(copycat)` when the effect
 * is part of the copied attack lifecycle.
 */
export function resolveCopyAttackSessions(
  store: StoreLike,
  state: State,
  effect: Effect,
): State {
  const sessions = sessionsForState(state);
  let changed = false;
  for (let i = sessions.length - 1; i >= 0; i--) {
    const session = sessions[i];

    if (!isCopycatInPlay(state, session.copycatCard)) {
      sessions.splice(i, 1);
      changed = true;
      continue;
    }

    // An explicit attack-owned callback can react to damage received during a
    // later turn without executing the source card's unrelated Abilities.
    if (effect instanceof AfterDamageEffect && !effect.preventDefault &&
        targetIncludesCopycat(effect, session.copycatCard) && !isClonedAttack(session, effect.attack)) {
      const reaction = session.clonedAttacks[session.attackIndex]?.copiedReactiveAfterDamage;
      if (typeof reaction === 'function') {
        state = reaction(store, state, effect, session.copycatCard);
        continue;
      }
    }

    if (!shouldDelegateCopyAttackSession(session, state, effect)) {
      continue;
    }

    state = delegateToSource(
      session.copycatCard,
      session.sourceCard,
      session.clonedAttacks,
      session.attackIndex,
      store,
      state,
      effect,
    );

    if (effect instanceof EndTurnEffect) {
      session.endTurnsRemaining -= 1;
      changed = true;
      if (session.endTurnsRemaining <= 0) {
        sessions.splice(i, 1);
      }
    }
  }

  if (changed) persistCopyAttackSessions(state, sessions);

  return state;
}

/** Test-only reset for the imported delegation sessions. */
export function clearCopyAttackSessionsForTests(): void {
  copyAttackSessions = new WeakMap<State, CopyAttackSession[]>();
}

export interface DelegatedCopiedAttackContext {
  store: StoreLike;
  state: State;
  player: Player;
  opponent: Player;
  copycatCard: PokemonCard;
  sourceCard: PokemonCard;
  selectedAttack: Attack;
  /** AttackEffect.source; defaults to player.active when omitted. */
  sourceSlot?: AttackEffect['source'];
  /** Skip LOG_PLAYER_COPIES_ATTACK when the caller already logged. */
  skipLog?: boolean;
  /** Skip AfterAttackEffect (e.g. when useAttack will emit it). */
  skipAfterAttack?: boolean;
}

/**
 * Generator variant that yields while waiting on prompts opened during delegation.
 */
export function* runDelegatedCopiedAttackGenerator(
  next: Function,
  ctx: DelegatedCopiedAttackContext,
): IterableIterator<State> {
  const {
    store,
    state: initialState,
    player,
    opponent,
    copycatCard,
    sourceCard,
    selectedAttack,
    sourceSlot,
    skipLog = false,
    skipAfterAttack = false,
  } = ctx;

  const attackIndex = findAttackIndex(sourceCard, selectedAttack);
  if (attackIndex < 0) {
    return initialState;
  }

  let state = initialState;

  if (!skipLog) {
    store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
      name: player.name,
      attack: selectedAttack.name,
    });
  }

  const clonedAttacks = cloneAttacks(sourceCard.attacks || []);
  const clonedAttack = clonedAttacks[attackIndex];
  openCopyAttackSession(state, player, copycatCard, sourceCard, clonedAttacks, clonedAttack);

  const attackEffect = new AttackEffect(player, opponent, clonedAttack);
  attackEffect.source = sourceSlot ?? player.active;
  const attackDamageScope = beginAttackDamageScope(state);
  try {
    state = store.reduceEffect(state, attackEffect);

    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }

    const beforeDoingDamageEffect = new BeforeDoingDamageEffect(attackEffect);
    state = store.reduceEffect(state, beforeDoingDamageEffect);

    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }

    const originalDefender = opponent.active;
    if (attackEffect.damage > 0) {
      const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
      state = store.reduceEffect(state, dealDamage);

      if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
      }
    }

    state = yield* resolveAfterAttackDamage(() => next(), store, state, attackEffect);
    state = yield* finishAttackDamageScope(() => next(), store, state, attackDamageScope);

    if (!skipAfterAttack) {
      const afterAttackEffect = new AfterAttackEffect(player, opponent, clonedAttack, originalDefender);
      state = store.reduceEffect(state, afterAttackEffect);

      if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
      }
    }

  } finally {
    cancelAttackDamageScope(attackDamageScope);
  }

  return state;
}
