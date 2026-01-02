"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playPokemonFromDeckReducer = void 0;
const play_card_effects_1 = require("../effects/play-card-effects");
const game_error_1 = require("../../game-error");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
/**
 * Helper function to emit animation events
 */
function emitAnimationEvent(store, eventName, data) {
    const game = store.handler;
    if (game && game.core && typeof game.core.emit === 'function') {
        game.core.emit((c) => {
            if (typeof c.socket !== 'undefined') {
                c.socket.emit(`game[${game.id}]:${eventName}`, data);
            }
        });
    }
}
function playPokemonFromDeckReducer(store, state, effect) {
    /* Play pokemon card from deck */
    if (effect instanceof play_card_effects_1.PlayPokemonFromDeckEffect) {
        const stage = effect.pokemonCard.stage;
        const isBasic = stage === card_types_1.Stage.BASIC;
        // Only allow Basic Pokémon to be played from deck
        if (!isBasic) {
            throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
        }
        // Check if target is empty (for Basic Pokémon)
        if (effect.target.cards.length === 0) {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
                name: effect.player.name,
                card: effect.pokemonCard.name
            });
            effect.player.deck.moveCardTo(effect.pokemonCard, effect.target);
            effect.target.pokemonPlayedTurn = state.turn;
            effect.target.removeSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
            // Emit basic animation event
            emitAnimationEvent(store, 'playBasicAnimation', {
                playerId: effect.player.id,
                cardId: effect.pokemonCard.id,
                slot: effect.slot ? String(effect.slot) : undefined,
                index: effect.index
            });
            return state;
        }
        throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
    }
    return state;
}
exports.playPokemonFromDeckReducer = playPokemonFromDeckReducer;
