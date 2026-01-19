"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goomy2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Goomy2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 50;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rain Splash',
                cost: [W],
                damage: 10,
                text: ''
            },
            {
                name: 'Flail',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'FLI';
        this.name = 'Goomy';
        this.fullName = 'Goomy FLI 92';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
    }
    reduceEffect(store, state, effect) {
        // Flail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.damage = effect.source.damage;
        }
        return state;
    }
}
exports.Goomy2 = Goomy2;
