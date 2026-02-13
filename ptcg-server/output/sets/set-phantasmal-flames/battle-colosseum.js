"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleColosseum = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class BattleColosseum extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.name = 'Battle Cage';
        this.fullName = 'Battle Colosseum M2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.text = 'Prevent all damage counters from being placed on Benched Pokémon (both yours and your opponent\'s) by effects of attacks and Abilities from the opponent\'s Pokémon. (Damage from attacks is still taken.)';
    }
    reduceEffect(store, state, effect) {
        // Also prevent damage counters from effects like PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE
        if (effect instanceof attack_effects_1.PutCountersEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const sourcePokemon = effect.source;
            // Check if the source belongs to the opponent of the target's owner
            if (sourcePokemon) {
                const targetOwner = state_utils_1.StateUtils.findOwner(state, effect.target);
                const targetOpponent = state_utils_1.StateUtils.getOpponent(state, targetOwner);
                const sourceOwner = state_utils_1.StateUtils.findOwner(state, sourcePokemon);
                if (sourceOwner === targetOpponent) {
                    // Check if the target is a benched Pokemon (not active)
                    if (effect.target !== targetOwner.active && effect.target !== targetOpponent.active) {
                        // Prevent damage counters to benched Pokemon from opponent's attacks/abilities
                        effect.preventDefault = true;
                    }
                }
            }
        }
        if (effect instanceof game_effects_1.PlaceDamageCountersEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            // Check if the source is provided and belongs to the opponent of the target's owner
            if (effect.source) {
                const sourceCardList = state_utils_1.StateUtils.findPokemonSlot(state, effect.source);
                if (sourceCardList) {
                    const targetOwner = state_utils_1.StateUtils.findOwner(state, effect.target);
                    const targetOpponent = state_utils_1.StateUtils.getOpponent(state, targetOwner);
                    const sourceOwner = state_utils_1.StateUtils.findOwner(state, sourceCardList);
                    if (sourceOwner === targetOpponent) {
                        // Check if the target is a benched Pokemon (not active)
                        if (effect.target !== targetOwner.active && effect.target !== targetOpponent.active) {
                            // Prevent damage counters to benched Pokemon from opponent's attacks/abilities
                            effect.preventDefault = true;
                        }
                    }
                }
            }
        }
        return state;
    }
}
exports.BattleColosseum = BattleColosseum;
