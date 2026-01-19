"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chansey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Rollout',
                cost: [C],
                damage: 10,
                text: '',
            },
            {
                name: 'Double-edge',
                cost: [C, C, C],
                damage: 40,
                text: 'Chansey does 40 damage to itself.',
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Chansey';
        this.fullName = 'Chansey AQ';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 40);
        }
        return state;
    }
}
exports.Chansey = Chansey;
