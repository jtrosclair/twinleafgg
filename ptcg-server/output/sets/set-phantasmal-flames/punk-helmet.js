"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PunkHelmet = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class PunkHelmet extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Punk Helmet';
        this.fullName = 'Punk Helmet PFL';
        this.text = 'If the {D} Pokemon this card is attached to is in the Active Spot and is ' +
            'damaged by an attack from your opponent\'s Pokemon (even if this Pokemon is ' +
            'Knocked Out), place 4 damage counters on the Attacking Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tools.includes(this)) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            // Check if the attached Pokemon is a Dark-type
            const pokemonCard = effect.target.getPokemonCard();
            if (!pokemonCard || pokemonCard.cardType !== card_types_1.CardType.DARK) {
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
            if (state.phase === state_1.GamePhase.ATTACK) {
                effect.source.damage += 40;
            }
        }
        return state;
    }
}
exports.PunkHelmet = PunkHelmet;
