"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ducklett = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Ducklett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Water Pulse',
                cost: [W, C],
                damage: 20,
                text: 'The Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ducklett';
        this.fullName = 'Ducklett DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Ducklett = Ducklett;
