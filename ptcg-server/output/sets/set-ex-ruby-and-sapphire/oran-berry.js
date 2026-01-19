"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OranBerry = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class OranBerry extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'RS';
        this.name = 'Oran Berry';
        this.fullName = 'Oran Berry RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.text = 'At any time between turns, if the Pokémon this card is attached to has at least 2 damage counters on it, remove 2 damage counters from it. Then discard Oran Berry.';
    }
    reduceEffect(store, state, effect) {
        // Using only between turns does not work; poison applies after sometimes
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect || effect instanceof game_phase_effects_1.BeginTurnEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage >= 20 && cardList.tools.includes(this)) {
                    cardList.damage -= 20;
                    cardList.moveCardTo(this, player.discard);
                }
            });
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage >= 20 && cardList.tools.includes(this)) {
                    cardList.damage -= 20;
                    cardList.moveCardTo(this, opponent.discard);
                }
            });
        }
        return state;
    }
}
exports.OranBerry = OranBerry;
