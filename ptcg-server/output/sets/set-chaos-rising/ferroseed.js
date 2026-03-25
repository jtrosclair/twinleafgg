"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ferroseed = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Ferroseed extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = M;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rolling Tackle',
                cost: [M, M],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Ferroseed';
        this.fullName = 'Ferroseed M4';
    }
}
exports.Ferroseed = Ferroseed;
