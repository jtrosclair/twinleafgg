"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpostorProfessorOak = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ImpostorProfessorOak extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.name = 'Impostor Professor Oak';
        this.fullName = 'Impostor Professor Oak BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.text = 'Your opponent shuffles his or her hand into his or her deck, then draws 7 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.MOVE_CARDS(store, state, opponent.hand, opponent.deck, { sourceCard: this });
            prefabs_1.SHUFFLE_DECK(store, state, opponent);
            // Draw 7 cards for the opponent
            prefabs_1.DRAW_CARDS(opponent, 7);
            // Discard the played Trainer card
            prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
            return state;
        }
        return state;
    }
}
exports.ImpostorProfessorOak = ImpostorProfessorOak;
