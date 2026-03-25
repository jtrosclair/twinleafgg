"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playTrainerReducer = void 0;
const play_card_effects_1 = require("../effects/play-card-effects");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const state_utils_1 = require("../state-utils");
const card_types_1 = require("../card/card-types");
function getTrainerCleanupTarget(player, trainerCard) {
    return trainerCard.tags.includes(card_types_1.CardTag.PRISM_STAR) ? player.lostzone : player.discard;
}
function restorePlayedTrainerToPlayZoneIfNeeded(store, player, trainerCard) {
    // Legacy card implementations may discard immediately even though prompts are pending.
    // If prompts exist, keep the played trainer visible in the play zone until completion.
    if (!store.hasPrompts()) {
        return;
    }
    if (player.discard.cards.includes(trainerCard)) {
        player.discard.moveCardTo(trainerCard, player.supporter);
    }
}
function finalizeTrainerCleanup(store, state, player, trainerCard, keepSupporterUntilEndTurn) {
    if (keepSupporterUntilEndTurn) {
        return state;
    }
    const cleanup = () => {
        if (!player.supporter.cards.includes(trainerCard)) {
            return;
        }
        const target = getTrainerCleanupTarget(player, trainerCard);
        player.supporter.moveCardTo(trainerCard, target);
    };
    if (store.hasPrompts()) {
        return store.waitPrompt(state, cleanup);
    }
    cleanup();
    return state;
}
function playTrainerReducer(store, state, effect) {
    /* Play supporter card */
    if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
        const player = effect.player;
        if (player.marker.hasMarker(player.ATTACK_EFFECT_SUPPORTER_LOCK)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        const playTrainer = new play_card_effects_1.TrainerEffect(player, effect.trainerCard, effect.target);
        state = store.reduceEffect(state, playTrainer);
        restorePlayedTrainerToPlayZoneIfNeeded(store, player, effect.trainerCard);
        state = finalizeTrainerCleanup(store, state, player, effect.trainerCard, state.rules.supporterCleanupAtEndTurn);
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_SUPPORTER, {
            name: player.name,
            card: effect.trainerCard.name
        });
        player.supporterTurn += 1;
        return state;
    }
    /* Play stadium card */
    if (effect instanceof play_card_effects_1.PlayStadiumEffect) {
        const player = effect.player;
        const opponent = state_utils_1.StateUtils.getOpponent(state, player);
        const stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
        if (player.marker.hasMarker(player.ATTACK_EFFECT_STADIUM_LOCK)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        // Handle player's existing stadium
        if (player.stadium.cards.length > 0) {
            if (stadiumCard && stadiumCard.tags.includes(card_types_1.CardTag.PRISM_STAR)) {
                player.stadium.moveTo(player.lostzone);
            }
            else {
                player.stadium.moveTo(player.discard);
            }
        }
        // Handle opponent's existing stadium
        if (opponent.stadium.cards.length > 0) {
            if (stadiumCard && stadiumCard.tags.includes(card_types_1.CardTag.PRISM_STAR)) {
                opponent.stadium.moveTo(opponent.lostzone);
            }
            else {
                opponent.stadium.moveTo(opponent.discard);
            }
        }
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_STADIUM, {
            name: effect.player.name,
            card: effect.trainerCard.name
        });
        player.stadiumUsedTurn = 0;
        player.hand.moveCardTo(effect.trainerCard, player.stadium);
        return state;
    }
    // Play Pokemon Tool card
    if (effect instanceof play_card_effects_1.AttachPokemonToolEffect) {
        const player = effect.player;
        const target = effect.target;
        const trainerCard = effect.trainerCard;
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        if (effect.target.tools.length >= pokemonCard.maxTools) {
            throw new game_error_1.GameError(game_message_1.GameMessage.POKEMON_TOOL_ALREADY_ATTACHED);
        }
        if (player.marker.hasMarker(effect.player.ATTACK_EFFECT_TOOL_LOCK)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_TOOL, {
            name: player.name,
            card: trainerCard.name,
            pokemon: pokemonCard.name
        });
        player.hand.moveCardTo(trainerCard, target);
        // Remove from cards if present (should only be in tools)
        const idx = target.cards.indexOf(trainerCard);
        if (idx !== -1) {
            target.cards.splice(idx, 1);
        }
        target.tools.push(effect.trainerCard);
        const playTrainer = new play_card_effects_1.TrainerEffect(player, trainerCard, target);
        state = store.reduceEffect(state, playTrainer);
        return state;
    }
    // Play item card
    if (effect instanceof play_card_effects_1.PlayItemEffect) {
        const player = effect.player;
        if (player.marker.hasMarker(player.ATTACK_EFFECT_ITEM_LOCK)) {
            throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        const playTrainer = new play_card_effects_1.TrainerEffect(effect.player, effect.trainerCard, effect.target);
        effect.player.hand.moveCardTo(effect.trainerCard, effect.player.supporter);
        state = store.reduceEffect(state, playTrainer);
        restorePlayedTrainerToPlayZoneIfNeeded(store, effect.player, effect.trainerCard);
        state = finalizeTrainerCleanup(store, state, effect.player, effect.trainerCard, false);
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_ITEM, {
            name: effect.player.name,
            card: effect.trainerCard.name
        });
        return state;
    }
    // Process trainer effect
    if (effect instanceof play_card_effects_1.TrainerEffect) {
        if (effect.player.hand.cards.includes(effect.trainerCard)) {
            // IF DIAMOND/PEARL FORMAT, SUPPORTER WILL STAY ON FIELD UNTIL THE END OF YOUR TURN
            const isSupporter = effect.trainerCard.trainerType === card_types_1.TrainerType.SUPPORTER;
            const target = isSupporter ? effect.player.supporter : effect.player.discard;
            effect.player.hand.moveCardTo(effect.trainerCard, target);
        }
        return state;
    }
    return state;
}
exports.playTrainerReducer = playTrainerReducer;
