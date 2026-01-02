"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tepig = void 0;
const game_1 = require("../../game");
class Tepig extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [R],
                damage: 10,
                text: ''
            }, {
                name: 'Rollout',
                cost: [R, R],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'WHT';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tepig';
        this.fullName = 'Tepig SV11W';
    }
}
exports.Tepig = Tepig;
