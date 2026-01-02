"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothita = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Gothita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Super Psy Bolt',
                cost: [P],
                damage: 20,
                text: ''
            }];
        this.set = 'WHT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Gothita';
        this.fullName = 'Gothita WHT';
    }
}
exports.Gothita = Gothita;
