"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emma = exports.EMMA_PLAYED_THIS_TURN = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
exports.EMMA_PLAYED_THIS_TURN = 'EMMA_PLAYED_THIS_TURN';
class Emma extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Emma';
        this.fullName = 'Emma M4';
        this.text = 'Your opponent reveals their hand. Draw a card for each Pokemon you find there.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponent.hand.cards);
            const pokemonCount = opponent.hand.cards.filter(c => c instanceof pokemon_card_1.PokemonCard).length;
            (0, prefabs_1.DRAW_CARDS)(player, pokemonCount);
            (0, prefabs_1.ADD_MARKER)(exports.EMMA_PLAYED_THIS_TURN, player, this);
            (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, exports.EMMA_PLAYED_THIS_TURN, this);
        }
        return state;
    }
}
exports.Emma = Emma;
