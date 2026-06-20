"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primeape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Primeape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mankey';
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Corkscrew Punch',
                cost: [C, C],
                damage: 50,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '41';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Primeape';
        this.fullName = 'Primeape M5';
    }
}
exports.Primeape = Primeape;
