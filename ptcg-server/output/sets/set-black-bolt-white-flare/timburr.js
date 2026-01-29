"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timburr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Timburr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Low Kick',
                cost: [F],
                damage: 10,
                text: ''
            },
            {
                name: 'Strength',
                cost: [F, C, C],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Timburr';
        this.fullName = 'Timburr SV11B';
    }
}
exports.Timburr = Timburr;
