"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Joltik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flop',
                cost: [L],
                damage: 10,
                text: ''
            }];
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Joltik';
        this.fullName = 'Joltik SSH';
    }
}
exports.Joltik = Joltik;
