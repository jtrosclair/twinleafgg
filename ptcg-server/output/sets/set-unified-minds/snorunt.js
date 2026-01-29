"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorunt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Snorunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Icicle',
                cost: [W],
                damage: 20,
                text: ''
            }];
        this.set = 'UNM';
        this.name = 'Snorunt';
        this.fullName = 'Snorunt UNM';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
    }
}
exports.Snorunt = Snorunt;
