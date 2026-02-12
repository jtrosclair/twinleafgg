"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grimer = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Grimer extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Pound',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Grimer';
        this.fullName = 'Grimer TEU';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Grimer = Grimer;
