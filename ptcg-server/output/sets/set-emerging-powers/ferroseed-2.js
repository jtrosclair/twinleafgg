"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ferroseed2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Ferroseed2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Pierce',
                cost: [M, M],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Ferroseed';
        this.fullName = 'Ferroseed EPO 71';
    }
}
exports.Ferroseed2 = Ferroseed2;
