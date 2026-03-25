"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mienfoo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Mienfoo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Pound',
                cost: [C],
                damage: 10,
                text: ''
            }, {
                name: 'High Jump Kick',
                cost: [F, F],
                damage: 30,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mienfoo';
        this.fullName = 'Mienfoo NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Mienfoo = Mienfoo;
