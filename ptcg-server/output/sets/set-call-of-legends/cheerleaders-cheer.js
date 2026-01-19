"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheerleadersCheer = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CheerleadersCheer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CL';
        this.name = 'Cheerleader\'s Cheer';
        this.fullName = 'Cheerleader\'s Cheer CL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.text = 'Draw 3 cards. Your opponent may draw a card.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            (0, prefabs_1.DRAW_CARDS)(player, 3);
            if (opponent.deck.cards.length > 0) {
                (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, opponent, result => {
                    if (result) {
                        (0, prefabs_1.DRAW_CARDS)(opponent, 1);
                    }
                }, game_1.GameMessage.WANT_TO_DRAW_CARDS);
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.CheerleadersCheer = CheerleadersCheer;
