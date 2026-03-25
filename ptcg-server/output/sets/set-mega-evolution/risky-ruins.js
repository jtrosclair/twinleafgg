"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DangerousRuins = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DangerousRuins extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'MEG';
        this.name = 'Risky Ruins';
        this.fullName = 'Risky Ruins MEG';
        this.text = 'Whenever either player puts a non-[D] Basic Pokémon onto their Bench, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.PlayPokemonEffect || effect instanceof play_card_effects_1.PlayPokemonFromDeckEffect) && game_1.StateUtils.getStadiumCard(state) === this) {
            if (effect.target.cards.length > 0 || effect.pokemonCard.cardType === card_types_1.CardType.DARK) {
                return state;
            }
            if (effect.pokemonCard.stage === card_types_1.Stage.BASIC) {
                effect.target.damage += 20;
            }
            return state;
        }
        return state;
    }
}
exports.DangerousRuins = DangerousRuins;
