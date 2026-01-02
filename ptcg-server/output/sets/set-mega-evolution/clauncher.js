"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clauncher = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Clauncher extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Wave Splash',
                cost: [W, W],
                damage: 50,
                text: ''
            }];
        this.set = 'MEG';
        this.name = 'Clauncher';
        this.fullName = 'Clauncher M1S';
        this.setNumber = '37';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Clauncher = Clauncher;
