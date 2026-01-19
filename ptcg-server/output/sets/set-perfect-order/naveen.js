"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Naveen = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_list_1 = require("../../game/store/state/card-list");
const game_1 = require("../../game");
class Naveen extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Naveen';
        this.fullName = 'Naveen M3';
        this.text = 'Discard any number of cards from your hand. Then, draw cards until you have 5 cards in your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const handTemp = new card_list_1.CardList();
            handTemp.cards = player.hand.cards.filter(c => c !== this);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 0, max: player.hand.cards.length, allowCancel: false }), selected => {
                selected = selected || [];
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: selected });
                (0, prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND)(player, 5);
                (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
            });
            return state;
        }
        return state;
    }
}
exports.Naveen = Naveen;
