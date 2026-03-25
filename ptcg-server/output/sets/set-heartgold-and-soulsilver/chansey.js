"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chansey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Pound',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Happy Punch',
                cost: [C, C, C],
                damage: 30,
                text: 'Flip a coin. If heads, remove 3 damage counters from Chansey.'
            }];
        this.set = 'HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Chansey';
        this.fullName = 'Chansey HS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
                }
            });
        }
        return state;
    }
}
exports.Chansey = Chansey;
