"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Foongus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Foongus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rollout',
                cost: [G],
                damage: 20,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Foongus';
        this.fullName = 'Foongus NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Foongus = Foongus;
