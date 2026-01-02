"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dratini = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Dratini extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 80;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Headbutt',
                cost: [W, L],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Dratini';
        this.fullName = 'Dratini M2a';
    }
}
exports.Dratini = Dratini;
