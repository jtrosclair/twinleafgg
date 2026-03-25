"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oshawott = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Oshawott extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{
                type: L
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Tackle', cost: [W], damage: 10, text: '' },
            { name: 'Water Gun', cost: [W, C], damage: 20, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Oshawott';
        this.fullName = 'Oshawott BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
    }
}
exports.Oshawott = Oshawott;
