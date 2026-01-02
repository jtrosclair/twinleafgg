"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik = void 0;
const game_1 = require("../../game");
class Joltik extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bug Bite',
                cost: [L],
                damage: 20,
                text: ''
            }];
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Joltik';
        this.fullName = 'Joltik VIV';
    }
}
exports.Joltik = Joltik;
