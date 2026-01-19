"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repel = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Repel extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEG';
        this.setNumber = '126';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'I';
        this.name = 'Repel';
        this.fullName = 'Repel M1L';
        this.text = 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        return state;
    }
}
exports.Repel = Repel;
