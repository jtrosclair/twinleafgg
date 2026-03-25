"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Totodile = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Totodile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gnaw',
                cost: [W],
                damage: 10,
                text: ''
            },
            {
                name: 'Wave Splash',
                cost: [W, C],
                damage: 20,
                text: ''
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Totodile';
        this.fullName = 'Totodile HS';
    }
}
exports.Totodile = Totodile;
