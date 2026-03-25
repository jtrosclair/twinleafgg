"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Steenee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Steenee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bounsweet';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Double Slap',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage for each heads.'
            },
            {
                name: 'Leaf Step',
                cost: [G, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '18';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steenee';
        this.fullName = 'Steenee UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Double Slap
        // Ref: AGENTS-patterns.md (multiple coin flips)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
        }
        return state;
    }
}
exports.Steenee = Steenee;
