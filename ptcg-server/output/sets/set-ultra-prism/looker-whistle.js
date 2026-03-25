"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookerWhistle = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LookerWhistle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UPR';
        this.setNumber = '127';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Looker Whistle';
        this.fullName = 'Looker Whistle UPR';
        this.text = 'Search your deck for up to 2 cards named Looker, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    // Ref: set-breakpoint/lapras.ts (Errand-Running - SEARCH_DECK_FOR_CARDS_TO_HAND)
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, this, { superType: card_types_1.SuperType.TRAINER, name: 'Looker' }, { min: 0, max: 2 });
        }
        return state;
    }
}
exports.LookerWhistle = LookerWhistle;
