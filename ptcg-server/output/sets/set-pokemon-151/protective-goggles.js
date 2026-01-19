"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectiveGoggles = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ProtectiveGoggles extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'MEW';
        this.name = 'Protective Goggles';
        this.fullName = 'Protective Goggles MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '164';
        this.text = 'The Basic Pokémon this card is attached to has no Weakness.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect && effect.target.tools.includes(this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (!(0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this)) {
                const target = effect.target.getPokemonCard();
                if ((target === null || target === void 0 ? void 0 : target.stage) === card_types_1.Stage.BASIC) {
                    effect.weakness = [];
                }
            }
        }
        return state;
    }
}
exports.ProtectiveGoggles = ProtectiveGoggles;
