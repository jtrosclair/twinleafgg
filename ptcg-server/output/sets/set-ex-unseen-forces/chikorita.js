"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chikorita = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Chikorita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Headbutt',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Razor Leaf',
                cost: [G, C],
                damage: 20,
                text: ''
            }];
        this.set = 'UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Chikorita';
        this.fullName = 'Chikorita UF';
    }
}
exports.Chikorita = Chikorita;
