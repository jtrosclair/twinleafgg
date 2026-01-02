"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelescopicSight = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TelescopicSight extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'VIV';
        this.setNumber = '160';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Telescopic Sight';
        this.fullName = 'Telescopic Sight VIV';
        this.text = 'The attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Benched Pokémon V and Benched Pokémon-GX.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.tools.includes(this)) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            const target = effect.target.getPokemonCard();
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (effect.damage > 0 && effect.target !== opponent.active && target && (target.tags.includes(card_types_1.CardTag.POKEMON_GX) || target.tags.includes(card_types_1.CardTag.POKEMON_V) || target.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || target.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || target.tags.includes(card_types_1.CardTag.POKEMON_VUNION))) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.TelescopicSight = TelescopicSight;
