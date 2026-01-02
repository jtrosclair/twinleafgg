"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hugh = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hugh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Hugh';
        this.fullName = 'Hugh BCR';
        this.text = 'Both players discard cards from their hand until they each have 5 cards in hand. (Your opponent discards first. Any player with 5 cards or less in their hands do not discard any cards.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            // Get opponent's hand length
            const opponentHandLength = opponent.hand.cards.length;
            // Set discard amount to reach hand size of 5
            const discardAmount = opponentHandLength - 5;
            if (supporterTurn > 0) {
                throw new __1.GameError(__1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Opponent discards first
            if (opponent.hand.cards.length > 5) {
                store.prompt(state, new __1.ChooseCardsPrompt(opponent, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: discardAmount, max: discardAmount, allowCancel: false }), selected => {
                    const cards = selected || [];
                    prefabs_1.MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards, sourceCard: this });
                });
            }
            else {
                prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(opponent, 5);
            }
            const playerCards = player.hand.cards.filter(c => c !== this);
            // Get player's hand length
            const playerHandLength = playerCards.length;
            // Set discard amount to reach hand size of 5
            const playerDiscardAmount = playerHandLength - 5;
            // Player discards next
            if (player.hand.cards.length > 5) {
                store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: playerDiscardAmount, max: playerDiscardAmount, allowCancel: false }), selected => {
                    const cards = selected || [];
                    prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
                });
                prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
            }
            else {
                prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
            }
            prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
            return state;
        }
        return state;
    }
}
exports.Hugh = Hugh;
