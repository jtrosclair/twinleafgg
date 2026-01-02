"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sliggoo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sliggoo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = N;
        this.hp = 80;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C];
        this.evolvesFrom = 'Goomy';
        this.attacks = [
            {
                name: 'Absorb',
                cost: [W, C],
                damage: 30,
                text: 'Heal 30 damage from this Pokémon.'
            },
            {
                name: 'Hammer In',
                cost: [W, Y, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Sliggoo';
        this.fullName = 'Sliggoo FLI';
    }
    reduceEffect(store, state, effect) {
        // Absorb
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
        return state;
    }
}
exports.Sliggoo = Sliggoo;
