"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Seel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rain Splash',
                cost: [W],
                damage: 10,
                text: ''
            },
            {
                name: 'Wave Splash',
                cost: [W, W],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Seel';
        this.fullName = 'Seel M3';
    }
}
exports.Seel = Seel;
