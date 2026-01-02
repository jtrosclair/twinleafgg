"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheRocketsTrainingGym = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
class TheRocketsTrainingGym extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'The Rocket\'s Training Gym';
        this.fullName = 'The Rocket\'s Training Gym G1';
        this.text = 'Each player pays [C] more to retreat his or her Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                effect.cost.push(card_types_1.CardType.COLORLESS);
            }
        }
        return state;
    }
}
exports.TheRocketsTrainingGym = TheRocketsTrainingGym;
