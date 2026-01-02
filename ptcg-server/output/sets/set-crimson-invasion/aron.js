"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aron = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Aron extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [M],
                damage: 10,
                text: ''
            },
            {
                name: 'Metal Claw',
                cost: [M, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Aron';
        this.fullName = 'Aron CIN';
    }
}
exports.Aron = Aron;
