"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafeonVMAX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LeafeonVMAX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VMAX;
        this.evolvesFrom = 'Leafeon V';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 310;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_VMAX];
        this.attacks = [
            {
                name: 'Grass Knot',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: 'x',
                text: 'This attack does 60 damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            },
            {
                name: 'Max Leaf',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 170,
                text: 'Heal 30 damage from this Pokémon.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Leafeon VMAX';
        this.fullName = 'Leafeon VMAX EVS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkRetreatCostEffect = new check_effects_1.CheckRetreatCostEffect(opponent);
            store.reduceEffect(state, checkRetreatCostEffect);
            const retreatCost = checkRetreatCostEffect.cost.length;
            effect.damage = retreatCost * 60;
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
            return state;
        }
        return state;
    }
}
exports.LeafeonVMAX = LeafeonVMAX;
