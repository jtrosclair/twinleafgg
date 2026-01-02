"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pineco = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pineco extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ram',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Pineco';
        this.fullName = 'Pineco UF';
    }
}
exports.Pineco = Pineco;
