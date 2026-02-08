"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tepig = void 0;
const game_1 = require("../../game");
class Tepig extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Steady Firebreathing',
                cost: [R],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Tepig';
        this.fullName = 'Tepig MC';
    }
}
exports.Tepig = Tepig;
