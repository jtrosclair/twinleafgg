"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonAdventurer = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HolonAdventurer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Holon Adventurer';
        this.fullName = 'Holon Adventurer HP';
        this.text = `Discard a card from your hand. If you can't discard a card from your hand, you can't play this card.
  
  Draw 3 cards. If you discarded a Pokémon that has δ on its card, draw 4 cards instead.`;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.hand.cards.filter(c => c !== effect.trainerCard).length < 1 || player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
                    return;
                }
                let cardsToDraw = 3;
                if (cards[0] instanceof game_1.PokemonCard && cards[0].tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    cardsToDraw = 4;
                }
                (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: cards, sourceCard: this });
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                });
                (0, prefabs_1.DRAW_CARDS)(player, cardsToDraw);
            });
            (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
            return state;
        }
        return state;
    }
}
exports.HolonAdventurer = HolonAdventurer;
