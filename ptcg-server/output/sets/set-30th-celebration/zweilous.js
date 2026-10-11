"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zweilous = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Zweilous extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Deino';
        this.hp = 100;
        this.cardType = card_types_1.CardType.DARK;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Clamp',
                cost: [card_types_1.CardType.DARK],
                damage: 20,
                text: ''
            },
            {
                name: 'Skull Bash',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Zweilous';
        this.fullName = 'Zweilous 30C';
    }
}
exports.Zweilous = Zweilous;
