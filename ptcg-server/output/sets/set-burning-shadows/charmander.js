"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Charmander extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Flame Tail',
                cost: [R, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Charmander';
        this.fullName = 'Charmander BUS';
    }
}
exports.Charmander = Charmander;
