"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayleef = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Bayleef extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chikorita';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Hammer In',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Razor Leaf',
                cost: [G, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.name = 'Bayleef';
        this.fullName = 'Bayleef HS';
    }
}
exports.Bayleef = Bayleef;
