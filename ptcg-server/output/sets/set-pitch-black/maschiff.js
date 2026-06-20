"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maschiff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Maschiff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Bite',
                cost: [D, D],
                damage: 40,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '55';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Maschiff';
        this.fullName = 'Maschiff M5';
    }
}
exports.Maschiff = Maschiff;
