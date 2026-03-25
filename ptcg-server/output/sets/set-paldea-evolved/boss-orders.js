"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BossOrders = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
class BossOrders extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '172';
        this.name = 'Boss\'s Orders';
        this.fullName = 'Boss\'s Orders PAL';
        this.text = 'Switch 1 of your opponent\'s Benched Pokemon with his or her ' +
            'Active Pokemon.';
    }
    canPlay(store, state, player) {
        if (player.supporterTurn > 0) {
            return false;
        }
        const opponent = state_utils_1.StateUtils.getOpponent(state, player);
        const hasBench = opponent.bench.some(b => b.cards.length > 0);
        return hasBench;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            // Legacy implementation:
            // - Used a manual ChoosePokemonPrompt and optional TrainerTargetEffect redirect.
            // - Switched opponent Active to chosen Benched target.
            //
            // Converted to prefab version (SWITCH_IN_OPPONENT_BENCHED_POKEMON).
            if (effect.player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            (0, prefabs_1.SWITCH_IN_OPPONENT_BENCHED_POKEMON)(store, state, effect.player, { allowCancel: false });
        }
        return state;
    }
}
exports.BossOrders = BossOrders;
