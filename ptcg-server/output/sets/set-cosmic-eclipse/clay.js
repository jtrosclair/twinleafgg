"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clay = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_list_1 = require("../../game/store/state/card-list");
class Clay extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '188';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.name = 'Clay';
        this.fullName = 'Clay CEC';
        this.text = 'Discard the top 7 cards of your deck. If any of those cards are Item cards, put them into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            effect.preventDefault = true;
            player.hand.moveCardTo(this, player.supporter);
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 7);
            // Filter for item cards
            const itemCards = deckTop.cards.filter(c => c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM);
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
                return state;
            }
            // Move all cards to discard
            deckTop.moveTo(player.discard, deckTop.cards.length);
            itemCards.forEach((card, index) => {
                store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
            });
            // Move item cards to hand
            prefabs_1.MOVE_CARDS(store, state, player.discard, player.hand, { cards: itemCards, sourceCard: this });
            prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
            return state;
        }
        return state;
    }
}
exports.Clay = Clay;
