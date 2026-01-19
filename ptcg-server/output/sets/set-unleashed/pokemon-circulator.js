"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCirculator = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class PokemonCirculator extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Pokémon Circulator';
        this.fullName = 'Pokémon Circulator UL';
        this.text = 'Your opponent switches his or her Active Pokémon with 1 of his or her Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            effect.preventDefault = true;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.PokemonCirculator = PokemonCirculator;
