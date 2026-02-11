"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuzzleOfTime = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
const order_cards_prompt_1 = require("../../game/store/prompts/order-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const name = effect.trainerCard.name;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const count = player.hand.cards.reduce((sum, c) => {
        return sum + (c.name === name ? 1 : 0);
    }, 0);
    let playTwoCards = false;
    if (count >= 2) {
        yield store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE), result => {
            playTwoCards = result;
            next();
        });
    }
    if (playTwoCards === false) {
        // Play 1 card: Look at the top 3 cards and put them back in any order
        const deckTop = new card_list_1.CardList();
        player.deck.moveTo(deckTop, 3);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return store.prompt(state, new order_cards_prompt_1.OrderCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
            if (order === null) {
                return state;
            }
            deckTop.applyOrder(order);
            deckTop.moveToTopOfDestination(player.deck);
            return state;
        });
    }
    // Play 2 cards: Put 2 cards from discard pile into hand
    if (player.discard.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Discard second Puzzle of Time
    const second = player.hand.cards.find(c => {
        return c.name === name && c !== effect.trainerCard;
    });
    if (second !== undefined) {
        player.hand.moveCardTo(second, player.discard);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 0, max: 2, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    // Move selected cards to hand
    player.discard.moveCardsTo(cards, player.hand);
    return state;
}
class PuzzleOfTime extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BKP';
        this.name = 'Puzzle of Time';
        this.fullName = 'Puzzle of Time BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.text = 'You may play 2 Puzzle of Time cards at once. ' +
            '' +
            '• If you played 1 card, look at the top 3 cards of your deck and put them back in any order. ' +
            '• If you played 2 cards, put 2 cards from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PuzzleOfTime = PuzzleOfTime;
