"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxtricity = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Toxtricity extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Toxel';
        this.hp = 130;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Mach Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Toxtricity';
        this.fullName = 'Toxtricity 30C';
    }
}
exports.Toxtricity = Toxtricity;
