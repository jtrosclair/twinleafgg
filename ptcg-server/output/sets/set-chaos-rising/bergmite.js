"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bergmite = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Bergmite extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 80;
        this.cardType = W;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Chilly',
                cost: [W],
                damage: 10,
                text: ''
            },
            {
                name: 'Frost Breath',
                cost: [W, C, C],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.usSetNumber = 'POR 23';
        this.name = 'Bergmite';
        this.fullName = 'Bergmite M4';
    }
}
exports.Bergmite = Bergmite;
