"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sneasel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dig Claws',
                cost: [D],
                damage: 10,
                text: ''
            },
            {
                name: 'Scratch',
                cost: [D, D],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel M2';
    }
}
exports.Sneasel = Sneasel;
