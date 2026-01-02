"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalBeach = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CrystalBeach extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CG';
        this.name = 'Crystal Beach';
        this.fullName = 'Crystal Beach CG';
        this.text = 'Each Special Energy card that provides 2 or more Energy (both yours and your opponent\'s) now provides only 1 [C] Energy. This isn\'t affected by any Poké-Powers or Poké-Bodies.';
    }
    reduceEffect(store, state, effect) {
        // Energies that provide 2 or more provide [C]
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            effect.energyMap.forEach((value) => {
                if (value.provides.length >= 2) {
                    value.provides = [card_types_1.CardType.COLORLESS];
                }
            });
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && effect.stadium === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.CrystalBeach = CrystalBeach;
