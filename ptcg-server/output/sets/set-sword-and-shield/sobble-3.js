"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sobble3 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sobble3 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Water Gun',
                cost: [W],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SSH';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sobble';
        this.fullName = 'Sobble SSH 54';
    }
}
exports.Sobble3 = Sobble3;
