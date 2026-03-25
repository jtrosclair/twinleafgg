"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothita2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Gothita2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Smack',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Gothita';
        this.fullName = 'Gothita EPO 44';
    }
}
exports.Gothita2 = Gothita2;
