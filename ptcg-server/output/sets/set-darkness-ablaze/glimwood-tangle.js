"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlimwoodTangle = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GlimwoodTangle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DAA';
        this.name = 'Glimwood Tangle';
        this.fullName = 'Glimwood Tangle DAA';
        this.text = 'Once during each player\'s turn, after that player flips any coins for an attack, they may ignore all results of those coin flips and begin flipping those coins again.';
    }
    reduceEffect(store, state, effect) {
        // Handle both coin flip effects and prompts when this stadium is in play
        if (state_utils_1.StateUtils.getStadiumCard(state) === this) {
            if (effect instanceof play_card_effects_1.CoinFlipEffect) {
                const playerId = effect.player.id;
                return this.handleCoinFlip(store, state, playerId);
            }
            if (effect instanceof game_1.CoinFlipPrompt) {
                const playerId = effect.playerId;
                return this.handleCoinFlip(store, state, playerId);
            }
        }
        return state;
    }
    handleCoinFlip(store, state, playerId) {
        // First ask if they want to reflip
        return store.prompt(state, new game_1.ConfirmPrompt(playerId, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToReflip => {
            if (wantToReflip) {
                // If they want to reflip, do a new coin flip
                return store.prompt(state, [
                    new game_1.CoinFlipPrompt(playerId, game_message_1.GameMessage.FLIP_COIN)
                ], result => {
                    // The new result will replace the previous one
                    return state;
                });
            }
            else {
                // If they don't want to reflip, let the original result stand
                return state;
            }
        });
    }
}
exports.GlimwoodTangle = GlimwoodTangle;
