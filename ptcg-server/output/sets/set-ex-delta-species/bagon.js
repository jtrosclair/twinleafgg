"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bagon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Bagon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            },
        ];
        this.set = 'DS';
        this.name = 'Bagon';
        this.fullName = 'Bagon DS 57';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Bagon = Bagon;
