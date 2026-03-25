"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AncientMew = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class AncientMew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 30;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Psyche',
                cost: [P, P],
                damage: 40,
                text: ''
            }];
        this.set = 'UP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'Ancient Mew';
        this.name = 'Ancient Mew';
        this.fullName = 'Ancient Mew UP';
    }
}
exports.AncientMew = AncientMew;
