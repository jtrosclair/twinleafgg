"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purrloin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Purrloin extends pokemon_card_1.PokemonCard {
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
            { name: 'Scratch', cost: [C], damage: 10, text: '' },
            { name: 'Slash', cost: [D, C], damage: 20, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Purrloin';
        this.fullName = 'Purrloin BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
    }
}
exports.Purrloin = Purrloin;
