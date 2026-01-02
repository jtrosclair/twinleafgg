"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sceptileex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Sceptileex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Grovyle';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: G }, { type: R }];
        this.resistance = [{ type: W, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Extra Liquid',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'Each player\'s Pokémon-ex can\'t use any Poké-Powers and pays [C] more Energy to use its attacks. Each Pokémon can\'t be affected by more than 1 Extra Liquid Poké-Body.'
            }];
        this.attacks = [{
                name: 'Power Revenge',
                cost: [P, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Does 60 damage plus 10 more damage for each Prize card your opponent has taken.'
            }];
        this.set = 'CG';
        this.name = 'Sceptile ex';
        this.fullName = 'Sceptile ex CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Extra Liquid
        // Power blocker
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.POKEPOWER) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let playerHasExtraLiquid = false;
            let opponentHasExtraLiquid = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    playerHasExtraLiquid = true;
                }
            });
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    opponentHasExtraLiquid = true;
                }
            });
            if (!playerHasExtraLiquid && !opponentHasExtraLiquid) {
                return state;
            }
            // Try reducing ability for each player  
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (effect.card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Increase attack cost
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            let playerHasExtraLiquid = false;
            let opponentHasExtraLiquid = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    playerHasExtraLiquid = true;
                }
            });
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    opponentHasExtraLiquid = true;
                }
            });
            if (!playerHasExtraLiquid && !opponentHasExtraLiquid) {
                return state;
            }
            // Check if ex is in the active position
            if ((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index > -1) {
                    effect.cost.splice(index, 0, card_types_1.CardType.COLORLESS);
                }
                else {
                    effect.cost.push(card_types_1.CardType.COLORLESS);
                }
                return state;
            }
        }
        // Offensive Bomb
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 10;
            effect.damage += (prizesTaken * damagePerPrize);
        }
        return state;
    }
}
exports.Sceptileex = Sceptileex;
