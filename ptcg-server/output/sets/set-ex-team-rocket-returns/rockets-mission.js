"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsMission = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RocketsMission extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Rocket\'s Mission';
        this.fullName = 'Rocket\'s Mission TRR';
        this.text = 'Discard a card from your hand. Then, draw 3 cards. If you discarded a Pokémon that has Dark or Rocket\'s in its name, draw 4 cards instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
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
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            if (cards.length == 1) {
                player.hand.moveCardsTo(player.hand.cards, player.discard);
                let cardsToDraw = 3;
                if (cards[0] instanceof game_1.PokemonCard && (cards[0].tags.includes(card_types_1.CardTag.ROCKETS) || cards[0].tags.includes(card_types_1.CardTag.DARK))) {
                    cardsToDraw = 4;
                }
                (0, prefabs_1.DRAW_CARDS)(player, cardsToDraw);
                return state;
            }
            if (cards.length > 1) {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                    cards = cards || [];
                    if (cards.length === 0) {
                        return;
                    }
                    let cardsToDraw = 3;
                    if (cards[0] instanceof game_1.PokemonCard && (cards[0].tags.includes(card_types_1.CardTag.ROCKETS) || cards[0].tags.includes(card_types_1.CardTag.DARK))) {
                        cardsToDraw = 4;
                    }
                    player.hand.moveCardsTo(cards, player.discard);
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                    });
                    (0, prefabs_1.DRAW_CARDS)(player, cardsToDraw);
                });
            }
            return state;
        }
        return state;
    }
}
exports.RocketsMission = RocketsMission;
