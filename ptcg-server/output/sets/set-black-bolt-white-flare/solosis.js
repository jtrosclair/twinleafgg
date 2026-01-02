"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solosis = void 0;
const game_1 = require("../../game");
class Solosis extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rollout',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Solosis';
        this.fullName = 'Solosis SV11B';
    }
}
exports.Solosis = Solosis;
