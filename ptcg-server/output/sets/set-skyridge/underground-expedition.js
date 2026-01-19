"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndergroundExpedition = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class UndergroundExpedition extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Underground Expedition';
        this.fullName = 'Underground Expedition SK';
        this.text = 'Look at the bottom 4 cards of your deck and put 2 of them into your hand. Put the other cards back on the bottom of your deck in any order.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Take the bottom 4 cards of the deck using slice
            const numBottom = Math.min(4, player.deck.cards.length);
            const bottomCards = player.deck.cards.slice(-numBottom);
            // Remove those cards from the deck
            player.deck.cards.splice(-numBottom, numBottom);
            const bottomCardList = new game_1.CardList();
            bottomCardList.cards = bottomCards;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, bottomCardList, {}, { min: 2, max: 2, allowCancel: false }), selected => {
                // Put chosen cards into hand
                for (const card of selected) {
                    bottomCardList.moveCardTo(card, player.hand);
                }
                // The rest go back to the bottom of the deck
                while (bottomCardList.cards.length > 0) {
                    bottomCardList.moveCardTo(bottomCardList.cards[0], player.deck);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.UndergroundExpedition = UndergroundExpedition;
