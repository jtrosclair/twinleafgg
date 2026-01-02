"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snover = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Snover extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Beat',
                cost: [W],
                damage: 10,
                text: ''
            },
            {
                name: 'Icy Snow',
                cost: [W, W],
                damage: 30,
                text: ''
            }];
        this.set = 'MEG';
        this.name = 'Snover';
        this.fullName = 'Snover M1S';
        this.setNumber = '35';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Snover = Snover;
