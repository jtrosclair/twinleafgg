"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorBirch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ProfessorBirch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'EM';
        this.name = 'Professor Birch';
        this.fullName = 'Professor Birch EM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.text = 'Draw cards from your deck until you have 6 cards in your hand.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 6);
            (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
        }
        return state;
    }
}
exports.ProfessorBirch = ProfessorBirch;
