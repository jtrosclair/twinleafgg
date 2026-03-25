"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tirtouga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Tirtouga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.RESTORED;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Water Gun',
                cost: [W, C],
                damage: 30,
                text: ''
            }, {
                name: 'Surf',
                cost: [W, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'NVI';
        this.setNumber = '25';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tirtouga';
        this.fullName = 'Tirtouga NVI';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Tirtouga = Tirtouga;
