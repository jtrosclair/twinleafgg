"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sigilyph2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sigilyph2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Quick Turn',
                cost: [P],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Psychic Assault',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 10 more damage for each damage counter on the Defending Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Sigilyph';
        this.fullName = 'Sigilyph EPO 42';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 10 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damageCounters = Math.floor(opponent.active.damage / 10);
            effect.damage += 10 * damageCounters;
        }
        return state;
    }
}
exports.Sigilyph2 = Sigilyph2;
