"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shuppet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Shuppet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Headbutt',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Will-o\'-the-wisp',
                cost: [P, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'LM';
        this.setNumber = '63';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shuppet';
        this.fullName = 'Shuppet LM';
    }
}
exports.Shuppet = Shuppet;
