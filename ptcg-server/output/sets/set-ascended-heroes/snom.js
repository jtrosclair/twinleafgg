"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Snom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Icicle',
                cost: [W],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Snom';
        this.fullName = 'Snom M2a';
    }
}
exports.Snom = Snom;
