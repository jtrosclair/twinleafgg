"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sharpedo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sharpedo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Carvanha';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Jet Headbutt',
                cost: [W, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Sharpedo';
        this.fullName = 'Sharpedo GRI';
    }
}
exports.Sharpedo = Sharpedo;
