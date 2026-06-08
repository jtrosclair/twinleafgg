"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litleo = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Litleo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.usSetNumber = 'CRI 14';
        this.name = 'Litleo';
        this.fullName = 'Litleo M4';
    }
}
exports.Litleo = Litleo;
