"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlainesLastResort = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BlainesLastResort extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Blaine\'s Last Resort';
        this.fullName = 'Blaine\'s Last Resort G1';
        this.text = 'You can\'t play this card if you have any cards in your hand other than Blaine\'s Last Resort. Show your hand to your opponent, then draw 5 cards.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            if (player.hand.cards.some(card => card.name !== 'Blaine\'s Last Resort')) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            (0, prefabs_1.DRAW_CARDS)(player, 5);
        }
        return state;
    }
}
exports.BlainesLastResort = BlainesLastResort;
