"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tangrowth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Tangrowth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tangela';
        this.cardType = G;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Grass Knot',
                cost: [G],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            },
            {
                name: 'Slam',
                cost: [G, C, C],
                damage: 80,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 80 damage for each heads.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Tangrowth';
        this.fullName = 'Tangrowth CEC';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive) {
                const checkRetreatCostEffect = new check_effects_1.CheckRetreatCostEffect(opponent);
                store.reduceEffect(state, checkRetreatCostEffect);
                const retreatCost = checkRetreatCostEffect.cost.length;
                effect.damage += retreatCost * 30;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 80 * heads;
            });
        }
        return state;
    }
}
exports.Tangrowth = Tangrowth;
