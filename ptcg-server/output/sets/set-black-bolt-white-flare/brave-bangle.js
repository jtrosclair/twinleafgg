"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraveBangle = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BraveBangle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.regulationMark = 'I';
        this.name = 'Brave Bangle';
        this.fullName = 'Brave Bangle SV11W';
        this.text = 'The attacks of the Pokémon this card is attached to (excluding Pokémon with a Rule Box) deal 30 more damage to your opponent\'s Active Pokémon ex.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.tools.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const sourceCard = effect.source;
            const targetCard = effect.target.getPokemonCard();
            const attack = effect.attack;
            if (sourceCard && !sourceCard.hasRuleBox()) {
                if (targetCard && targetCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    if (attack && attack.damage > 0 && effect.target === opponent.active) {
                        effect.damage += 30;
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.BraveBangle = BraveBangle;
