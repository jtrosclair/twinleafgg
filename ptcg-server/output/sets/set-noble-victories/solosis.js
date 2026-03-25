"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solosis = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Solosis extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 30;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rollout',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Solosis';
        this.fullName = 'Solosis NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Solosis = Solosis;
