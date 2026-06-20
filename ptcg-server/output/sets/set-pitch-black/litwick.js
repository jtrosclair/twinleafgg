"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litwick = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Litwick extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Will-O-Wisp',
                cost: [P],
                damage: 20,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '34';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Litwick';
        this.fullName = 'Litwick M5';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Litwick = Litwick;
