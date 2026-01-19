"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greedent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Greedent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skwovet';
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Bite',
                cost: [C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Enhanced Fang',
                cost: [C, C, C],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon has a Pokémon Tool attached, this attack does 80 more damage.'
            }];
        this.set = 'SVI';
        this.name = 'Greedent';
        this.fullName = 'Greedent SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            if (effect.source.tools.length > 0) {
                effect.damage += 80;
            }
        }
        return state;
    }
}
exports.Greedent = Greedent;
