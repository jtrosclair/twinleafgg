"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NightMine = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
class NightMine extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '197';
        this.name = 'Nighttime Mine';
        this.fullName = 'Night Mine M2a';
        this.text = 'Attacks used by each Tera Pokémon in play (both yours and your opponent\'s) cost [C] more.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_TERA)) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index > -1) {
                    effect.cost.splice(index, 0, card_types_1.CardType.COLORLESS);
                }
                else {
                    effect.cost.push(card_types_1.CardType.COLORLESS);
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.NightMine = NightMine;
