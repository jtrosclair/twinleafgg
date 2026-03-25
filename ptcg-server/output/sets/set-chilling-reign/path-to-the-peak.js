"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathToThePeak = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class PathToThePeak extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.regulationMark = 'E';
        this.name = 'Path to the Peak';
        this.fullName = 'Path to the Peak CRE';
        this.text = 'Pokémon with a Rule Box in play (both yours and your opponent\'s) have no Abilities. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const targetPokemon = effect.target;
            if (!targetPokemon) {
                return state;
            }
            // Check if target is in play
            const targetCardList = state_utils_1.StateUtils.findCardList(state, targetPokemon);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            // Check if Pokemon has a Rule Box
            if (targetPokemon.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                targetPokemon.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                targetPokemon.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                targetPokemon.tags.includes(card_types_1.CardTag.POKEMON_ex) ||
                targetPokemon.tags.includes(card_types_1.CardTag.POKEMON_EX) ||
                targetPokemon.tags.includes(card_types_1.CardTag.BREAK) ||
                targetPokemon.tags.includes(card_types_1.CardTag.POKEMON_GX) ||
                targetPokemon.tags.includes(card_types_1.CardTag.PRISM_STAR) ||
                targetPokemon.tags.includes(card_types_1.CardTag.RADIANT)) {
                // Filter out all abilities
                effect.powers = effect.powers.filter(power => power.powerType !== game_1.PowerType.ABILITY);
            }
        }
        if (effect instanceof game_effects_1.PowerEffect && state_utils_1.StateUtils.getStadiumCard(state) === this &&
            !effect.power.exemptFromAbilityLock) {
            if (effect.power.useFromDiscard || effect.power.useFromHand) {
                return state;
            }
            const pokemonCard = effect.card;
            if (pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_ex) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_EX) ||
                pokemonCard.tags.includes(card_types_1.CardTag.BREAK) ||
                pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_GX) ||
                pokemonCard.tags.includes(card_types_1.CardTag.PRISM_STAR) ||
                pokemonCard.tags.includes(card_types_1.CardTag.RADIANT)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.PathToThePeak = PathToThePeak;
