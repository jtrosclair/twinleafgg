"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pansear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Pansear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Flare',
                cost: [R, C],
                damage: 30,
                text: ''
            }];
        this.set = 'NXD';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pansear';
        this.fullName = 'Pansear NXD';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Pansear = Pansear;
