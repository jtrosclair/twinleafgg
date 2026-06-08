"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skrelp = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Skrelp extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = D;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hook',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.usSetNumber = 'CRI 58';
        this.name = 'Skrelp';
        this.fullName = 'Skrelp M4';
    }
}
exports.Skrelp = Skrelp;
