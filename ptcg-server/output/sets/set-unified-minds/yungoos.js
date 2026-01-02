"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yungoos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Yungoos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Cavernous Chomp',
                cost: [C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '180';
        this.name = 'Yungoos';
        this.fullName = 'Yungoos UNM';
    }
}
exports.Yungoos = Yungoos;
