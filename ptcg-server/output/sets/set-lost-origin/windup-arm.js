"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindupArm = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class WindupArm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.setNumber = '170';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Windup Arm';
        this.fullName = 'Windup Arm LOR 170';
        this.text = 'The Pokémon this card is attached to can attack even if it\'s Asleep or Paralyzed.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseAttackEffect && effect.player.active.tools.includes(this)) {
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            effect.ignoreStatusConditions = true;
        }
        return state;
    }
}
exports.WindupArm = WindupArm;
