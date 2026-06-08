"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phanpy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Phanpy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = F;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mud Slap',
                cost: [F],
                damage: 10,
                text: ''
            },
            {
                name: 'Rollout',
                cost: [C, C, C],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.usSetNumber = 'CRI 44';
        this.name = 'Phanpy';
        this.fullName = 'Phanpy M4';
    }
}
exports.Phanpy = Phanpy;
