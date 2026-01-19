"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientBoosterEnergyCapsule = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AncientBoosterEnergyCapsule extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Ancient Booster Energy Capsule';
        this.fullName = 'Ancient Booster Energy Capsule PAR';
        this.text = 'The Ancient Pokémon this card is attached to gets +60 HP, recovers from all Special Conditions, and can\'t be affected by any Special Conditions.';
    }
    reduceEffect(store, state, effect) {
        // Handle TrainerEffect - clear special conditions when tool is attached
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this && effect.target instanceof game_1.PokemonCardList) {
            const cardList = effect.target;
            const card = cardList.getPokemonCard();
            if (card && card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                // Clear all special conditions when attached
                if (cardList.specialConditions.length > 0) {
                    cardList.specialConditions = [];
                }
            }
        }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.tools.includes(this)) {
            const card = effect.target.getPokemonCard();
            if (card === undefined) {
                return state;
            }
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                return state;
            }
            if (card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                effect.hp += 60;
            }
        }
        if (effect instanceof check_effects_1.AddSpecialConditionsPowerEffect) {
            const cardList = effect.target;
            if (cardList instanceof game_1.PokemonCardList && cardList.tools.includes(this)) {
                const card = cardList.getPokemonCard();
                if (card && card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                    // Try to reduce ToolEffect, to check if something is blocking the tool from working
                    if (!(0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                        // Prevent all special conditions
                        effect.specialConditions = [];
                    }
                }
            }
        }
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect) {
            const cardList = effect.target;
            if (cardList instanceof game_1.PokemonCardList && cardList.tools.includes(this)) {
                const card = cardList.getPokemonCard();
                if (card && card.tags.includes(card_types_1.CardTag.ANCIENT)) {
                    // Try to reduce ToolEffect, to check if something is blocking the tool from working
                    if (!(0, prefabs_1.IS_TOOL_BLOCKED)(store, state, effect.player, this)) {
                        // Prevent all special conditions
                        effect.specialConditions = [];
                    }
                }
            }
        }
        return state;
    }
}
exports.AncientBoosterEnergyCapsule = AncientBoosterEnergyCapsule;
