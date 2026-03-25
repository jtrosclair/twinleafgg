"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndour = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Houndour extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Roar',
                cost: [C],
                damage: 0,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            },
            {
                name: 'Bite',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Houndour';
        this.fullName = 'Houndour DR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.opponent);
        }
        return state;
    }
}
exports.Houndour = Houndour;
