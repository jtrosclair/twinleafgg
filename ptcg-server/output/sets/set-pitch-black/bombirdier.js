"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bombirdier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class Bombirdier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Delivery Challenge',
                cost: [C, C],
                damage: 0,
                text: 'Flip 2 coins. If both are heads, search your deck for 1 Pokémon and put it onto your Bench. Then, shuffle your deck.',
            },
            {
                name: 'Speed Wing',
                cost: [C, C, C],
                damage: 100,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '69';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bombirdier';
        this.fullName = 'Bombirdier M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                if (results.length === 2 && results[0] && results[1]) {
                    (0, prefabs_2.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, {}, { min: 0, max: 1, allowCancel: false });
                }
            });
        }
        return state;
    }
}
exports.Bombirdier = Bombirdier;
