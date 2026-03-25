"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraggy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Scraggy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{
                type: F
            }];
        this.resistance = [{
                type: P,
                value: -20
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Headbutt', cost: [C, C], damage: 20, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Scraggy';
        this.fullName = 'Scraggy BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
    }
}
exports.Scraggy = Scraggy;
