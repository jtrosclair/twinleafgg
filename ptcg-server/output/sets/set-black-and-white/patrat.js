"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patrat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Patrat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{
                type: F
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Tackle', cost: [C], damage: 10, text: '' },
            { name: 'Bite', cost: [C, C], damage: 20, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Patrat';
        this.fullName = 'Patrat BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
    }
}
exports.Patrat = Patrat;
