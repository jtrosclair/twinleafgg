"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blissey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Blissey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Chansey';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Softboiled',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, heal 30 damage from your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Double-Edge',
                cost: [C, C, C],
                damage: 90,
                text: 'This Pokémon does 60 damage to itself.'
            }];
        this.set = 'DEX';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Blissey';
        this.fullName = 'Blissey DEX';
        this.SOFTBOILED_MARKER = 'SOFTBOILED_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Clear marker when Pokémon enters play
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SOFTBOILED_MARKER, this);
        }
        // Softboiled ability - flip coin, if heads heal 30 from Active
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if already used this turn
            if (player.marker.hasMarker(this.SOFTBOILED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Mark as used (even if the flip fails)
            player.marker.addMarker(this.SOFTBOILED_MARKER, this);
            // Flip a coin
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    // Heal 30 damage from Active Pokémon
                    const healEffect = new game_effects_1.HealEffect(player, player.active, 30);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        // Double-Edge - deal 90 damage and 60 to self
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 60);
        }
        // Clear marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.SOFTBOILED_MARKER, this);
        }
        return state;
    }
}
exports.Blissey = Blissey;
