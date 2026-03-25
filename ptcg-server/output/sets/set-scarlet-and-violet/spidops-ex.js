"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spidopsex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spidopsex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = game_1.Stage.STAGE_1;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = game_1.CardType.GRASS;
        this.hp = 260;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.evolvesFrom = 'Tarountula';
        this.powers = [{
                name: 'Trap Territory',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your opponent\'s Active Pokémon\'s Retreat Cost is [C] more.'
            }];
        this.attacks = [{
                name: 'Wire Hang',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
            }];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Spidops ex';
        this.fullName = 'Spidops ex SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSpidopsexInPlay = false;
            /*player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
              if (card === this) {
                isSpidopsexInPlay = true;
              }
            });*/
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpidopsexInPlay = true;
                }
            });
            if (!isSpidopsexInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const pokemonCard = opponent.active.getPokemonCard();
            /*opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => {
              // Add 1 more Colorless energy to the opponent's Active Pokemon's retreat cost
              effect.cost.push(CardType.COLORLESS);
            });*/
            if (pokemonCard) {
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
exports.Spidopsex = Spidopsex;
// if (effect instanceof CheckRetreatCostEffect) {
//   const player = effect.player;
//   const opponent = StateUtils.getOpponent(state, player);
//   let playerSpidopsExCount = 0;
//   let opponentSpidopsExCount = 0;
//   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
//     if (card === this) {
//       playerSpidopsExCount++;
//     }
//   });
//   opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
//     if (card === this) {
//       opponentSpidopsExCount++;
//     }
//   });
//   // Try to reduce PowerEffect, to check if something is blocking our ability
//   try {
//     const stub = new PowerEffect(player, {
//   name: 'test',
//   powerType: PowerType.ABILITY,
//   text: ''
// }, this);
// store.reduceEffect(state, stub);
//     store.reduceEffect(state, powerEffect);
//   } catch {
//     return state;
//   }
//   // Add Colorless energy to the opponent's Active Pokemon's retreat cost
//   if (player.active === this) {
//     for (let i = 0; i < playerSpidopsExCount; i++) {
//       effect.cost.push(CardType.COLORLESS);
//     }
//   } else {
//     for (let i = 0; i < opponentSpidopsExCount; i++) {
//       effect.cost.push(CardType.COLORLESS);
//     }
//   }
// }
// return state;
