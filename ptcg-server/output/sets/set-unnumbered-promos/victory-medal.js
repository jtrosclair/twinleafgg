"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictoryMedal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class VictoryMedal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UP';
        this.name = 'Victory Medal';
        this.fullName = 'Victory Medal UP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'Victory Medal';
        this.text = 'Flip 2 coins. If one of them is heads, draw a card. If both are heads, search your deck for any 1 card, put it into your hand, and shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, coinResults => {
                if (coinResults.every(r => r === true)) {
                    (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, {}, { min: 1, max: 1, allowCancel: false });
                    return state;
                }
                else if (coinResults.some(r => r === true)) {
                    (0, prefabs_1.DRAW_CARDS)(player, 1);
                    return state;
                }
                return state;
            });
        }
        return state;
    }
}
exports.VictoryMedal = VictoryMedal;
