"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shiftry = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
class Shiftry extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nuzleaf';
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Giant Fan',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may flip a coin. If heads, choose 1 of your opponent\'s Pokémon. Your opponent shuffles that Pokémon and all cards attached to it into his or her deck.'
            }];
        this.attacks = [{
                name: 'Whirlwind',
                cost: [D, D, C],
                damage: 60,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            }];
        this.set = 'NXD';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shiftry';
        this.fullName = 'Shiftry NXD';
        this.usedWhirlwind = false;
    }
    reduceEffect(store, state, effect) {
        // Giant Fan - when evolved, may shuffle opponent's Pokémon into deck
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            // Prompt player to use ability
            state = store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    // Flip a coin
                    (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                        if (result) {
                            const opponent = game_1.StateUtils.getOpponent(state, player);
                            // Choose any of opponent's Pokémon
                            store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                                if (targets && targets.length > 0) {
                                    const targetPokemon = targets[0];
                                    // Shuffle all cards (Pokémon + attached cards) into deck
                                    const cardsToShuffle = targetPokemon.cards.slice();
                                    targetPokemon.clearEffects();
                                    targetPokemon.cards = [];
                                    (0, prefabs_1.SHUFFLE_CARDS_INTO_DECK)(store, state, opponent, cardsToShuffle);
                                }
                            });
                        }
                    });
                }
            });
            return state;
        }
        // Whirlwind - opponent switches
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedWhirlwind = true;
        }
        // Execute switch after attack damage
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWhirlwind) {
            this.usedWhirlwind = false;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        // Clean up flag at end of turn
        if (effect instanceof game_phase_effects_2.EndTurnEffect && this.usedWhirlwind) {
            this.usedWhirlwind = false;
        }
        return state;
    }
}
exports.Shiftry = Shiftry;
