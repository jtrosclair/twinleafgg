"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Squirtle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Squirtle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Shell Attack',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Squirtle';
        this.fullName = 'Squirtle TR';
    }
}
exports.Squirtle = Squirtle;
