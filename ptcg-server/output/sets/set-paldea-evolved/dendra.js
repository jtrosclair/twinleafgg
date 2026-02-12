"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dendra = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // Check if player has other cards in hand besides Dendra
    const otherCards = player.hand.cards.filter(c => c !== effect.trainerCard);
    if (otherCards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const deckBottom = new game_1.CardList();
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_BOTTOM_OF_THE_DECK, player.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        const cards = selected || [];
        player.hand.moveCardsTo(cards, deckBottom);
        next();
    });
    deckBottom.moveTo(player.deck);
    // Draw cards until you have 5 cards in hand
    while (player.hand.cards.length < 5) {
        if (player.deck.cards.length === 0) {
            break;
        }
        player.deck.moveTo(player.hand, 1);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class Dendra extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '179';
        this.name = 'Dendra';
        this.fullName = 'Dendra PAL';
        this.text = 'Put a card from your hand on the bottom of your deck. If you do, draw cards until you have 5 cards in your hand. (If you have no other cards in your hand, you can\'t use this card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Dendra = Dendra;
