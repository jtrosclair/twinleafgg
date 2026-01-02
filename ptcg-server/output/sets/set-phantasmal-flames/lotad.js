"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lotad = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Lotad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Headbutt',
                cost: [G, C],
                damage: 30,
                text: '',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Lotad';
        this.fullName = 'Lotad M2';
    }
}
exports.Lotad = Lotad;
