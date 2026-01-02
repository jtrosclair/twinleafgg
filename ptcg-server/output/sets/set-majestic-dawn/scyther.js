"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R, value: +20 }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Slash',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Fury Cutter',
                cost: [G, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip 3 coins. If 1 of them is heads, this attack does 10 damage plus 10 more damage. If 2 of them are heads, this attack does 10 damage plus 20 more damage. If all of them are heads, this attack does 10 damage plus 40 more damage.'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Scyther';
        this.fullName = 'Scyther MD';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, result => {
                const results = result.filter(r => r === true);
                let damageBonus = 0;
                if (results.length === 1) {
                    damageBonus = 10;
                }
                else if (results.length === 2) {
                    damageBonus = 20;
                }
                else if (results.length === 3) {
                    damageBonus = 40;
                }
                prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damageBonus);
            });
        }
        return state;
    }
}
exports.Scyther = Scyther;
