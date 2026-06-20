"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mankey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Mankey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Low Kick',
                cost: [C],
                damage: 20,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '40';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mankey';
        this.fullName = 'Mankey M5';
    }
}
exports.Mankey = Mankey;
