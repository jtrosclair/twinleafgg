"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefianceVest = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DefianceVest extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.set = 'PAR';
        this.name = 'Defiance Vest';
        this.fullName = 'Defiance Vest PAR';
        this.text = 'If you have more Prize cards remaining than your opponent, the Pokémon this card is attached to takes 40 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        // Reduce damage by 40
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                return state;
            }
            // Check if damage target is owned by this card's owner 
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (targetPlayer === player) {
                effect.reduceDamage(40);
            }
            return state;
        }
        return state;
    }
}
exports.DefianceVest = DefianceVest;
