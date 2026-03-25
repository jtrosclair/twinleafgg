"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carnivine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Carnivine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Lure Poison',
                cost: [G],
                damage: 0,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Poisoned.'
            },
            {
                name: 'Spit Squall',
                cost: [G, G, C],
                damage: 0,
                text: 'Your opponent puts the Defending Pokémon and all cards attached to it into his or her hand.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Carnivine';
        this.fullName = 'Carnivine DEX';
        this.usedLurePoison = false;
        this.usedSpitSquall = false;
    }
    reduceEffect(store, state, effect) {
        // Lure Poison - set flag during attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedLurePoison = true;
        }
        // Spit Squall - set flag during attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedSpitSquall = true;
        }
        // After Lure Poison - switch then poison
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedLurePoison) {
            this.usedLurePoison = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                // No benched Pokémon to switch, just poison the current active
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                return state;
            }
            // Switch opponent's active with a benched Pokémon
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                opponent.switchPokemon(target);
                // Poison the new active Pokémon
                (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            });
        }
        // After Spit Squall - return defending Pokémon to hand
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSpitSquall) {
            this.usedSpitSquall = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active;
            // Move the defending Pokémon and all attached cards to opponent's hand
            defendingPokemon.moveTo(opponent.hand);
            defendingPokemon.clearEffects();
        }
        // Cleanup flags at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedLurePoison = false;
            this.usedSpitSquall = false;
        }
        return state;
    }
}
exports.Carnivine = Carnivine;
