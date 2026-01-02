"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pignite = void 0;
const game_1 = require("../../game");
class Pignite extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tepig';
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Combustion',
                cost: [R],
                damage: 30,
                text: ''
            }, {
                name: 'Heat Crash',
                cost: [R, R, C],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '12';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pignite';
        this.fullName = 'Pignite SV11W';
    }
}
exports.Pignite = Pignite;
