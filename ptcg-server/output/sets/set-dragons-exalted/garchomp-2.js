"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garchomp2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Garchomp2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gabite';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: N }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Jet Headbutt',
                cost: [C],
                damage: 40,
                text: ''
            },
            {
                name: 'Sand Tomb',
                cost: [W, F, C],
                damage: 80,
                text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '91';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garchomp';
        this.fullName = 'Garchomp DRX 91';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Sand Tomb - Defending Pokemon can't retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        return state;
    }
}
exports.Garchomp2 = Garchomp2;
