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
        this.hp = 60;
        this.weakness = [{
                type: P
            }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Pound', cost: [F], damage: 10, text: '' }
        ];
        this.set = 'BLW';
        this.name = 'Timburr';
        this.fullName = 'Timburr BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
    }
}
exports.Timburr = Timburr;
