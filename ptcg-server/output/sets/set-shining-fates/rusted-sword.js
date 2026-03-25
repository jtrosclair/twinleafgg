"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustedSword = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RustedSword extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.regulationMark = 'D';
        this.name = 'Rusted Sword';
        this.fullName = 'Rusted Sword SHF';
        this.text = 'The attacks of the Zacian V this card is attached to do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        // Refs: set-dark-explorers/dark-claw.ts (tool active-damage bonus), prefabs/prefabs.ts (TOOL_ACTIVE_DAMAGE_BONUS)
        (0, prefabs_1.TOOL_ACTIVE_DAMAGE_BONUS)(store, state, effect, this, {
            damageBonus: 30,
            sourcePokemonName: 'Zacian V'
        });
        return state;
    }
}
exports.RustedSword = RustedSword;
