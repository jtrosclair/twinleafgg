"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceGhostVeil = exports.countGhostVeilPokemonInDiscard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
/** Pokémon cards in discard whose Ability name is Ghost Veil (used by Sinistcha line / Spiritomb / Dhelmise). */
function countGhostVeilPokemonInDiscard(player) {
    let count = 0;
    player.discard.cards.forEach(c => {
        var _a;
        if (c instanceof pokemon_card_1.PokemonCard &&
            ((_a = c.powers) === null || _a === void 0 ? void 0 : _a.some(p => p.powerType === pokemon_types_1.PowerType.ABILITY && p.name === 'Ghost Veil'))) {
            count++;
        }
    });
    return count;
}
exports.countGhostVeilPokemonInDiscard = countGhostVeilPokemonInDiscard;
/**
 * Passive Ability: This Pokémon can't be affected by effects of attacks or Abilities from your opponent's Pokémon.
 * Refs: set-burning-shadows/alolan-ninetales.ts (AbstractAttackEffect — blocks attack-sourced status via preventDefault before attackReducer);
 *       set-lost-origin/enamorus-v.ts (AddSpecialConditionsPowerEffect — ability-sourced Special Conditions).
 */
function reduceGhostVeil(store, state, effect, self) {
    var _a;
    if (effect instanceof attack_effects_1.AbstractAttackEffect && ((_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards.includes(self))) {
        if (effect.target.getPokemonCard() !== self) {
            return state;
        }
        const owner = state_utils_1.StateUtils.findOwner(state, effect.target);
        if (!state_utils_1.StateUtils.isPokemonInPlay(owner, self)) {
            return state;
        }
        if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, self)) {
            return state;
        }
        if (effect.player === owner) {
            return state;
        }
        // Allow Weakness & Resistance
        if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
            return state;
        }
        // Allow damage
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            return state;
        }
        // Allow damage
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            return state;
        }
        effect.preventDefault = true;
        return state;
    }
    if (effect instanceof game_effects_1.PlaceDamageCountersEffect) {
        const target = effect.target;
        if (!target.cards.includes(self) || target.getPokemonCard() !== self) {
            return state;
        }
        const owner = state_utils_1.StateUtils.findOwner(state, target);
        if (!state_utils_1.StateUtils.isPokemonInPlay(owner, self)) {
            return state;
        }
        if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, self)) {
            return state;
        }
        if (effect.player === owner) {
            return state;
        }
        if (effect.source === undefined) {
            return state;
        }
        const sourceSlot = state_utils_1.StateUtils.findPokemonSlot(state, effect.source);
        if (!sourceSlot || state_utils_1.StateUtils.findOwner(state, sourceSlot) !== effect.player) {
            return state;
        }
        effect.preventDefault = true;
        return state;
    }
    // Ability-sourced Special Conditions (gameReducer path — not a subclass of AbstractAttackEffect)
    if (effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
        const target = effect.target;
        if (!target.cards.includes(self) || target.getPokemonCard() !== self) {
            return state;
        }
        const owner = state_utils_1.StateUtils.findOwner(state, target);
        if (!state_utils_1.StateUtils.isPokemonInPlay(owner, self)) {
            return state;
        }
        if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, self)) {
            return state;
        }
        if (effect.player === owner) {
            return state;
        }
        if (!(effect.source instanceof pokemon_card_1.PokemonCard)) {
            return state;
        }
        const sourceSlot = state_utils_1.StateUtils.findPokemonSlot(state, effect.source);
        if (!sourceSlot || state_utils_1.StateUtils.findOwner(state, sourceSlot) !== effect.player) {
            return state;
        }
        effect.preventDefault = true;
        return state;
    }
    if (effect instanceof game_effects_1.PutDamageCountersEffect && effect.effectOfAbility.target) {
        const target = effect.effectOfAbility.target;
        if (!target.cards.includes(self) || target.getPokemonCard() !== self) {
            return state;
        }
        const owner = state_utils_1.StateUtils.findOwner(state, target);
        if (!state_utils_1.StateUtils.isPokemonInPlay(owner, self)) {
            return state;
        }
        if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, self)) {
            return state;
        }
        if (effect.player === owner) {
            return state;
        }
        effect.damage = 0;
        return state;
    }
    return state;
}
exports.reduceGhostVeil = reduceGhostVeil;
