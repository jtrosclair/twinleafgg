"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonLass = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class HolonLass extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Holon Lass';
        this.fullName = 'Holon Lass DS';
        this.text = 'Discard a card from your hand. If you can\'t discard a card from your hand, you can\'t play this card.\n\nCount the total number of Prize cards left(both yours and your opponent\'s). Look at that many cards from the top of your deck, choose as many Energy cards as you like, show them to your opponent, and put them into your hand. Put the other cards back on top of your deck. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            (0, trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND)(effect, store, state, 1, 1);
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const temp = new game_1.CardList();
            // Count total Prize cards left
            const totalPrizes = player.getPrizeLeft() + opponent.getPrizeLeft();
            player.deck.moveTo(temp, totalPrizes);
            // Count how many Energy cards are in temp
            const energyCount = temp.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY).length;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, temp, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: energyCount }), chosenCards => {
                if (chosenCards.length === 0) {
                    // No Energy chosen, shuffle all back
                    temp.cards.forEach(card => {
                        temp.moveCardTo(card, player.deck);
                    });
                }
                else {
                    // Move chosen Energy to hand
                    chosenCards.forEach(card => {
                        temp.moveCardTo(card, player.hand);
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (chosenCards.length > 0) {
                        (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, chosenCards);
                    }
                    temp.moveTo(player.deck);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.HolonLass = HolonLass;
