"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Machop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Punch',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Kick',
                cost: [F, C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'TR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Machop';
        this.fullName = 'Machop TR';
    }
}
exports.Machop = Machop;
