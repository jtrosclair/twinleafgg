"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skarmory = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skarmory extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Metal Arms',
                cost: [M],
                damage: 10,
                damageCalculation: '+',
                text: 'If this Pokémon has a Pokémon Tool attached, this attack does 40 more damage.'
            },
            {
                name: 'Cutting Wind',
                cost: [M, C, C],
                damage: 80,
                text: ''
            }];
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Skarmory';
        this.fullName = 'Skarmory DAA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.active.tools.length > 0) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Skarmory = Skarmory;
