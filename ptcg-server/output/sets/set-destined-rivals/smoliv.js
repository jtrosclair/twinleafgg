"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Smoliv = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Smoliv extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Ram',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '21';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Smoliv';
        this.fullName = 'Smoliv DRI';
    }
}
exports.Smoliv = Smoliv;
