"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axew = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Axew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 40;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Signs of Evolution',
                cost: [F],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for Fraxure, reveal it, and put it into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Scratch',
                cost: [M],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'DRV';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Axew';
        this.fullName = 'Axew DRV';
    }
    reduceEffect(store, state, effect) {
        // Signs of Evolution - flip heads to search for Fraxure
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, player, { name: 'Fraxure' }, { min: 0, max: 1 });
                }
            });
        }
        return state;
    }
}
exports.Axew = Axew;
