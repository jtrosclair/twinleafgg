"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pineco = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pineco extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rollout',
                cost: [G, G],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Pineco';
        this.fullName = 'Pineco PAL';
    }
}
exports.Pineco = Pineco;
