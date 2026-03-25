"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panpour = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Panpour extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Water Gun',
                cost: [W, C],
                damage: 30,
                text: ''
            }];
        this.set = 'NXD';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Panpour';
        this.fullName = 'Panpour NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Panpour = Panpour;
