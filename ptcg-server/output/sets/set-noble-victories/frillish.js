"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frillish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Frillish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rain Splash',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Frillish';
        this.fullName = 'Frillish NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Frillish = Frillish;
