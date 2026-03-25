"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throh = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Throh extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Freestyle Strike',
                cost: [F, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            },
            {
                name: 'Shoulder Throw',
                cost: [F, C, C],
                damage: 80,
                damageCalculation: '-',
                text: 'Does 80 damage minus 20 damage for each Colorless in the Defending Pok\u00e9mon\'s Retreat Cost.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '51';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Throh';
        this.fullName = 'Throh PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkRetreat = new check_effects_1.CheckRetreatCostEffect(opponent);
            store.reduceEffect(state, checkRetreat);
            const retreatCost = checkRetreat.cost.length;
            effect.damage -= 20 * retreatCost;
        }
        return state;
    }
}
exports.Throh = Throh;
