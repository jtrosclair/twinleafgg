"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wimpod = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Wimpod extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.cardType = W;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Gnaw',
                cost: [W],
                damage: 10,
                text: ''
            },
            {
                name: 'Corkscrew Punch',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.usSetNumber = 'POR 25';
        this.name = 'Wimpod';
        this.fullName = 'Wimpod M4';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Wimpod = Wimpod;
