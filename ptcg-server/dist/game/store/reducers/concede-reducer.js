"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concedeReducer = void 0;
const state_1 = require("../state/state");
const game_message_1 = require("../../game-message");
const check_effect_1 = require("../effect-reducers/check-effect");
function concedeReducer(store, state, action) {
    if (state.phase === state_1.GamePhase.FINISHED) {
        return state;
    }
    // Find the player who is conceding
    const playerIndex = state.players.findIndex(p => p.id === action.playerId);
    if (playerIndex === -1) {
        return state;
    }
    const concedingPlayer = state.players[playerIndex];
    // Log the concession
    store.log(state, game_message_1.GameLog.LOG_PLAYER_CONCEDED, { name: concedingPlayer.name });
    // The other player wins
    const winner = playerIndex === 0 ? state_1.GameWinner.PLAYER_2 : state_1.GameWinner.PLAYER_1;
    // End the game
    state = (0, check_effect_1.endGame)(store, state, winner);
    return state;
}
exports.concedeReducer = concedeReducer;
