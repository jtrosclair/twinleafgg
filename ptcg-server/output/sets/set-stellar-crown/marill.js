"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Marill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rollout',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.name = 'Marill';
        this.fullName = 'Marill SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
    }
}
exports.Marill = Marill;
