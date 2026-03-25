"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Woobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Woobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{
                type: L
            }];
        this.resistance = [{
                type: F,
                value: -20
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Gust', cost: [C], damage: 10, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Woobat';
        this.fullName = 'Woobat BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
    }
}
exports.Woobat = Woobat;
