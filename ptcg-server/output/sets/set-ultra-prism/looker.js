"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Looker = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class Looker extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.text = 'Draw 3 cards from the bottom of your deck.';
        this.set = 'UPR';
        this.setNumber = '126';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Looker';
        this.fullName = 'Looker UPR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Draw 3 cards from the bottom of the deck
            const count = Math.min(3, player.deck.cards.length);
            const bottomCards = player.deck.cards.slice(-count);
            player.deck.moveCardsTo(bottomCards, player.hand);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.Looker = Looker;
