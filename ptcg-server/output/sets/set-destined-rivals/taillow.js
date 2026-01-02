"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Taillow = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Taillow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.name = 'Taillow';
        this.fullName = 'Taillow DRI';
        this.regulationMark = 'I';
    }
}
exports.Taillow = Taillow;
