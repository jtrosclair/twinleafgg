"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Deino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Headbutt',
                cost: [C],
                damage: 10,
                text: ''
            }, {
                name: 'Bite',
                cost: [D, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Deino';
        this.fullName = 'Deino NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Deino = Deino;
