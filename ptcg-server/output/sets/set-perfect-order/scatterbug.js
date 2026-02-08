"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scatterbug = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Scatterbug extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gnaw',
                cost: [G],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Scatterbug';
        this.fullName = 'Scatterbug M3';
    }
}
exports.Scatterbug = Scatterbug;
