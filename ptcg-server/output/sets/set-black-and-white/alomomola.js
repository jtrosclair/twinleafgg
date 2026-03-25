"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alomomola = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Alomomola extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Pound',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Wave Splash',
                cost: [W, W, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'BLW';
        this.name = 'Alomomola';
        this.fullName = 'Alomomola BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
    }
}
exports.Alomomola = Alomomola;
