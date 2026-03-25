"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pansage = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pansage extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{
                type: R
            }];
        this.resistance = [{
                type: W,
                value: -20
            }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Scratch', cost: [C], damage: 10, text: '' },
            { name: 'Vine Whip', cost: [G, C, C], damage: 30, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Pansage';
        this.fullName = 'Pansage BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
    }
}
exports.Pansage = Pansage;
