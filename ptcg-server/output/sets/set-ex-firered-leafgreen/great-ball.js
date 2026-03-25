"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreatBall = void 0;
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class GreatBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Great Ball';
        this.fullName = 'Great Ball RG';
        this.text = 'Search your deck for a Basic Pokémon (excluding Pokémon-ex) and put it onto your Bench. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if ((0, trainer_prefabs_1.WAS_TRAINER_USED)(effect, this)) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard && c.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked.push(index);
                }
            });
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, blocked });
            return state;
        }
        return state;
    }
}
exports.GreatBall = GreatBall;
