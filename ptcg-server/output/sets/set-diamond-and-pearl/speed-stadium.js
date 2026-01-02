"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeedStadium = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SpeedStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '114';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DP';
        this.name = 'Speed Stadium';
        this.fullName = 'Speed Stadium DP';
        this.text = 'Once during each player\'s turn, the player may flip a coin until he or she gets tails. For each heads, that player draws a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    prefabs_1.DRAW_CARDS(player, 1);
                    return this.reduceEffect(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.SpeedStadium = SpeedStadium;
