"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlimwoodTangle = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const state_1 = require("../../game/store/state/state");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const wait_prompt_1 = require("../../game/store/prompts/wait-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GlimwoodTangle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DAA';
        this.name = 'Glimwood Tangle';
        this.fullName = 'Glimwood Tangle DAA';
        this.GLIMWOOD_REFLIP_USED = 'GLIMWOOD_REFLIP_USED';
        this.text = 'Once during each player\'s turn, after that player flips any coins for an attack, they may ignore all results of those coin flips and begin flipping those coins again.';
    }
    reduceEffect(store, state, effect) {
        // Remove once-per-turn marker at end of turn
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.GLIMWOOD_REFLIP_USED, this);
        if (effect instanceof play_card_effects_1.CoinFlipEffect && state.phase === state_1.GamePhase.ATTACK && state_utils_1.StateUtils.getStadiumCard(state) === this && !effect.skipReflipStadium) {
            // Check for marker to prevent multiple reflips
            if ((0, prefabs_1.HAS_MARKER)(this.GLIMWOOD_REFLIP_USED, effect.player, this)) {
                return state;
            }
            effect.preventDefault = true;
            const result = Math.random() < 0.5;
            effect.result = result;
            const player = effect.player;
            const coinFlipEffect = effect;
            const stateForCallback = state;
            // Emit coin flip animation (same as gameReducer)
            const game = store.handler;
            if (game && game.core && typeof game.core.emit === 'function') {
                game.core.emit((c) => {
                    if (typeof c.socket !== 'undefined') {
                        c.socket.emit(`game[${game.id}]:coinFlip`, {
                            playerId: player.id,
                            result: result
                        });
                    }
                });
            }
            return store.prompt(state, new wait_prompt_1.WaitPrompt(player.id, 2000, 'Coin flip animation'), () => {
                store.log(stateForCallback, result ? game_message_1.GameLog.LOG_PLAYER_FLIPS_HEADS : game_message_1.GameLog.LOG_PLAYER_FLIPS_TAILS, { name: player.name });
                store.prompt(stateForCallback, new game_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToReflip => {
                    if (!wantToReflip) {
                        if (coinFlipEffect.callback) {
                            coinFlipEffect.callback(result);
                        }
                    }
                    else {
                        store.log(stateForCallback, game_message_1.GameLog.LOG_PLAYER_REFLIPS_WITH_GLIMWOOD_TANGLE, { name: player.name });
                        (0, prefabs_1.ADD_MARKER)(this.GLIMWOOD_REFLIP_USED, player, this);
                        const reflipEffect = new play_card_effects_1.CoinFlipEffect(player, coinFlipEffect.callback);
                        reflipEffect.skipReflipStadium = true;
                        store.reduceEffect(stateForCallback, reflipEffect);
                    }
                });
            });
        }
        return state;
    }
}
exports.GlimwoodTangle = GlimwoodTangle;
