"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullFlame = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class FullFlame extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'LM';
        this.name = 'Full Flame';
        this.fullName = 'Full Flame LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.text = 'Put 4 damage counters instead of 2 on each Burned Pokémon between turns. The Special Condition Burned can\'t be removed by evolving or devolving the Burned Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            // If the active Pokemon is burned, set burn damage to 40 (4 damage counters)
            if (effect.player.active.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                effect.burnDamage = 40;
            }
        }
        // Preserve BURNED condition during evolution
        if (effect instanceof check_effects_1.CheckSpecialConditionRemovalEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            if (effect.target.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                if (!effect.preservedConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                    effect.preservedConditions.push(card_types_1.SpecialCondition.BURNED);
                }
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.FullFlame = FullFlame;
