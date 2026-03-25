"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ducklett = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Ducklett extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{
                type: L
            }];
        this.resistance = [{
                type: F,
                value: -20
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Water Gun', cost: [W], damage: 10, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Ducklett';
        this.fullName = 'Ducklett BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
    }
}
exports.Ducklett = Ducklett;
