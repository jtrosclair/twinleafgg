"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergySwatter = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
class EnergySwatter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.usSetNumber = 'POR 73';
        this.name = 'Energy Swatter';
        this.fullName = 'Energy Swatter M3';
        this.text = 'Your opponent reveals their hand. Choose an Energy card you find there and put it on the bottom of your opponent\'s deck.';
    }
    canPlay(store, state, player) {
        const opponent = game_1.StateUtils.getOpponent(state, player);
        if (opponent.hand.cards.length === 0) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                throw new game_error_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.discard);
            // Reveal opponent's hand
            store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => state);
            // Choose Energy card
            const energyCards = opponent.hand.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY);
            if (energyCards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    // Put on bottom of deck
                    opponent.hand.moveCardTo(cards[0], opponent.deck);
                }
            });
        }
        return state;
    }
}
exports.EnergySwatter = EnergySwatter;
