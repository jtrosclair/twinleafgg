"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashExchange = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TrashExchange extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'G1';
        this.setNumber = '126';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Trash Exchange';
        this.fullName = 'Trash Exchange G1';
        this.text = 'Count the number of cards in your discard pile and shuffle them into your deck. Then discard that many cards from the top of your deck.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const discardCount = player.discard.cards.length;
            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            player.deck.moveTo(player.discard, discardCount);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.TrashExchange = TrashExchange;
