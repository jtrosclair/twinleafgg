"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wurmple = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Wurmple extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bug Bite',
                cost: [G],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Wurmple';
        this.fullName = 'Wurmple M2a';
    }
}
exports.Wurmple = Wurmple;
