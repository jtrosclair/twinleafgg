"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basculin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Basculin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flail',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Does 10 damage times the number of damage counters on this Pokémon.'
            },
            {
                name: 'Final Gambit',
                cost: [W, C, C],
                damage: 80,
                text: 'Flip 2 coins. If both of them are tails, this Pokémon does 80 damage to itself.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Basculin';
        this.fullName = 'Basculin EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const damageCounters = Math.floor(player.active.damage / 10);
            effect.damage = 10 * damageCounters;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const allTails = results.every(r => !r);
                if (allTails) {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 80);
                }
            });
        }
        return state;
    }
}
exports.Basculin = Basculin;
