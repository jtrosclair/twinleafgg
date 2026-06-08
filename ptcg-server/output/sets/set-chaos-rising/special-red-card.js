"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialRedCard = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_2 = require("../../game");
const card_list_1 = require("../../game/store/state/card-list");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SpecialRedCard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.usSetNumber = 'POR 72';
        this.name = 'Special Red Card';
        this.fullName = 'Special Red Card M4';
        this.text = 'Play this card only if your opponent has 3 or fewer Prize cards remaining. Your opponent shuffles their hand and puts it on the bottom of their deck. If they put any cards on the bottom of their deck in this way, they draw 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizeCount = opponent.prizes.filter(p => p.cards.length > 0).length;
            if (prizeCount > 3) {
                throw new game_2.GameError(game_2.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cardsInHand = opponent.hand.cards.length;
            if (cardsInHand > 0) {
                const deckBottom = new card_list_1.CardList();
                opponent.hand.moveTo(deckBottom);
                deckBottom.moveTo(opponent.deck);
                (0, prefabs_1.DRAW_CARDS)(opponent, Math.min(3, opponent.deck.cards.length));
            }
        }
        return state;
    }
}
exports.SpecialRedCard = SpecialRedCard;
