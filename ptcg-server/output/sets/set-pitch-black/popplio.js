"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Popplio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Popplio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Pound',
                cost: [W],
                damage: 20,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '17';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Popplio';
        this.fullName = 'Popplio M5';
    }
}
exports.Popplio = Popplio;
