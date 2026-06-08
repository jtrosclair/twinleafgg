"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pumpkaboo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pumpkaboo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Stampede',
                cost: [P],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.usSetNumber = 'POR 40';
        this.name = 'Pumpkaboo';
        this.fullName = 'Pumpkaboo M4';
    }
}
exports.Pumpkaboo = Pumpkaboo;
