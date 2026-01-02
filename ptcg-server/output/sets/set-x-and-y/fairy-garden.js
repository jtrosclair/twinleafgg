"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FairyGarden = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class FairyGarden extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'XY';
        this.name = 'Fairy Garden';
        this.fullName = 'Fairy Garden XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.text = 'Each Pokémon that has any [Y] Energy attached to it (both yours and your opponent\'s) has no Retreat Cost.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasFairyEnergy = state_utils_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.FAIRY]);
            if (hasFairyEnergy) {
                effect.cost = [];
            }
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.FairyGarden = FairyGarden;
