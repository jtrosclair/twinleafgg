"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeNull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
/** Type: Null */
class TypeNull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = '';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Power Edge',
                cost: [C, C],
                damage: 40,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '67';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Type: Null';
        this.fullName = 'Type: Null M5';
    }
}
exports.TypeNull = TypeNull;
