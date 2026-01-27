"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clefable = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_1 = require("../../game");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Clefable extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Clefairy';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Follow Me',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
            }, {
                name: 'More Moon',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 50,
                text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Clefable';
        this.fullName = 'Clefable MEW';
        this.usedMoreMoon = false;
    }
    reduceEffect(store, state, effect) {
        // Track when Follow Me attack is used (reset More Moon flag)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedMoreMoon = false;
        }
        // Track when More Moon attack is used
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedMoreMoon = true;
        }
        // Follow Me - Switch opponent's benched Pokémon to active
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if opponent has any benched Pokémon
            if (opponent.bench.length === 0) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                opponent.active.clearEffects();
                opponent.switchPokemon(targets[0]);
                return state;
            });
        }
        // More Moon - Take 1 more prize if KO
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Only activate during attack phase on opponent's turn
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Check if Clefable was the attacking Pokémon
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if More Moon attack was used
            if (this.usedMoreMoon === true) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 1;
                    this.usedMoreMoon = false;
                }
            }
            return state;
        }
        return state;
    }
}
exports.Clefable = Clefable;
