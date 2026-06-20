"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goldeen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Goldeen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Pierce',
                cost: [C, C],
                damage: 30,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '12';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Goldeen';
        this.fullName = 'Goldeen M5';
    }
}
exports.Goldeen = Goldeen;
