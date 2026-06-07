"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoleDiggingShovel = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HoleDiggingShovel extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.regulationMark = 'I';
        this.set = 'POR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Hole-Digging Shovel';
        this.fullName = 'Hole-Digging Shovel POR';
        this.text = 'Discard the top 2 cards of your deck.';
    }
    canPlay(store, state, player) {
        return player.deck.cards.length > 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            effect.preventDefault = true;
            const count = Math.min(2, player.deck.cards.length);
            (0, prefabs_1.DISCARD_TOP_X_CARDS_FROM_YOUR_DECK)(store, state, player, count, this, this);
        }
        return state;
    }
}
exports.HoleDiggingShovel = HoleDiggingShovel;
