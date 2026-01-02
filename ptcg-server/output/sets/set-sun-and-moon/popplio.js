"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popplio = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Popplio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Pound',
                cost: [W],
                damage: 10,
                text: ''
            },
            {
                name: 'Water Gun',
                cost: [W, C],
                damage: 20,
                text: ''
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Popplio';
        this.fullName = 'Popplio SUM';
    }
}
exports.Popplio = Popplio;
