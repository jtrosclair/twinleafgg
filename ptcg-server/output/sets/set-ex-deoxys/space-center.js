"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceCenter = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
const game_1 = require("../../game");
class SpaceCenter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DX';
        this.name = 'Space Center';
        this.fullName = 'Space Center DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.text = 'Ignore Poké-Bodies for all Basic Pokémon in play (both yours and your opponent\'s) (excluding Pokémon-ex and Pokémon that has an owner in its name).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const targetPokemon = effect.target;
            if (!targetPokemon) {
                return state;
            }
            const cardList = effect.target;
            // ex era ruling is that this should mean unevolved
            const isBasic = cardList instanceof pokemon_card_list_1.PokemonCardList && (cardList.getPokemons().length === 1 || targetPokemon.tags.includes(card_types_1.CardTag.LEGEND));
            // Also should not block owner pokemon, but thats a future me problem
            if (isBasic && !targetPokemon.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                // Filter out Poké Bodies
                effect.powers = effect.powers.filter(power => power.powerType !== game_1.PowerType.POKEBODY);
            }
        }
        if (effect instanceof game_effects_1.PowerEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const pokemonCard = effect.card;
            const cardList = state_utils_1.StateUtils.findCardList(state, pokemonCard);
            // ex era ruling is that this should mean unevolved
            const isBasic = cardList.getPokemons().length === 1 || pokemonCard.tags.includes(card_types_1.CardTag.LEGEND);
            // Also should not block owner pokemon, but thats a future me problem
            if (!effect.power.exemptFromAbilityLock) {
                if (isBasic && !effect.card.tags.includes(card_types_1.CardTag.POKEMON_ex) && pokemonCard.powers.some(power => power.powerType === game_1.PowerType.POKEBODY)) {
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
exports.SpaceCenter = SpaceCenter;
