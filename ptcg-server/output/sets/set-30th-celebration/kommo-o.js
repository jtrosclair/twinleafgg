"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KommoO = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class KommoO extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Hakamo-o';
        this.hp = 180;
        this.cardType = card_types_1.CardType.DRAGON;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Blazing Uppercut',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Kommo-o';
        this.fullName = 'Kommo-o 30C';
    }
}
exports.KommoO = KommoO;
