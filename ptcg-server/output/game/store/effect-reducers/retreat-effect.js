"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retreatReducer = void 0;
const choose_energy_prompt_1 = require("../prompts/choose-energy-prompt");
const choose_pokemon_prompt_1 = require("../prompts/choose-pokemon-prompt");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const game_effects_1 = require("../effects/game-effects");
const state_utils_1 = require("../state-utils");
const check_effects_1 = require("../effects/check-effects");
const card_types_1 = require("../card/card-types");
const play_card_action_1 = require("../actions/play-card-action");
function retreatPokemon(store, state, effect) {
    const player = effect.player;
    const activePokemon = player.active.getPokemonCard();
    const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
    if (activePokemon === undefined || benchedPokemon === undefined) {
        return;
    }
    store.log(state, game_message_1.GameLog.LOG_PLAYER_RETREATS, {
        name: player.name,
        active: activePokemon.name,
        benched: benchedPokemon.name
    });
    player.retreatedTurn = state.turn;
    player.switchPokemon(player.bench[effect.benchIndex], store, state);
}
function flatMap(array, fn) {
    return array.reduce((acc, item) => acc.concat(fn(item)), []);
}
function promptBenchAndRetreat(store, state, player) {
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: true, blocked: [] }), (benchResult) => {
        if (benchResult === null) {
            return;
        }
        const benchIndex = player.bench.indexOf(benchResult[0]);
        if (benchIndex < 0) {
            return;
        }
        const effect = new game_effects_1.RetreatEffect(player, benchIndex);
        retreatPokemon(store, state, effect);
        const activePokemonCard = player.active.getPokemonCard();
        if (activePokemonCard && !player.movedToActiveThisTurn.includes(activePokemonCard.id)) {
            player.movedToActiveThisTurn.push(activePokemonCard.id);
        }
        if (activePokemonCard) {
            activePokemonCard.movedToActiveThisTurn = true;
        }
    });
}
function retreatReducer(store, state, effect) {
    /* Retreat start: validate + pay cost, then prompt for bench */
    if (effect instanceof game_effects_1.RetreatStartEffect) {
        const player = effect.player;
        const hasBenchPokemon = player.bench.some(b => b.cards.length > 0);
        if (!hasBenchPokemon) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        const sp = player.active.specialConditions;
        if (sp.includes(card_types_1.SpecialCondition.PARALYZED) || sp.includes(card_types_1.SpecialCondition.ASLEEP)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
        }
        if (player.retreatedTurn === state.turn) {
            throw new game_error_1.GameError(game_message_1.GameMessage.RETREAT_ALREADY_USED);
        }
        const checkRetreatCost = new check_effects_1.CheckRetreatCostEffect(player);
        state = store.reduceEffect(state, checkRetreatCost);
        if (checkRetreatCost.cost.length === 0) {
            player.active.clearEffects();
            return promptBenchAndRetreat(store, state, player);
        }
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
        state = store.reduceEffect(state, checkProvidedEnergy);
        const enoughEnergies = state_utils_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
        if (enoughEnergies === false) {
            throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
        }
        if (state_utils_1.StateUtils.checkExactEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost)) {
            const cards = flatMap(checkProvidedEnergy.energyMap, e => Array.from({ length: e.provides.length }, () => e.card));
            player.active.clearEffects();
            player.active.moveCardsTo(cards, player.discard);
            return promptBenchAndRetreat(store, state, player);
        }
        if (state_utils_1.StateUtils.allEnergyProvidesIdentical(checkProvidedEnergy.energyMap)) {
            const selection = state_utils_1.StateUtils.selectMinimalEnergyForCost(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
            if (selection && selection.length > 0) {
                const cards = selection.map(e => e.card);
                player.active.clearEffects();
                player.active.moveCardsTo(cards, player.discard);
                return promptBenchAndRetreat(store, state, player);
            }
        }
        return store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGY_TO_PAY_RETREAT_COST, checkProvidedEnergy.energyMap, checkRetreatCost.cost), energy => {
            if (energy === null) {
                return;
            }
            const cards = energy.map(e => e.card);
            player.active.clearEffects();
            player.active.moveCardsTo(cards, player.discard);
            promptBenchAndRetreat(store, state, player);
        });
    }
    /* Retreat pokemon */
    if (effect instanceof game_effects_1.RetreatEffect) {
        const player = effect.player;
        if (player.bench[effect.benchIndex].cards.length === 0) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        const sp = player.active.specialConditions;
        if ((sp.includes(card_types_1.SpecialCondition.PARALYZED) || sp.includes(card_types_1.SpecialCondition.ASLEEP)) && !effect.ignoreStatusConditions) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
        }
        if (player.retreatedTurn === state.turn) {
            throw new game_error_1.GameError(game_message_1.GameMessage.RETREAT_ALREADY_USED);
        }
        const checkRetreatCost = new check_effects_1.CheckRetreatCostEffect(effect.player);
        state = store.reduceEffect(state, checkRetreatCost);
        if (checkRetreatCost.cost.length === 0) {
            player.active.clearEffects();
            retreatPokemon(store, state, effect);
            return state;
        }
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
        state = store.reduceEffect(state, checkProvidedEnergy);
        const enoughEnergies = state_utils_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
        if (enoughEnergies === false) {
            throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
        }
        // If the player has the exact energy cost, automatically discard the energy and retreat
        if (state_utils_1.StateUtils.checkExactEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost)) {
            const cards = flatMap(checkProvidedEnergy.energyMap, e => Array.from({ length: e.provides.length }, () => e.card));
            player.active.clearEffects();
            player.active.moveCardsTo(cards, effect.moveRetreatCostTo);
            retreatPokemon(store, state, effect);
            const activePokemonCard = player.active.getPokemonCard();
            // Add to new tracking system
            if (!player.movedToActiveThisTurn.includes(activePokemonCard.id)) {
                player.movedToActiveThisTurn.push(activePokemonCard.id);
            }
            // Keep existing boolean for backwards compatibility
            activePokemonCard.movedToActiveThisTurn = true;
            return state;
        }
        // If all attached energy is identical, no meaningful choice - auto-select minimal and retreat
        if (state_utils_1.StateUtils.allEnergyProvidesIdentical(checkProvidedEnergy.energyMap)) {
            const selection = state_utils_1.StateUtils.selectMinimalEnergyForCost(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
            if (selection && selection.length > 0) {
                const cards = selection.map(e => e.card);
                player.active.clearEffects();
                player.active.moveCardsTo(cards, effect.moveRetreatCostTo);
                retreatPokemon(store, state, effect);
                const activePokemonCard = player.active.getPokemonCard();
                if (!player.movedToActiveThisTurn.includes(activePokemonCard.id)) {
                    player.movedToActiveThisTurn.push(activePokemonCard.id);
                }
                activePokemonCard.movedToActiveThisTurn = true;
                return state;
            }
        }
        return store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGY_TO_PAY_RETREAT_COST, checkProvidedEnergy.energyMap, checkRetreatCost.cost), energy => {
            if (energy === null) {
                return; // operation cancelled
            }
            const activePokemon = player.active.getPokemonCard();
            const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
            if (activePokemon === undefined || benchedPokemon === undefined) {
                return;
            }
            const cards = energy.map(e => e.card);
            player.active.clearEffects();
            player.active.moveCardsTo(cards, effect.moveRetreatCostTo);
            retreatPokemon(store, state, effect);
            const activePokemonCard = player.active.getPokemonCard();
            // Add to new tracking system
            if (!player.movedToActiveThisTurn.includes(activePokemonCard.id)) {
                player.movedToActiveThisTurn.push(activePokemonCard.id);
            }
            // Keep existing boolean for backwards compatibility
            activePokemonCard.movedToActiveThisTurn = true;
        });
    }
    return state;
}
exports.retreatReducer = retreatReducer;
