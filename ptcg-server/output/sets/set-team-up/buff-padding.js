"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffPadding = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BuffPadding extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'TEU';
        this.setNumber = '136';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Buff Padding';
        this.fullName = 'Buff Padding TEU';
        this.text = 'If the Pokémon this card is attached to has a Retreat Cost of exactly 4, it gets +50 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.tools.includes(this)) {
            const sourceCard = effect.target.getPokemonCard();
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (!sourceCard || sourceCard.retreat.length !== 4) {
                return state;
            }
            effect.hp += 50;
        }
        return state;
    }
}
exports.BuffPadding = BuffPadding;
