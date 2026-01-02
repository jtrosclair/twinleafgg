"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavenderTown = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LavenderTown extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '147';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'TEU';
        this.name = 'Lavender Town';
        this.fullName = 'Lavender Town TEU';
        this.text = 'Once during each player\'s turn, that player may have their opponent reveal their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
        }
        return state;
    }
}
exports.LavenderTown = LavenderTown;
