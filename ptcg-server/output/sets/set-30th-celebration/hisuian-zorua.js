"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianZorua = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class HisuianZorua extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.name = 'Hisuian Zorua';
        this.fullName = 'Hisuian Zorua 30C';
    }
}
exports.HisuianZorua = HisuianZorua;
