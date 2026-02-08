"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LightBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '191';
        this.name = 'Light Ball';
        this.fullName = 'Light Ball M2a';
        this.regulationMark = 'I';
        this.text = 'Attacks used by the Pikachu ex this card is attached to do 50 more damage to your opponent\'s Active Pokémon ex (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.tools.includes(this)) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            // Check if source Pokemon is Pikachu ex
            const sourceCard = effect.source.getPokemonCard();
            if (!sourceCard || sourceCard.name !== 'Pikachu ex') {
                return state;
            }
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Only apply to opponent's Active Pokemon
            if (effect.target !== opponent.active) {
                return state;
            }
            const targetCard = effect.target.getPokemonCard();
            if (targetCard && targetCard.tags.includes(card_types_1.CardTag.POKEMON_ex) && effect.damage > 0) {
                effect.damage += 50;
            }
        }
        return state;
    }
}
exports.LightBall = LightBall;
