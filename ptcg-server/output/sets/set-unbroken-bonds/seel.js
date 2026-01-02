"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seel = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Seel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Horn Attack',
                cost: [C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Seel';
        this.fullName = 'Seel UNB';
    }
}
exports.Seel = Seel;
