"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allister = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class Allister extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.regulationMark = 'D';
        this.name = 'Allister';
        this.fullName = 'Allister VIV';
        this.text = 'Draw 3 cards. If you drew any cards in this way, discard up to 3 cards from your hand. (You must discard at least 1 card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const initialDeckSize = player.deck.cards.length;
            (0, prefabs_1.DRAW_CARDS)(player, 3);
            // Check if any cards were actually drawn
            const cardsDrawn = initialDeckSize - player.deck.cards.length;
            if (cardsDrawn > 0) {
                (0, trainer_prefabs_1.DISCARD_X_CARDS_FROM_YOUR_HAND)(effect, store, state, 1, 3);
            }
            (0, prefabs_1.CLEAN_UP_SUPPORTER)(effect, player);
        }
        return state;
    }
}
exports.Allister = Allister;
