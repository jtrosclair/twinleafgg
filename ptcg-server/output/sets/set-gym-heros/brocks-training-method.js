"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrocksTrainingMethod = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class BrocksTrainingMethod extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'G1';
        this.setNumber = '106';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Brock\'s Training Method';
        this.fullName = 'Brock\'s Training Method G1';
        this.text = 'Search your deck for a Basic Pokémon or Evolution card with Brock in its name. Show that card to your opponent, then put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.BROCKS)) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 1, blocked });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.BrocksTrainingMethod = BrocksTrainingMethod;
