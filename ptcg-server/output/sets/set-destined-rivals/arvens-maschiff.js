"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvensMaschiff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class ArvensMaschiff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.tags = [card_types_1.CardTag.ARVENS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Stampede',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Confront',
                cost: [C, C, C],
                damage: 50,
                text: ''
            },
        ];
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.name = 'Arven\'s Maschiff';
        this.fullName = 'Arven\'s Maschiff DRI';
    }
}
exports.ArvensMaschiff = ArvensMaschiff;
