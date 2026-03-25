"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Galvantula = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Galvantula extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Joltik';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Quick Turn',
                cost: [L],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            },
            {
                name: 'Electrisilk',
                cost: [L, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If the Defending Pokémon has no Retreat Cost, this attack does 40 more damage.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Galvantula';
        this.fullName = 'Galvantula DEX';
    }
    reduceEffect(store, state, effect) {
        // Quick Turn - flip 2 coins, 20x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        // Electrisilk - +40 if defending has no retreat cost
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defending = opponent.active.getPokemonCard();
            if (defending && defending.retreat.length === 0) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Galvantula = Galvantula;
