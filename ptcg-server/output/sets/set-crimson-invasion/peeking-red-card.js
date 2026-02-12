"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeekingRedCard = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
class PeekingRedCard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'CIN';
        this.name = 'Peeking Red Card';
        this.fullName = 'Peeking Red Card CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.text = 'Your opponent reveals their hand. You may have your opponent count the cards in their hand, shuffle those cards into their deck, then draw that many cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const opponentCards = opponent.hand.cards.filter(c => c !== this);
            const cardCount = opponentCards.length;
            // Opponent reveals their hand (automatically happens when we check it)
            state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    if (cardCount === 0 && opponent.deck.cards.length === 0) {
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return;
                    }
                    opponent.hand.moveCardsTo(opponentCards, opponent.deck);
                    store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                        opponent.deck.applyOrder(order);
                    });
                    opponent.deck.moveTo(opponent.hand, Math.min(cardCount, opponent.deck.cards.length));
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.PeekingRedCard = PeekingRedCard;
