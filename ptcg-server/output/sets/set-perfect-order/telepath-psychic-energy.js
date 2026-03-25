"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelepathPsychicEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class TelepathPsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.PSYCHIC];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.name = 'Telepath Psychic Energy';
        this.fullName = 'Telepath [P] Energy M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.text = 'This card provides [P] Energy while this card is attached to a Pokemon.\n\nWhen you attach this card from your hand to 1 of your [P] Pokemon, you may search your deck for 2 Basic [P] Pokemon and put them onto your Bench. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        // Provide [P] Energy
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.PSYCHIC] });
        }
        // When attached, search for 2 Basic Psychic Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_SPECIAL_ENERGY_BLOCKED)(store, state, player, this, effect.target)) {
                return state;
            }
            // Check if target is a Psychic Pokemon
            const checkType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkType);
            if (!checkType.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                return state;
            }
            if ((0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player).length === 0) {
                return state;
            }
            // Search for Basic Psychic Pokemon
            const basicPsychicPokemon = player.deck.cards.filter(card => card instanceof pokemon_card_1.PokemonCard &&
                card.stage === card_types_1.Stage.BASIC);
            // Filter for Psychic type
            const validPokemon = [];
            for (const card of basicPsychicPokemon) {
                if (card instanceof pokemon_card_1.PokemonCard && card.cardType === card_types_1.CardType.PSYCHIC) {
                    validPokemon.push(card);
                }
            }
            if (validPokemon.length === 0) {
                return state;
            }
            const maxToPut = Math.min(2, validPokemon.length, (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player).length);
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, {
                stage: card_types_1.Stage.BASIC,
                cardType: card_types_1.CardType.PSYCHIC
            }, { min: 0, max: maxToPut });
        }
        return state;
    }
}
exports.TelepathPsychicEnergy = TelepathPsychicEnergy;
