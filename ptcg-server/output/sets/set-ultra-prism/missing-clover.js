"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingClover = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class MissingClover extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UPR';
        this.setNumber = '129';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Missing Clover';
        this.fullName = 'Missing Clover UPR';
        this.text = 'You may play 4 Missing Clover cards at once.\n\u2022 If you played 1 card, look at the top card of your deck.\n\u2022 If you played 4 cards, take a Prize card. (This effect works one time for 4 cards.)';
    }
    // TODO: Missing Clover requires playing 4 cards at once, which is not supported by the current trainer card play system.
    // The engine plays one Item card at a time. Implementing "play 4 at once" would require custom UI support.
    // For now, implement the single-card effect: look at the top card of your deck.
    // Ref: set-crimson-invasion/peeking-red-card.ts (ShowCardsPrompt pattern)
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            // Single card: look at the top card of your deck
            if (player.deck.cards.length > 0) {
                const topCard = [player.deck.cards[0]];
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, topCard), () => { });
            }
        }
        return state;
    }
}
exports.MissingClover = MissingClover;
