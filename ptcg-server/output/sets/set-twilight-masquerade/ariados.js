"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ariados = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ariados extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spinarak';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Big Net',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your opponent\'s Active Evolution Pokémon\'s Retreat Cost is [C] more.'
            }];
        this.attacks = [{
                name: 'String Bind',
                cost: [G],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            }];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Ariados';
        this.fullName = 'Ariados TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isAriadosInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isAriadosInPlay = true;
                }
            });
            if (!isAriadosInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const targetCard = player.active.getPokemonCard();
            if (targetCard && targetCard.stage !== game_1.Stage.BASIC) {
                effect.cost.push(game_1.CardType.COLORLESS);
                return state;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActiveCard = opponent.active.getPokemonCard();
            if (opponentActiveCard) {
                const retreatCost = opponentActiveCard.retreat.filter(c => c === game_1.CardType.COLORLESS).length;
                effect.damage += retreatCost * 30;
            }
            return state;
        }
        return state;
    }
}
exports.Ariados = Ariados;
