"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsMaintenance = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class BillsMaintenance extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Bill\'s Maintenance';
        this.fullName = 'Bill\'s Maintenance RG';
        this.text = 'If you have any cards in your hand, shuffle 1 of them into your deck, then draw 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.hand.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_SHUFFLE, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.deck, { cards: cards, sourceCard: this });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                (0, prefabs_1.DRAW_CARDS)(player, 3);
            });
            (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
            return state;
        }
        return state;
    }
}
exports.BillsMaintenance = BillsMaintenance;
