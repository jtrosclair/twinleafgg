"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingClover = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Check deck is not empty
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Count how many Missing Clover cards remain in hand
    // (the played card has already been moved to supporter by PlayItemEffect)
    const count = player.hand.cards.filter(c => c.name === 'Missing Clover').length;
    let playAllFour = false;
    // If player has 3 more in hand (4 total), ask if they want to play all 4 at once
    if (count >= 3) {
        yield store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_PLAY_ALL_CARDS_AT_ONCE), result => {
            playAllFour = result;
            next();
        });
    }
    // Move the played card from hand to supporter
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    effect.preventDefault = true;
    if (playAllFour) {
        // Move the other 3 Missing Clover cards from hand to supporter
        const otherCloverCards = player.hand.cards.filter(c => c.name === 'Missing Clover').slice(0, 3);
        for (const card of otherCloverCards) {
            player.hand.moveCardTo(card, player.supporter);
        }
        // Check if player has prizes to take
        if (player.prizes.length === 0) {
            const allCloverCards = player.supporter.cards.filter(c => c.name === 'Missing Clover');
            for (const card of allCloverCards) {
                player.supporter.moveCardTo(card, player.discard);
            }
            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        // Take a prize card
        yield (0, prefabs_1.TAKE_X_PRIZES)(store, state, player, 1, {}, () => {
            // Discard all 4 Missing Clover cards
            const allCloverCards = player.supporter.cards.filter(c => c.name === 'Missing Clover');
            for (const card of allCloverCards) {
                player.supporter.moveCardTo(card, player.discard);
            }
            next();
        });
    }
    else {
        // Play 1 card: look at the top card of your deck
        const topCard = player.deck.cards[0];
        yield store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, [topCard]), () => {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            next();
        });
    }
    return state;
}
class MissingClover extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '129';
        this.name = 'Missing Clover';
        this.fullName = 'Missing Clover UPR';
        this.text = 'You may play 4 Missing Clover cards at once.\n\n• If you played 1 card, look at the top card of your deck.\n• If you played 4 cards, take a Prize card. (This effect works one time for 4 cards.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MissingClover = MissingClover;
