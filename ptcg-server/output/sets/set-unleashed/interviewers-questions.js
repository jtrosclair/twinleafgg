"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewersQuestions = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class InterviewersQuestions extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Interviewer\'s Questions';
        this.fullName = 'Interviewer\'s Questions UL';
        this.text = 'Look at the top 8 cards of your deck. Choose as many Energy cards as you like, show them to your opponent, and put them into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const temp = new game_1.CardList();
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.deck.moveTo(temp, 8);
            const maxEnergyCards = Math.min(8, temp.cards.filter(c => c instanceof game_1.EnergyCard).length);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, temp, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: maxEnergyCards }), chosenCards => {
                if (chosenCards.length == 0) {
                    // No Energy chosen, shuffle all back
                    temp.cards.forEach(card => {
                        temp.moveCardTo(card, player.deck);
                    });
                }
                if (chosenCards.length > 0) {
                    // Move chosen Energy to hand
                    chosenCards.forEach(card => {
                        temp.moveCardTo(card, player.hand);
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (chosenCards.length > 0) {
                        state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenCards), () => state);
                    }
                    temp.moveTo(player.deck);
                    if (chosenCards.length > 0) {
                        state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenCards), () => state);
                    }
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.InterviewersQuestions = InterviewersQuestions;
