"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HakamoO = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class HakamoO extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Jangmo-o';
        this.hp = 90;
        this.cardType = card_types_1.CardType.DRAGON;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Sharp Fang',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Dragon Claw',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Hakamo-o';
        this.fullName = 'Hakamo-o 30C';
    }
}
exports.HakamoO = HakamoO;
