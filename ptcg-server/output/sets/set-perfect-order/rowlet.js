"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rowlet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rowlet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Find a Friend',
                cost: [G],
                damage: 0,
                text: 'Search your deck for a Pokemon, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Tackle',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Rowlet';
        this.fullName = 'Rowlet M3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, {}, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.Rowlet = Rowlet;
