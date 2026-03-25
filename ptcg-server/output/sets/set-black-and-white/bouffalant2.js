"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouffalant2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bouffalant2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Horn Attack',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Afro Break',
                cost: [C, C, C],
                damage: 60,
                text: 'Bouffalant does 10 damage to itself.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Bouffalant';
        this.fullName = 'Bouffalant BLW 90';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Bouffalant2 = Bouffalant2;
