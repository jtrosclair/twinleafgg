"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheBosssWay = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class TheBosssWay extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TR';
        this.setNumber = '73';
        this.name = 'The Boss\'s Way';
        this.fullName = 'The Boss\'s Way TR';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Search your deck for an Evolution card with Dark in its name. Show it to your opponent and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            effect.preventDefault = true;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                // eslint-disable-next-line no-empty
                if (card instanceof game_1.PokemonCard && card.evolvesFrom !== '' && card.stage !== card_types_1.Stage.LV_X && card.tags.includes(card_types_1.CardTag.DARK)) {
                    // Valid card
                }
                else {
                    blocked.push(index);
                }
            });
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { blocked, min: 0, max: 1 });
            prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.TheBosssWay = TheBosssWay;
