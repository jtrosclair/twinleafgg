"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Combee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bug Bite',
                cost: [G],
                damage: 10,
                text: ''
            }];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Combee';
        this.fullName = 'Combee AOR';
    }
}
exports.Combee = Combee;
