"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Zubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Poison Spray',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned.'
            }];
        this.set = 'N3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Zubat';
        this.fullName = 'Zubat N3';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Zubat = Zubat;
