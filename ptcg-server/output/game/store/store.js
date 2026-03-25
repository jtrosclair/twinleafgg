"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const abort_game_action_1 = require("./actions/abort-game-action");
const append_log_action_1 = require("./actions/append-log-action");
const concede_action_1 = require("./actions/concede-action");
const card_1 = require("./card/card");
const change_avatar_action_1 = require("./actions/change-avatar-action");
const game_error_1 = require("../game-error");
const game_message_1 = require("../game-message");
const show_cards_prompt_1 = require("./prompts/show-cards-prompt");
const choose_prize_prompt_1 = require("./prompts/choose-prize-prompt");
const reorder_actions_1 = require("./actions/reorder-actions");
const resolve_prompt_action_1 = require("./actions/resolve-prompt-action");
const state_1 = require("./state/state");
const state_log_1 = require("./state/state-log");
const utils_1 = require("../../utils/utils");
const attack_effect_1 = require("./effect-reducers/attack-effect");
const play_card_reducer_1 = require("./reducers/play-card-reducer");
const play_energy_effect_1 = require("./effect-reducers/play-energy-effect");
const play_pokemon_effect_1 = require("./effect-reducers/play-pokemon-effect");
const play_pokemon_from_deck_effect_1 = require("./effect-reducers/play-pokemon-from-deck-effect");
const play_trainer_effect_1 = require("./effect-reducers/play-trainer-effect");
const player_turn_reducer_1 = require("./reducers/player-turn-reducer");
const game_phase_effect_1 = require("./effect-reducers/game-phase-effect");
const game_effect_1 = require("./effect-reducers/game-effect");
const check_effect_1 = require("./effect-reducers/check-effect");
const player_state_reducer_1 = require("./reducers/player-state-reducer");
const retreat_effect_1 = require("./effect-reducers/retreat-effect");
const setup_reducer_1 = require("./reducers/setup-reducer");
const abort_game_reducer_1 = require("./reducers/abort-game-reducer");
const concede_reducer_1 = require("./reducers/concede-reducer");
const sandbox_reducer_1 = require("./reducers/sandbox-reducer");
const sandbox_modify_player_action_1 = require("./actions/sandbox-modify-player-action");
const sandbox_modify_game_state_action_1 = require("./actions/sandbox-modify-game-state-action");
const sandbox_modify_card_action_1 = require("./actions/sandbox-modify-card-action");
const sandbox_modify_pokemon_action_1 = require("./actions/sandbox-modify-pokemon-action");
class Store {
    constructor(handler) {
        this.handler = handler;
        //private effectHistory: Effect[] = [];
        this.state = new state_1.State();
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
        // Flag to prevent nested playability calculations
        this.calculatingPlayability = false;
    }
    dispatch(action, clientRoleId) {
        let state = this.state;
        // Handle sandbox actions
        if (action instanceof sandbox_modify_player_action_1.SandboxModifyPlayerAction
            || action instanceof sandbox_modify_game_state_action_1.SandboxModifyGameStateAction
            || action instanceof sandbox_modify_card_action_1.SandboxModifyCardAction
            || action instanceof sandbox_modify_pokemon_action_1.SandboxModifyPokemonAction) {
            if (clientRoleId === undefined) {
                throw new game_error_1.GameError(game_message_1.GameMessage.ILLEGAL_ACTION);
            }
            state = (0, sandbox_reducer_1.sandboxReducer)(this, state, action, clientRoleId);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof abort_game_action_1.AbortGameAction) {
            state = (0, abort_game_reducer_1.abortGameReducer)(this, state, action);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof concede_action_1.ConcedeAction) {
            state = (0, concede_reducer_1.concedeReducer)(this, state, action);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof reorder_actions_1.ReorderHandAction
            || action instanceof reorder_actions_1.ReorderBenchAction
            || action instanceof change_avatar_action_1.ChangeAvatarAction) {
            state = (0, player_state_reducer_1.playerStateReducer)(this, state, action);
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof resolve_prompt_action_1.ResolvePromptAction) {
            state = this.reducePrompt(state, action);
            if (this.promptItems.length === 0) {
                state = (0, check_effect_1.checkState)(this, state);
            }
            this.handler.onStateChange(state);
            return state;
        }
        if (action instanceof append_log_action_1.AppendLogAction) {
            this.log(state, action.message, action.params, action.id);
            this.handler.onStateChange(state);
            return state;
        }
        if (state.prompts.some(p => p.result === undefined && p.blocksDispatch !== false)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.ACTION_IN_PROGRESS);
        }
        state = this.reduce(state, action);
        return state;
    }
    reduceEffect(state, effect) {
        state = this.propagateEffect(state, effect);
        if (effect.preventDefault === true) {
            return state;
        }
        state = (0, game_phase_effect_1.gamePhaseReducer)(this, state, effect);
        state = (0, play_energy_effect_1.playEnergyReducer)(this, state, effect);
        state = (0, play_pokemon_effect_1.playPokemonReducer)(this, state, effect);
        state = (0, play_pokemon_from_deck_effect_1.playPokemonFromDeckReducer)(this, state, effect);
        state = (0, play_trainer_effect_1.playTrainerReducer)(this, state, effect);
        state = (0, retreat_effect_1.retreatReducer)(this, state, effect);
        state = (0, game_effect_1.gameReducer)(this, state, effect);
        state = (0, attack_effect_1.attackReducer)(this, state, effect);
        state = (0, check_effect_1.checkStateReducer)(this, state, effect);
        // Calculate playability after all effects are processed
        // The calculatingPlayability flag prevents nested calls during playability checks
        state = this.calculatePlayability(state);
        return state;
    }
    compareEffects(effect1, effect2) {
        var _a, _b, _c, _d;
        if (effect1.type !== effect2.type) {
            return false;
        }
        const effect1CardId = (_a = effect1 === null || effect1 === void 0 ? void 0 : effect1.card) === null || _a === void 0 ? void 0 : _a.id;
        const effect2CardId = (_b = effect2 === null || effect2 === void 0 ? void 0 : effect2.card) === null || _b === void 0 ? void 0 : _b.id;
        const effect1CardPlayerId = (_c = effect1 === null || effect1 === void 0 ? void 0 : effect1.player) === null || _c === void 0 ? void 0 : _c.id;
        const effect2CardPlayerId = (_d = effect2 === null || effect2 === void 0 ? void 0 : effect2.player) === null || _d === void 0 ? void 0 : _d.id;
        return effect1CardId === effect2CardId &&
            effect1CardPlayerId === effect2CardPlayerId;
    }
    prompt(state, prompts, then) {
        if (!(prompts instanceof Array)) {
            prompts = [prompts];
        }
        for (let i = 0; i < prompts.length; i++) {
            const id = (0, utils_1.generateId)(state.prompts);
            prompts[i].id = id;
            state.prompts.push(prompts[i]);
        }
        const promptItem = {
            ids: prompts.map(prompt => prompt.id),
            then: then
        };
        const allShowCards = prompts.every(p => p instanceof show_cards_prompt_1.ShowCardsPrompt);
        if (allShowCards) {
            prompts.forEach(p => p.result = true);
            const syntheticResults = prompts.map(() => true);
            then(syntheticResults.length === 1 ? syntheticResults[0] : syntheticResults);
        }
        else if (prompts.length === 1 && prompts[0] instanceof choose_prize_prompt_1.ChoosePrizePrompt) {
            const prizePrompt = prompts[0];
            const player = state.players.find(p => p.id === prizePrompt.playerId);
            if (player) {
                const targetPlayer = prizePrompt.options.useOpponentPrizes
                    ? state.players.find(p => p.id !== prizePrompt.playerId)
                    : player;
                if (targetPlayer) {
                    const availablePrizes = targetPlayer.prizes.filter(p => p.cards.length > 0);
                    const count = Math.min(prizePrompt.options.count, availablePrizes.length);
                    const selected = availablePrizes.slice(0, count);
                    prizePrompt.result = selected;
                    then(selected);
                }
                else {
                    this.promptItems.push(promptItem);
                }
            }
            else {
                this.promptItems.push(promptItem);
            }
        }
        else {
            this.promptItems.push(promptItem);
        }
        return state;
    }
    waitPrompt(state, callback) {
        this.waitItems.push(callback);
        return state;
    }
    log(state, message, params, client) {
        const timestamp = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).toString();
        const log = new state_log_1.StateLog(message, params, client);
        log.params = Object.assign(Object.assign({}, params), { timestamp });
        log.id = ++this.logId;
        state.logs.push(log);
    }
    reducePrompt(state, action) {
        const prompt = state.prompts.find(item => item.id === action.id);
        if (prompt === undefined) {
            return state;
        }
        if (prompt.result !== undefined) {
            // Idempotent: duplicate resolve (reordered updates, double-emit, remounted UI, etc.)
            return state;
        }
        const promptItem = this.promptItems.find(item => item.ids.indexOf(action.id) !== -1);
        try {
            prompt.result = action.result;
            if (action.log !== undefined) {
                this.log(state, action.log.message, action.log.params, action.log.client);
            }
            if (promptItem !== undefined) {
                const results = promptItem.ids.map(id => {
                    const p = state.prompts.find(item => item.id === id);
                    return p === undefined ? undefined : p.result;
                });
                if (results.every(result => result !== undefined)) {
                    const itemIndex = this.promptItems.indexOf(promptItem);
                    promptItem.then(results.length === 1 ? results[0] : results);
                    this.promptItems.splice(itemIndex, 1);
                }
            }
            this.resolveWaitItems();
        }
        catch (storeError) {
            // Illegal action
            prompt.result = undefined;
            throw storeError;
        }
        return state;
    }
    resolveWaitItems() {
        while (this.promptItems.length === 0 && this.waitItems.length > 0) {
            const waitItem = this.waitItems.pop();
            if (waitItem !== undefined) {
                waitItem();
            }
        }
    }
    hasPrompts() {
        return this.promptItems.length > 0;
    }
    cleanup() {
        this.promptItems = [];
        this.waitItems = [];
        this.logId = 0;
        this.state = new state_1.State();
    }
    reduce(state, action) {
        const stateBackup = (0, utils_1.deepClone)(state, [card_1.Card]);
        this.promptItems.length = 0;
        try {
            state = (0, setup_reducer_1.setupPhaseReducer)(this, state, action);
            state = (0, play_card_reducer_1.playCardReducer)(this, state, action);
            state = (0, player_turn_reducer_1.playerTurnReducer)(this, state, action);
            this.resolveWaitItems();
            if (this.promptItems.length === 0) {
                state = (0, check_effect_1.checkState)(this, state);
            }
            // Calculate playability before state change
            state = this.calculatePlayability(state);
        }
        catch (storeError) {
            // Illegal action
            this.state = stateBackup;
            this.promptItems.length = 0;
            throw storeError;
        }
        this.handler.onStateChange(state);
        return state;
    }
    calculatePlayability(state) {
        var _a;
        // Prevent nested calls - if we're already calculating playability, skip
        if (this.calculatingPlayability) {
            return state;
        }
        // Skip playability calculation during setup and other non-play phases
        // Only calculate starting from Turn 1 (skip Turn 0 which is setup)
        if (state.phase !== state_1.GamePhase.PLAYER_TURN || state.turn < 1) {
            // Clear playability for all players when not in player turn or during setup
            for (const player of state.players) {
                player.playableCardIds = [];
            }
            return state;
        }
        // Skip if players aren't set up yet
        if (!state.players || state.players.length === 0) {
            return state;
        }
        // Set flag to prevent nested calls
        this.calculatingPlayability = true;
        // Track prompts before playability check to clean up any created during checks
        const promptItemsBefore = this.promptItems.length;
        const waitItemsBefore = this.waitItems.length;
        try {
            const { CAN_PLAY_CARD } = require('./prefabs/prefabs');
            for (const player of state.players) {
                // Clear previous playability
                player.playableCardIds = [];
                // Only calculate for the active player
                if (((_a = state.players[state.activePlayer]) === null || _a === void 0 ? void 0 : _a.id) !== player.id) {
                    continue;
                }
                // Check each card in hand
                for (const card of player.hand.cards) {
                    try {
                        // Skip cards without valid IDs (shouldn't happen, but safety check)
                        if (card.id === undefined || card.id === -1) {
                            continue;
                        }
                        if (CAN_PLAY_CARD(this, state, player, card)) {
                            player.playableCardIds.push(card.id);
                        }
                    }
                    catch (error) {
                        // If check fails, card is not playable - silently continue
                    }
                }
            }
        }
        catch (error) {
            // If playability calculation fails entirely, just clear all and continue
            // This prevents setup from breaking
            for (const player of state.players) {
                player.playableCardIds = [];
            }
        }
        finally {
            // Clean up any prompts or wait items that were created during playability checks
            // These are fake prompts from testing card playability and should not interfere with real game prompts
            if (this.promptItems.length > promptItemsBefore) {
                this.promptItems.splice(promptItemsBefore, this.promptItems.length - promptItemsBefore);
            }
            if (this.waitItems.length > waitItemsBefore) {
                this.waitItems.splice(waitItemsBefore, this.waitItems.length - waitItemsBefore);
            }
            // Always clear the flag, even if an error occurred
            this.calculatingPlayability = false;
        }
        return state;
    }
    propagateEffect(state, effect) {
        const cards = [];
        for (const player of state.players) {
            player.stadium.cards.forEach(c => cards.push(c));
            player.supporter.cards.forEach(c => cards.push(c));
            player.active.cards.forEach(c => cards.push(c));
            player.active.tools.forEach(t => cards.push(t));
            for (const bench of player.bench) {
                bench.cards.forEach(c => cards.push(c));
                bench.tools.forEach(t => cards.push(t));
            }
            for (const prize of player.prizes) {
                prize.cards.forEach(c => cards.push(c));
            }
            player.hand.cards.forEach(c => cards.push(c));
            player.deck.cards.forEach(c => cards.push(c));
            player.discard.cards.forEach(c => cards.push(c));
        }
        cards.sort(c => c.superType);
        cards.forEach(c => { state = this.callReduceEffect(c, this, state, effect); });
        return state;
    }
    // Utility function to call reduceEffect with override support
    callReduceEffect(card, store, state, effect) {
        var _a, _b, _c;
        // Only try override for TrainerCard (for now)
        if (card.trainerType !== undefined) {
            // Import here to avoid circular dependency at module level
            const { getOverriddenReduceEffect } = require('./card/card-effect-overrides');
            const format = (_c = (_b = (_a = store === null || store === void 0 ? void 0 : store.handler) === null || _a === void 0 ? void 0 : _a.gameSettings) === null || _b === void 0 ? void 0 : _b.format) !== null && _c !== void 0 ? _c : 0;
            const override = getOverriddenReduceEffect(card, format);
            if (override) {
                return override(store, state, effect);
            }
        }
        return card.reduceEffect(store, state, effect);
    }
}
exports.Store = Store;
