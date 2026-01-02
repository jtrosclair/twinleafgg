"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nincada = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Nincada extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 20,
                text: ''
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Nincada';
        this.fullName = 'Nincada M1S';
        this.regulationMark = 'I';
    }
}
exports.Nincada = Nincada;
