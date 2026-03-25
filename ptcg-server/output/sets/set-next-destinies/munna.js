"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Munna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Ram',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NXD';
        this.setNumber = '58';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Munna';
        this.fullName = 'Munna NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Munna = Munna;
