"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elgyem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Elgyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psychic',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Calm Mind',
                cost: [P],
                damage: 0,
                text: 'Heal 30 damage from this Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.name = 'Elgyem';
        this.fullName = 'Elgyem NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
        }
        return state;
    }
}
exports.Elgyem = Elgyem;
