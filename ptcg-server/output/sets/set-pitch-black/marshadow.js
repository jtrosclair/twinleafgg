"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marshadow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Marshadow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Shadow Knot',
                cost: [P],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage times the number of [C] in your opponent\'s Active Pokémon\'s Retreat Cost.',
            }];
        this.set = 'M5';
        this.setNumber = '38';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Marshadow';
        this.fullName = 'Marshadow M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-unbroken-bonds/krookodile.ts (Chomp Chomp Panic)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkRetreat = new check_effects_1.CheckRetreatCostEffect(opponent);
            store.reduceEffect(state, checkRetreat);
            const colorlessCount = checkRetreat.cost.filter(c => c === card_types_1.CardType.COLORLESS).length;
            effect.damage = 30 * colorlessCount;
        }
        return state;
    }
}
exports.Marshadow = Marshadow;
