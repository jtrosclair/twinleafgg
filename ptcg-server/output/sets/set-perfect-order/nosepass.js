"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nosepass = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Nosepass extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Avalanche',
                cost: [F, F],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Nosepass';
        this.fullName = 'Nosepass M3';
    }
}
exports.Nosepass = Nosepass;
