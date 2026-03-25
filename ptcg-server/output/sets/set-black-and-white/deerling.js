"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deerling = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Deerling extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Kick',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Leech Seed',
                cost: [G, C],
                damage: 20,
                text: 'Heal 10 damage from this Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Deerling';
        this.fullName = 'Deerling BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 10 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.Deerling = Deerling;
