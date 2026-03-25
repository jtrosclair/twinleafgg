"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraggy2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Scraggy2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Headbutt',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Bite',
                cost: [D, C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Scraggy';
        this.fullName = 'Scraggy BLW 69';
    }
    reduceEffect(store, state, effect) {
        // Both attacks are basic damage attacks with no special effects
        return state;
    }
}
exports.Scraggy2 = Scraggy2;
