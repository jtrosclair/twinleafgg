"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wailmer = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Wailmer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Water Gun',
                cost: [W, W],
                damage: 40,
                text: '',
            },
            {
                name: 'Wave Splash',
                cost: [W, W, W],
                damage: 80,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '14';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wailmer';
        this.fullName = 'Wailmer M5';
    }
}
exports.Wailmer = Wailmer;
