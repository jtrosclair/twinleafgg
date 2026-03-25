"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricMemory = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ElectricMemory extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UPR';
        this.setNumber = '121';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Electric Memory';
        this.fullName = 'Electric Memory UPR';
        this.text = 'The Silvally-GX this card is attached to is a Lightning Pokémon.';
    }
    // Ref: set-crimson-invasion/psychic-memory.ts (Psychic Memory - CheckPokemonTypeEffect tool)
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect) {
            // Check if this tool is attached to the target Pokemon
            if (!effect.target.tools.includes(this)) {
                return state;
            }
            // Check if it's attached to Silvally-GX
            const pokemonCard = effect.target.getPokemonCard();
            if (!pokemonCard || pokemonCard.name !== 'Silvally-GX') {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_TOOL_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Replace the type with Lightning
            effect.cardTypes = [card_types_1.CardType.LIGHTNING];
        }
        return state;
    }
}
exports.ElectricMemory = ElectricMemory;
