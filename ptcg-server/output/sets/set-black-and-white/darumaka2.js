"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darumaka2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Darumaka2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Singe',
                cost: [R],
                damage: 0,
                text: 'The Defending Pokémon is now Burned.'
            },
            {
                name: 'Rollout',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Darumaka';
        this.fullName = 'Darumaka BLW 24';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Darumaka2 = Darumaka2;
