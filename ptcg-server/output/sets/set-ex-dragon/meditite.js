"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meditite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meditite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Punch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Meditate',
                cost: [F, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
            }
        ];
        this.set = 'DR';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meditite';
        this.fullName = 'Meditite DR';
    }
    reduceEffect(store, state, effect) {
        // Handle Meditate attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = effect.opponent;
            effect.damage += 1 * opponent.active.damage;
        }
        return state;
    }
}
exports.Meditite = Meditite;
