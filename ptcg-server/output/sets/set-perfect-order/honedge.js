"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Honedge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Honedge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Cut',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.usSetNumber = 'POR 56';
        this.name = 'Honedge';
        this.fullName = 'Honedge M3';
    }
}
exports.Honedge = Honedge;
