"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuscleBand = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MuscleBand extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'XY';
        this.name = 'Muscle Band';
        this.fullName = 'Muscle Band XY';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.text = 'The attacks of the Pokemon this card is attached to do 20 more ' +
            'damage to our opponent\'s Active Pokemon (before aplying Weakness ' +
            'and Resistance).';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.TOOL_ACTIVE_DAMAGE_BONUS)(store, state, effect, this, { damageBonus: 20 });
        return state;
    }
}
exports.MuscleBand = MuscleBand;
