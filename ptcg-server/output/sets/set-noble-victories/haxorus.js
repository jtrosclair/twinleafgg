"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haxorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Haxorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fraxure';
        this.cardType = C;
        this.hp = 140;
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dual Chop',
                cost: [C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
            },
            {
                name: 'Giga Impact',
                cost: [C, C, C],
                damage: 120,
                text: 'This Pokémon can\'t attack during your next turn.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Haxorus';
        this.fullName = 'Haxorus NVI';
    }
    reduceEffect(store, state, effect) {
        // Dual Chop - flip 2 coins, 50x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => { if (r)
                    heads++; });
                effect.damage = 50 * heads;
            });
        }
        // Giga Impact - can't attack next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Giga Impact')) {
                player.active.cannotUseAttacksNextTurnPending.push('Giga Impact');
            }
        }
        return state;
    }
}
exports.Haxorus = Haxorus;
