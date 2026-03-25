"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drilbur2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Drilbur2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mud-Slap',
                cost: [F, F, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Drilbur';
        this.fullName = 'Drilbur EPO 55';
    }
}
exports.Drilbur2 = Drilbur2;
