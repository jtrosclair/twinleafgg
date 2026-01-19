"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LumBerry = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class LumBerry extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'EM';
        this.name = 'Lum Berry';
        this.fullName = 'Lum Berry EM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.text = 'At the end of each turn, if the Pokémon this card is attached to is affected by any Special Conditions, it recovers from all of them, and discard this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            // Handle Lum Berry for player's Active Pokémon
            if (player.active.cards.includes(this) && player.active.specialConditions.length > 0) {
                player.active.specialConditions.slice().forEach(condition => {
                    player.active.removeSpecialCondition(condition);
                });
                // Discard Lum Berry after use
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                    if (cardList.tools && cardList.tools.includes(this)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            }
            // Handle Lum Berry for opponent's Active Pokémon
            if (opponent.active.cards.includes(this) && opponent.active.specialConditions.length > 0) {
                opponent.active.specialConditions.slice().forEach(condition => {
                    opponent.active.removeSpecialCondition(condition);
                });
                // Discard Lum Berry after use
                opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                    if (cardList.tools && cardList.tools.includes(this)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            }
        }
        return state;
    }
}
exports.LumBerry = LumBerry;
