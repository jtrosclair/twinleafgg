"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remoraid = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Remoraid extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = W;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Slice Fin',
                cost: [W],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.usSetNumber = 'POR 16';
        this.name = 'Remoraid';
        this.fullName = 'Remoraid M4';
    }
}
exports.Remoraid = Remoraid;
