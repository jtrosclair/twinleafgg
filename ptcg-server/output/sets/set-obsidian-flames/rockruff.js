"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rockruff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Rockruff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [F],
                damage: 20,
                text: '',
            },
        ];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Rockruff';
        this.fullName = 'Rockruff OBF';
    }
}
exports.Rockruff = Rockruff;
