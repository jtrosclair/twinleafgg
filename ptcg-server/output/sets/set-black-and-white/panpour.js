"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panpour = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Panpour extends pokemon_card_1.PokemonCard {
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
            { name: 'Scratch', cost: [C], damage: 10, text: '' },
            { name: 'Water Gun', cost: [W, C, C], damage: 30, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Panpour';
        this.fullName = 'Panpour BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
    }
}
exports.Panpour = Panpour;
