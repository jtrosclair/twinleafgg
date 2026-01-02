"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagneticStorm = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MagneticStorm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'HL';
        this.name = 'Magnetic Storm';
        this.fullName = 'Magnetic Storm HL';
        this.text = 'Any damage done by attacks from [P] Pokémon and [F] Pokémon (both yours and your opponent\'s) is not affected by Resistance.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.PSYCHIC) || checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                effect.ignoreResistance = true;
            }
        }
        return state;
    }
}
exports.MagneticStorm = MagneticStorm;
