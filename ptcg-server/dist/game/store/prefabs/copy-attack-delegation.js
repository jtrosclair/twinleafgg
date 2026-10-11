"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDelegatedCopiedAttackGenerator = exports.clearCopyAttackSessionsForTests = exports.resolveCopyAttackSessions = exports.openCopyAttackSession = exports.shouldDelegateCopyAttackSession = exports.checkCopiedAttackCost = exports.withTemporaryDelegatedAttacks = exports.findAttackIndex = exports.cloneAttacks = exports.cloneAttack = void 0;
const game_message_1 = require("../../game-message");
const game_error_1 = require("../../game-error");
const attack_effects_1 = require("../effects/attack-effects");
const check_effects_1 = require("../effects/check-effects");
const game_effects_1 = require("../effects/game-effects");
const game_phase_effects_1 = require("../effects/game-phase-effects");
const state_1 = require("../state/state");
const play_card_action_1 = require("../actions/play-card-action");
function cloneAttack(attack) {
    return Object.assign(Object.assign({}, attack), { cost: [...(attack.cost || [])] });
}
exports.cloneAttack = cloneAttack;
function cloneAttacks(attacks) {
    return attacks.map(cloneAttack);
}
exports.cloneAttacks = cloneAttacks;
function findAttackIndex(source, attack) {
    const byRef = source.attacks.indexOf(attack);
    if (byRef >= 0) {
        return byRef;
    }
    return source.attacks.findIndex(a => a.name === attack.name);
}
exports.findAttackIndex = findAttackIndex;
function withTemporaryDelegatedAttacks(copycatCard, sourceCard, fn, clonedAttacks) {
    const saved = copycatCard.attacks;
    const cloned = clonedAttacks !== null && clonedAttacks !== void 0 ? clonedAttacks : cloneAttacks(sourceCard.attacks || []);
    copycatCard.attacks = cloned;
    try {
        return fn(cloned);
    }
    finally {
        copycatCard.attacks = saved;
    }
}
exports.withTemporaryDelegatedAttacks = withTemporaryDelegatedAttacks;
/** Validate a cloned attack as the copycat, never as the original card's attack. */
function checkCopiedAttackCost(store, state, player, sourceCard, attack, copycatCard = player.active.getPokemonCard()) {
    var _a;
    const clonedAttacks = cloneAttacks(sourceCard.attacks);
    const clonedAttack = (_a = clonedAttacks[findAttackIndex(sourceCard, attack)]) !== null && _a !== void 0 ? _a : cloneAttack(attack);
    const effect = new check_effects_1.CheckAttackCostEffect(player, clonedAttack);
    const reduce = () => {
        state = store.reduceEffect(state, effect);
        return { state, effect };
    };
    return copycatCard
        ? withTemporaryDelegatedAttacks(copycatCard, sourceCard, reduce, clonedAttacks)
        : reduce();
}
exports.checkCopiedAttackCost = checkCopiedAttackCost;
function withSourceMarkerConstants(copycatCard, sourceCard, fn) {
    const saved = [];
    for (const key of Object.keys(sourceCard)) {
        if (!/MARKER/i.test(key)) {
            continue;
        }
        const value = sourceCard[key];
        if (typeof value !== 'string') {
            continue;
        }
        saved.push({
            key,
            hadOwn: Object.prototype.hasOwnProperty.call(copycatCard, key),
            value: copycatCard[key],
        });
        copycatCard[key] = value;
    }
    try {
        return fn();
    }
    finally {
        for (const entry of saved) {
            if (entry.hadOwn) {
                copycatCard[entry.key] = entry.value;
            }
            else {
                delete copycatCard[entry.key];
            }
        }
    }
}
function delegateToSource(copycatCard, sourceCard, clonedAttacks, store, state, effect) {
    // Only source-handler calls see this facade. The real Store still fans out to
    // the copycat, Tools, Stadiums, etc., with their own Abilities unchanged.
    // Permission-checked source Abilities are denied: a copied attack does not
    // grant source Ability permission, even during delayed effects. This facade
    // cannot split legacy passive branches that omit PowerEffect permission checks.
    const attackOnlyStore = new Proxy(store, {
        get(target, key) {
            if (key === 'reduceEffect') {
                return (s, nestedEffect) => {
                    if (nestedEffect instanceof game_effects_1.PowerEffect
                        && (nestedEffect.card === copycatCard || nestedEffect.card === sourceCard)) {
                        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                    }
                    return target.reduceEffect(s, nestedEffect);
                };
            }
            const value = Reflect.get(target, key);
            return typeof value === 'function' ? value.bind(target) : value;
        },
    });
    return withTemporaryDelegatedAttacks(copycatCard, sourceCard, () => withSourceMarkerConstants(copycatCard, sourceCard, () => sourceCard.reduceEffect.call(copycatCard, attackOnlyStore, state, effect)), clonedAttacks);
}
// Each State identity is owned by one game; unrelated Stores cannot prune it.
let copyAttackSessions = new WeakMap();
const DEFAULT_END_TURN_BUDGET = 4;
function isCopycatInPlay(state, copycatCard) {
    for (const player of state.players) {
        let found = false;
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
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
function isClonedAttack(session, attack) {
    if (attack === undefined) {
        return false;
    }
    return session.clonedAttacks.includes(attack);
}
function targetIncludesCopycat(effect, copycatCard) {
    var _a, _b;
    return !!((_b = (_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.includes(copycatCard));
}
/**
 * Attack-only filters so Ability DealDamage boosts do not bleed onto the copycat.
 */
function shouldDelegateCopyAttackSession(session, state, effect) {
    if (effect instanceof game_phase_effects_1.EndTurnEffect
        || effect instanceof game_phase_effects_1.BetweenTurnsEffect
        || effect instanceof game_phase_effects_1.BeginTurnEffect) {
        return true;
    }
    if (effect instanceof game_effects_1.KnockOutEffect) {
        if (state.phase !== state_1.GamePhase.ATTACK) {
            return false;
        }
        const attacker = state.players[state.activePlayer];
        return attacker !== undefined && attacker.id === session.playerId;
    }
    if (effect instanceof attack_effects_1.DealDamageEffect) {
        // Harden-style only — do not match by cloned attack (Ability DealDamage bleed).
        return targetIncludesCopycat(effect, session.copycatCard);
    }
    if (effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) {
        if (targetIncludesCopycat(effect, session.copycatCard)) {
            return true;
        }
        return isClonedAttack(session, effect.attack);
    }
    if (effect instanceof attack_effects_1.AfterDamageEffect) {
        return isClonedAttack(session, effect.attack);
    }
    if (effect instanceof game_effects_1.AttackEffect
        || effect instanceof game_phase_effects_1.BeforeDoingDamageEffect
        || effect instanceof game_phase_effects_1.AfterAttackEffect) {
        return isClonedAttack(session, effect.attack);
    }
    return false;
}
exports.shouldDelegateCopyAttackSession = shouldDelegateCopyAttackSession;
function openCopyAttackSession(state, player, copycatCard, sourceCard, clonedAttacks, selectedClonedAttack) {
    let sessions = copyAttackSessions.get(state);
    if (!sessions) {
        sessions = [];
        copyAttackSessions.set(state, sessions);
    }
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
        endTurnsRemaining: DEFAULT_END_TURN_BUDGET,
    });
    if (!state.playerLastAttack) {
        state.playerLastAttack = {};
    }
    state.playerLastAttack[player.id] = {
        attack: selectedClonedAttack,
        sourceCard: copycatCard,
    };
}
exports.openCopyAttackSession = openCopyAttackSession;
/**
 * After global fan-out: run source handlers as `.call(copycat)` when the effect
 * is part of the copied attack lifecycle.
 */
function resolveCopyAttackSessions(store, state, effect) {
    const sessions = copyAttackSessions.get(state) || [];
    for (let i = sessions.length - 1; i >= 0; i--) {
        const session = sessions[i];
        if (!isCopycatInPlay(state, session.copycatCard)) {
            sessions.splice(i, 1);
            continue;
        }
        if (!shouldDelegateCopyAttackSession(session, state, effect)) {
            continue;
        }
        state = delegateToSource(session.copycatCard, session.sourceCard, session.clonedAttacks, store, state, effect);
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            session.endTurnsRemaining -= 1;
            if (session.endTurnsRemaining <= 0) {
                sessions.splice(i, 1);
            }
        }
    }
    return state;
}
exports.resolveCopyAttackSessions = resolveCopyAttackSessions;
/** Test-only reset for the imported delegation sessions. */
function clearCopyAttackSessionsForTests() {
    copyAttackSessions = new WeakMap();
}
exports.clearCopyAttackSessionsForTests = clearCopyAttackSessionsForTests;
/**
 * Generator variant that yields while waiting on prompts opened during delegation.
 */
function* runDelegatedCopiedAttackGenerator(next, ctx) {
    const { store, state: initialState, player, opponent, copycatCard, sourceCard, selectedAttack, sourceSlot, skipLog = false, skipAfterAttack = false, } = ctx;
    const attackIndex = findAttackIndex(sourceCard, selectedAttack);
    if (attackIndex < 0) {
        return initialState;
    }
    let state = initialState;
    if (!skipLog) {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
            name: player.name,
            attack: selectedAttack.name,
        });
    }
    const clonedAttacks = cloneAttacks(sourceCard.attacks || []);
    const clonedAttack = clonedAttacks[attackIndex];
    openCopyAttackSession(state, player, copycatCard, sourceCard, clonedAttacks, clonedAttack);
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, clonedAttack);
    attackEffect.source = sourceSlot !== null && sourceSlot !== void 0 ? sourceSlot : player.active;
    state = store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    const beforeDoingDamageEffect = new game_phase_effects_1.BeforeDoingDamageEffect(attackEffect);
    state = store.reduceEffect(state, beforeDoingDamageEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
        if (store.hasPrompts()) {
            yield store.waitPrompt(state, () => next());
        }
    }
    if (!skipAfterAttack) {
        const afterAttackEffect = new game_phase_effects_1.AfterAttackEffect(player, opponent, clonedAttack);
        state = store.reduceEffect(state, afterAttackEffect);
        if (store.hasPrompts()) {
            yield store.waitPrompt(state, () => next());
        }
    }
    return state;
}
exports.runDelegatedCopiedAttackGenerator = runDelegatedCopiedAttackGenerator;
