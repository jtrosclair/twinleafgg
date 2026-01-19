"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostWorld = void 0;
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
class LostWorld extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CL';
        this.name = 'Lost World';
        this.fullName = 'Lost World CL';
        this.text = 'Once during each player\'s turn, if that player\'s opponent has 6 or more Pokémon in the Lost Zone, the player may choose to win the game.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const winner = state.activePlayer;
            if (opponent.lostzone.cards.filter(c => c instanceof game_1.PokemonCard).length < 6) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            state = (0, check_effect_1.endGame)(store, state, winner);
        }
        return state;
    }
}
exports.LostWorld = LostWorld;
