"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedsChallenge = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RedsChallenge extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '184';
        this.name = 'Red\'s Challenge';
        this.fullName = 'Red\'s Challenge UNB';
        this.text = 'You can play this card only if you discard 2 other cards from your hand.\n\nSearch your deck for a card and put it into your hand.Then, shuffle your deck.';
    }
    canPlay(store, state, player) {
        // Check if supporter already played this turn
        if (player.supporterTurn > 0) {
            return false;
        }
        if (player.deck.cards.length === 0) {
            return false;
        }
        if (player.hand.cards.filter(c => c !== this).length < 2) {
            return false;
        }
        // No other restrictions - card can be played
        return true;
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.hand.cards.filter(c => c !== this).length < 2) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            (0, trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND)(effect, store, state, 2, 2);
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 1, max: 1, allowCancel: false });
        }
        return state;
    }
}
exports.RedsChallenge = RedsChallenge;
