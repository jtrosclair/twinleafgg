"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sandile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [F, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Sandile';
        this.fullName = 'Sandile EPO';
    }
}
exports.Sandile = Sandile;
