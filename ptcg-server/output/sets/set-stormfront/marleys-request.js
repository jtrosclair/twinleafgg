"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarleysRequest = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MarleysRequest extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.cardImage = 'assets/cardback.png';
        this.set = 'SF';
        this.setNumber = '87';
        this.name = 'Marley\'s Request';
        this.fullName = 'Marley\'s Request SF';
        this.text = 'Search your discard pile for 2 different Trainer, Supporter, or Stadium cards, show them to your opponent, and your opponent chooses 1 of them. Put that card into your hand, and discard the other card. (If all Trainer, Supporter, and Stadium cards in your discard pile have the same name, choose 1 of them. Show that card to your opponent and put it into your hand.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            effect.preventDefault = true;
            player.hand.moveCardTo(this, player.supporter);
            const blocked = [];
            const notBlocked = new game_1.CardList();
            player.discard.cards.forEach((c, index) => {
                const isItem = c instanceof game_1.TrainerCard && (c.trainerType === game_1.TrainerType.ITEM);
                const isSupporter = c instanceof game_1.TrainerCard && (c.trainerType === game_1.TrainerType.SUPPORTER);
                const isStadium = c instanceof game_1.TrainerCard && (c.trainerType === game_1.TrainerType.STADIUM);
                if (!(isItem || isSupporter || isStadium)) {
                    blocked.push(index);
                }
                else {
                    notBlocked.cards.push(c);
                }
            });
            if (notBlocked.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.preventDefault = true;
            if (notBlocked.cards.length === 1 || notBlocked.cards.every(card => card.name === notBlocked.cards[0].name)) {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false, blocked }), cards => {
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                    cards.forEach(card => prefabs_1.MOVE_CARD_TO(state, card, player.hand));
                    player.supporter.moveCardTo(this, player.discard);
                });
            }
            else {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 2, max: 2, allowCancel: false, blocked }), cards => {
                    if (cards[0].name === cards[1].name) {
                        throw new game_1.GameError(game_1.GameMessage.CHOOSE_CARDS);
                    }
                    const chosenCards = new game_1.CardList();
                    cards.forEach(card => chosenCards.cards.push(card));
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_HAND, chosenCards, {}, { min: 1, max: 1, allowCancel: false }), card => {
                        prefabs_1.MOVE_CARD_TO(state, card[0], player.hand);
                        player.supporter.moveCardTo(this, player.discard);
                    });
                });
            }
        }
        return state;
    }
}
exports.MarleysRequest = MarleysRequest;
