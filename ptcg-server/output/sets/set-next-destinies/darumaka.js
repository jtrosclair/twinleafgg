"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darumaka = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Darumaka extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Hammer In',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'NXD';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Darumaka';
        this.fullName = 'Darumaka NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Darumaka = Darumaka;
