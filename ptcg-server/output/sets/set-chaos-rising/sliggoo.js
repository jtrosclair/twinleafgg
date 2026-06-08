"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sliggoo = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Sliggoo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Goomy';
        this.hp = 90;
        this.cardType = N;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Gentle Slap',
                cost: [W, P],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.usSetNumber = 'POR 65';
        this.name = 'Sliggoo';
        this.fullName = 'Sliggoo M4';
    }
}
exports.Sliggoo = Sliggoo;
