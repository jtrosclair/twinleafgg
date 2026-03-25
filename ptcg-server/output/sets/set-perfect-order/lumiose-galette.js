"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LumioseGalette = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LumioseGalette extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Lumiose Galette';
        this.fullName = 'Lumiose Galette M3';
        this.text = 'Heal 20 damage and 1 Special Condition from your Active Pokemon.';
    }
    canPlay(store, state, player) {
        const hasDamage = player.active.damage > 0;
        const hasSpecialCondition = player.active.specialConditions.length > 0;
        if (!hasDamage && !hasSpecialCondition) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if Active Pokemon has damage or special conditions
            const hasDamage = player.active.damage > 0;
            const hasSpecialCondition = player.active.specialConditions.length > 0;
            // Cannot be played if there's no damage AND no special conditions
            if (!hasDamage && !hasSpecialCondition) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.preventDefault = true;
            // Heal 20 damage
            const healEffect = new game_effects_1.HealEffect(player, player.active, 20);
            store.reduceEffect(state, healEffect);
            // Remove 1 Special Condition
            if (player.active.specialConditions.length > 0) {
                player.active.removeSpecialCondition(player.active.specialConditions[0]);
            }
        }
        return state;
    }
}
exports.LumioseGalette = LumioseGalette;
