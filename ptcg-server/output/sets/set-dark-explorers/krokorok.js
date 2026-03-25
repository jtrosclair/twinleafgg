"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Krokorok = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Krokorok extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sandile';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Mud-Slap',
                cost: [C, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Corkscrew Punch',
                cost: [D, D, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.name = 'Krokorok';
        this.fullName = 'Krokorok DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
    }
    reduceEffect(store, state, effect) {
        // Vanilla attacks with no effects
        return state;
    }
}
exports.Krokorok = Krokorok;
