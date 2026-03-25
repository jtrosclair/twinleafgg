"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuinWall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class RuinWall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'N2';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ruin Wall';
        this.fullName = 'Ruin Wall N2';
        this.text = 'Search your deck for a card with Unown in its name and put it onto your Bench. Shuffle your deck afterward. (You can\'t play this card if your Bench is full.)';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            effect.player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && card.name.includes('Unown')) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            return (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, {}, { min: 0, max: 1, blocked });
        }
        return state;
    }
}
exports.RuinWall = RuinWall;
