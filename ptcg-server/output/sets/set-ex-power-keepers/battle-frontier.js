"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleFrontier = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class BattleFrontier extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PK';
        this.name = 'Battle Frontier';
        this.fullName = 'Battle Frontier PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.text = 'Each player\'s [C] Evolved Pokémon, [D] Evolved Pokémon, and [M] Evolved Pokémon can\'t use any Poké-Powers or Poké-Bodies.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const pokemonCard = effect.card;
            const cardList = state_utils_1.StateUtils.findCardList(state, pokemonCard);
            let cardTypes = [effect.card.cardType];
            if (cardList instanceof pokemon_card_list_1.PokemonCardList) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
                cardTypes = checkPokemonType.cardTypes;
            }
            // We are blocking the powers from [C], [D], and [M] Pokemon
            if (!cardTypes.includes(card_types_1.CardType.COLORLESS) &&
                !cardTypes.includes(card_types_1.CardType.DARK) &&
                !cardTypes.includes(card_types_1.CardType.METAL)) {
                return state;
            }
            const isEvolved = cardList instanceof pokemon_card_list_1.PokemonCardList && cardList.getPokemons().length > 1;
            if (!effect.power.exemptFromAbilityLock) {
                if (isEvolved && (effect.power.powerType === game_1.PowerType.POKEBODY || effect.power.powerType === game_1.PowerType.POKEPOWER)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.BattleFrontier = BattleFrontier;
