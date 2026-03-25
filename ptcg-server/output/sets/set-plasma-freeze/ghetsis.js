"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ghetsis = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ghetsis extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Ghetsis';
        this.fullName = 'Ghetsis PLF';
        this.text = 'Your opponent reveals his or her hand and shuffles all Item cards found there into his or her deck. Then, draw a number of cards equal to the number of Item cards your opponent shuffled into his or her deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Create a temporary copy of the opponent's hand to show
            const opponentHandSnapshot = [...opponent.hand.cards];
            (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, opponentHandSnapshot);
            // Find Item cards in the opponent's hand
            const itemsShown = opponent.hand.cards.filter(card => card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.ITEM);
            // Move Item cards to deck and shuffle
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { cards: itemsShown });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
            // Draw cards equal to the number of Item cards shuffled
            (0, prefabs_1.DRAW_CARDS)(player, itemsShown.length);
            return state;
        }
        return state;
    }
}
exports.Ghetsis = Ghetsis;
