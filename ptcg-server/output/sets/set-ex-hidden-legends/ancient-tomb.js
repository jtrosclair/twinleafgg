"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientTomb = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_2 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class AncientTomb extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_2.TrainerType.STADIUM;
        this.set = 'HL';
        this.setNumber = '87';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ancient Tomb';
        this.fullName = 'Ancient Tomb HL';
        this.text = 'Don\'t apply Weakness for all Pokémon in play (excluding Pokémon-ex and Pokémon that has an owner in its name).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const target = effect.target.getPokemonCard();
            if (!(target === null || target === void 0 ? void 0 : target.tags.includes(card_types_1.CardTag.POKEMON_ex)) && !(target === null || target === void 0 ? void 0 : target.name.includes('\'s'))) {
                effect.weakness = [];
            }
            if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
        }
        return state;
    }
}
exports.AncientTomb = AncientTomb;
