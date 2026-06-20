"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nickit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Nickit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Gnaw',
                cost: [D],
                damage: 10,
                text: '',
            },
            {
                name: 'Rear Kick',
                cost: [D, C],
                damage: 30,
                text: '',
            }];
        this.set = 'M5';
        this.setNumber = '51';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nickit';
        this.fullName = 'Nickit M5';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Nickit = Nickit;
