"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivePokemon = exports.zoneContains = exports.hasSpecialCondition = exports.getZoneCount = exports.getEnergyCount = exports.getDamage = exports.createAttackEffect = exports.createActiveDamageEffect = exports.createDamageEffect = exports.playTrainerCard = exports.endTurn = exports.useAbility = exports.useAttack = void 0;
const game_actions_1 = require("../../game/store/actions/game-actions");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// ── Action helpers ──
function useAttack(store, state, playerIndex, attackName) {
    const player = state.players[playerIndex];
    store.dispatch(new game_actions_1.AttackAction(player.id, attackName));
}
exports.useAttack = useAttack;
function useAbility(store, state, playerIndex, abilityName) {
    const player = state.players[playerIndex];
    // Search active and bench for the card with this ability
    let foundTarget;
    const pokemonCard = player.active.getPokemonCard();
    if (pokemonCard && pokemonCard.powers.some(p => p.name === abilityName)) {
        foundTarget = { player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: play_card_action_1.SlotType.ACTIVE, index: 0 };
    }
    if (!foundTarget) {
        for (let i = 0; i < player.bench.length; i++) {
            const benchPokemon = player.bench[i].getPokemonCard();
            if (benchPokemon && benchPokemon.powers.some(p => p.name === abilityName)) {
                foundTarget = { player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: play_card_action_1.SlotType.BENCH, index: i };
                break;
            }
        }
    }
    if (!foundTarget) {
        throw new Error(`No Pokemon with ability "${abilityName}" found for player ${playerIndex}`);
    }
    store.dispatch(new game_actions_1.UseAbilityAction(player.id, abilityName, foundTarget));
}
exports.useAbility = useAbility;
function endTurn(store, state) {
    const player = state.players[state.activePlayer];
    store.dispatch(new game_actions_1.PassTurnAction(player.id));
}
exports.endTurn = endTurn;
function playTrainerCard(store, state, playerIndex, cardFullName) {
    const player = state.players[playerIndex];
    const handIndex = player.hand.cards.findIndex(c => c.fullName === cardFullName);
    if (handIndex === -1) {
        throw new Error(`Card "${cardFullName}" not found in player ${playerIndex}'s hand`);
    }
    const target = { player: play_card_action_1.PlayerType.BOTTOM_PLAYER, slot: play_card_action_1.SlotType.ACTIVE, index: 0 };
    store.dispatch(new play_card_action_1.PlayCardAction(player.id, handIndex, target));
}
exports.playTrainerCard = playTrainerCard;
// ── Reusable effect factories ──
function createDamageEffect(game, attackerIndex, options) {
    var _a;
    const attacker = game.state.players[attackerIndex];
    const defender = game.state.players[1 - attackerIndex];
    const damage = (_a = options === null || options === void 0 ? void 0 : options.damage) !== null && _a !== void 0 ? _a : 30;
    const attack = { name: 'Test Attack', cost: [], damage, text: '' };
    const attackEffect = new game_effects_1.AttackEffect(attacker, defender, attack);
    const putDamage = new attack_effects_1.PutDamageEffect(attackEffect, damage);
    if ((options === null || options === void 0 ? void 0 : options.benchIndex) !== undefined) {
        putDamage.target = defender.bench[options.benchIndex];
    }
    return putDamage;
}
exports.createDamageEffect = createDamageEffect;
function createActiveDamageEffect(game, attackerIndex, options) {
    var _a;
    const attacker = game.state.players[attackerIndex];
    const defender = game.state.players[1 - attackerIndex];
    const damage = (_a = options === null || options === void 0 ? void 0 : options.damage) !== null && _a !== void 0 ? _a : 30;
    const attack = { name: 'Test Attack', cost: [], damage, text: '' };
    const attackEffect = new game_effects_1.AttackEffect(attacker, defender, attack);
    return new attack_effects_1.DealDamageEffect(attackEffect, damage);
}
exports.createActiveDamageEffect = createActiveDamageEffect;
function createAttackEffect(game, attackerIndex, options) {
    var _a;
    const attacker = game.state.players[attackerIndex];
    const defender = game.state.players[1 - attackerIndex];
    const damage = (_a = options === null || options === void 0 ? void 0 : options.damage) !== null && _a !== void 0 ? _a : 30;
    const attack = { name: 'Test Attack', cost: [], damage, text: '' };
    return new game_effects_1.AttackEffect(attacker, defender, attack);
}
exports.createAttackEffect = createAttackEffect;
// ── Query helpers ──
function getSlot(state, playerIndex, slot) {
    const player = state.players[playerIndex];
    if (slot === undefined || slot === 'active') {
        return player.active;
    }
    return player.bench[slot];
}
function getDamage(state, playerIndex, slot) {
    return getSlot(state, playerIndex, slot).damage;
}
exports.getDamage = getDamage;
function getEnergyCount(state, playerIndex, slot) {
    return getSlot(state, playerIndex, slot).energies.cards.length;
}
exports.getEnergyCount = getEnergyCount;
function getZoneCards(state, playerIndex, zone) {
    const player = state.players[playerIndex];
    switch (zone) {
        case 'hand': return player.hand.cards;
        case 'deck': return player.deck.cards;
        case 'discard': return player.discard.cards;
        case 'lostzone': return player.lostzone.cards;
    }
}
function getZoneCount(state, playerIndex, zone) {
    return getZoneCards(state, playerIndex, zone).length;
}
exports.getZoneCount = getZoneCount;
function hasSpecialCondition(state, playerIndex, slot, condition) {
    return getSlot(state, playerIndex, slot).specialConditions.includes(condition);
}
exports.hasSpecialCondition = hasSpecialCondition;
function zoneContains(state, playerIndex, zone, cardFullName) {
    return getZoneCards(state, playerIndex, zone).some(c => c.fullName === cardFullName);
}
exports.zoneContains = zoneContains;
function getActivePokemon(state, playerIndex) {
    const pokemonCard = state.players[playerIndex].active.getPokemonCard();
    if (!pokemonCard) {
        throw new Error(`No active Pokemon for player ${playerIndex}`);
    }
    return pokemonCard;
}
exports.getActivePokemon = getActivePokemon;
