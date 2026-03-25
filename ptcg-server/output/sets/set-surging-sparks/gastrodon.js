"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gastrodon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gastrodon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shellos';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Sticky Bind',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, Benched Stage 2 Pokémon (both yours and your opponent\'s) have no Abilities.'
            }];
        this.attacks = [{
                name: 'Mud Shot',
                cost: [F, C, C],
                damage: 80,
                text: ''
            }];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Gastrodon';
        this.fullName = 'Gastrodon SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if Gastrodon is on the Bench
            const isGastrodonOnPlayerBench = player.bench.some(benchPokemon => benchPokemon.getPokemonCard() === this);
            const isGastrodonOnOpponentBench = opponent.bench.some(benchPokemon => benchPokemon.getPokemonCard() === this);
            if (isGastrodonOnPlayerBench || isGastrodonOnOpponentBench) {
                const targetPokemon = effect.target;
                const targetCardList = game_1.StateUtils.findCardList(state, targetPokemon);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (cardList === targetCardList && card.stage === card_types_1.Stage.STAGE_2 && cardList !== player.active) {
                        // Check if Gastrodon's ability is blocked
                        const gastrodonPlayer = isGastrodonOnPlayerBench ? player : opponent;
                        if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, gastrodonPlayer, this)) {
                            // Filter out all abilities
                            effect.powers = effect.powers.filter(power => power.powerType !== pokemon_types_1.PowerType.ABILITY);
                        }
                    }
                });
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                    if (cardList === targetCardList && card.stage === card_types_1.Stage.STAGE_2 && cardList !== opponent.active) {
                        // Check if Gastrodon's ability is blocked
                        const gastrodonPlayer = isGastrodonOnPlayerBench ? player : opponent;
                        if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, gastrodonPlayer, this)) {
                            // Filter out all abilities
                            effect.powers = effect.powers.filter(power => power.powerType !== pokemon_types_1.PowerType.ABILITY);
                        }
                    }
                });
            }
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.ABILITY) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // We are not blocking the Abilities from Non-Stage 2 Pokemon
            if (effect.card.stage !== card_types_1.Stage.STAGE_2) {
                return state;
            }
            // Check if Gastrodon is on the Bench
            const isGastrodonOnPlayerBench = player.bench.some(benchPokemon => benchPokemon.getPokemonCard() === this);
            const isGastrodonOnOpponentBench = opponent.bench.some(benchPokemon => benchPokemon.getPokemonCard() === this);
            if (!isGastrodonOnPlayerBench && !isGastrodonOnOpponentBench) {
                return state;
            }
            const gastrodonPlayer = isGastrodonOnPlayerBench ? player : opponent;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, gastrodonPlayer, this)) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.Gastrodon = Gastrodon;
