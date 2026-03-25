"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawniard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pawniard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Pierce',
                cost: [M],
                damage: 10,
                text: ''
            }, {
                name: 'Cut',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pawniard';
        this.fullName = 'Pawniard NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Pawniard = Pawniard;
