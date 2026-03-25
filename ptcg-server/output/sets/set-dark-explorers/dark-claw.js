"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkClaw = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkClaw extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'DEX';
        this.name = 'Dark Claw';
        this.fullName = 'Dark Claw DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.text = 'If this card is attached to a [D] Pokémon, each of the attacks ' +
            'of that Pokémon does 20 more damage to the Active Pokémon ' +
            '(before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        // Refs: set-boundaries-crossed/crystal-edge.ts (tool active-damage bonus), prefabs/prefabs.ts (TOOL_ACTIVE_DAMAGE_BONUS)
        (0, prefabs_1.TOOL_ACTIVE_DAMAGE_BONUS)(store, state, effect, this, {
            damageBonus: 20,
            sourceCardType: card_types_1.CardType.DARK
        });
        return state;
    }
}
exports.DarkClaw = DarkClaw;
