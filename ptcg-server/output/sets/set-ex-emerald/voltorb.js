"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voltorb = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Voltorb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ram',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Speed Ball',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'EM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Voltorb';
        this.fullName = 'Voltorb EM';
    }
}
exports.Voltorb = Voltorb;
