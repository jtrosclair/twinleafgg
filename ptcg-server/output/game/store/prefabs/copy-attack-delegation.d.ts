import { Attack } from '../card/pokemon-types';
import { PokemonCard } from '../card/pokemon-card';
import { Effect } from '../effects/effect';
import { CheckAttackCostEffect } from '../effects/check-effects';
import { AttackEffect } from '../effects/game-effects';
import { Player } from '../state/player';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
export declare function cloneAttack(attack: Attack): Attack;
export declare function cloneAttacks(attacks: Attack[]): Attack[];
export declare function findAttackIndex(source: PokemonCard, attack: Attack): number;
export declare function withTemporaryDelegatedAttacks<T>(copycatCard: PokemonCard, sourceCard: PokemonCard, fn: (clonedAttacks: Attack[]) => T, clonedAttacks?: Attack[]): T;
/** Validate a cloned attack as the copycat, never as the original card's attack. */
export declare function checkCopiedAttackCost(store: StoreLike, state: State, player: Player, sourceCard: PokemonCard, attack: Attack, copycatCard?: PokemonCard | undefined): {
    state: State;
    effect: CheckAttackCostEffect;
};
/**
 * Sticky session: keep source reduceEffect bound to the copycat through damage,
 * KO prizes, and multi-turn marker cleanup (attack-only; not Abilities).
 */
interface CopyAttackSession {
    copycatCard: PokemonCard;
    sourceCard: PokemonCard;
    clonedAttacks: Attack[];
    playerId: number;
    /** Safety cap across either player's EndTurns (turn-skip + Harden linger). */
    endTurnsRemaining: number;
}
/**
 * Attack-only filters so Ability DealDamage boosts do not bleed onto the copycat.
 */
export declare function shouldDelegateCopyAttackSession(session: CopyAttackSession, state: State, effect: Effect): boolean;
export declare function openCopyAttackSession(state: State, player: Player, copycatCard: PokemonCard, sourceCard: PokemonCard, clonedAttacks: Attack[], selectedClonedAttack: Attack): void;
/**
 * After global fan-out: run source handlers as `.call(copycat)` when the effect
 * is part of the copied attack lifecycle.
 */
export declare function resolveCopyAttackSessions(store: StoreLike, state: State, effect: Effect): State;
/** Test-only reset for the imported delegation sessions. */
export declare function clearCopyAttackSessionsForTests(): void;
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
export declare function runDelegatedCopiedAttackGenerator(next: Function, ctx: DelegatedCopiedAttackContext): IterableIterator<State>;
export {};
