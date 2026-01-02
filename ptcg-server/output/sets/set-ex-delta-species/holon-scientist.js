"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonScientist = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HolonScientist extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Holon Scientist';
        this.fullName = 'Holon Scientist DS';
        this.text = 'Discard a card from your hand. If you can\'t discard a card from your hand, you can\'t play this card.\n\nIf you have less cards in your hand than your opponent, draw cards until you have the same number of cards as your opponent.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            let cards = [];
            cards = player.hand.cards.filter(c => c !== effect.trainerCard);
            const hasCardInHand = player.hand.cards.some(c => {
                return c instanceof game_1.Card;
            });
            if (!hasCardInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (cards.length === 1) {
                prefabs_1.MOVE_CARDS(store, state, player.hand, player.discard);
                prefabs_1.DRAW_CARDS(player, opponent.hand.cards.length);
            }
            if (cards.length > 1) {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                    cards = cards || [];
                    if (cards.length === 0) {
                        return;
                    }
                    player.hand.moveCardsTo(cards, player.discard);
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                    });
                    prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, opponent.hand.cards.length);
                });
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            prefabs_1.CLEAN_UP_SUPPORTER(effect, player);
            return state;
        }
        return state;
    }
}
exports.HolonScientist = HolonScientist;
