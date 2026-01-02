"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const game_1 = require("../../game");
class Haunter extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hollow Shot',
                cost: [D],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Haunter';
        this.fullName = 'Haunter MBG';
    }
}
exports.Haunter = Haunter;
