"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roserade2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Roserade2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Roselia';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Crosswise Whip',
                cost: [G],
                damage: 0,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Poison Point',
                cost: [G, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Poisoned.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Roserade';
        this.fullName = 'Roserade DRX 14';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-dragons-exalted/ambipom.ts (multiple coin flips for damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 4, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
        }
        // Ref: set-dragons-exalted/skuntank.ts (apply Poison to opponent's Active)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Roserade2 = Roserade2;
