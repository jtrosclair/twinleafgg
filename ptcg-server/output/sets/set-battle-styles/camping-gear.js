"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampingGear = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class CampingGear extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.name = 'Camping Gear';
        this.fullName = 'Camping Gear BST';
        this.regulationMark = 'E';
        this.text = 'Search your deck for a card and put it into your hand. Then, shuffle your deck. Your turn ends.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, player, effect.trainerCard, {}, { min: 0, max: 1 });
            if (effect.player === game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
            }
        }
        return state;
    }
    canPlay(store, state, player) {
        if (player.deck.cards.length === 0) {
            return false;
        }
        return true;
    }
}
exports.CampingGear = CampingGear;
