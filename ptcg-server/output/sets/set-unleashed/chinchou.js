"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chinchou = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Chinchou extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ram',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Lightning Ball',
                cost: [L, C],
                damage: 20,
                text: ''
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Chinchou';
        this.fullName = 'Chinchou UL';
    }
}
exports.Chinchou = Chinchou;
