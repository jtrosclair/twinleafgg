"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzong = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bronzong extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bronzor';
        this.hp = 110;
        this.cardType = P;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Evolution Jammer',
                cost: [P],
                damage: 30,
                text: 'During your opponent\'s next turn, they can\'t play any Pokémon from their hand to evolve their Pokémon.'
            },
            {
                name: 'Super Psy Bolt',
                cost: [P, C, C],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.name = 'Bronzong';
        this.fullName = 'Bronzong TEF';
        this.EVOLUTION_JAMMER_MARKER = 'EVOLUTION_JAMMER_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Evolution Jammer attack - prevent opponent from evolving during their next turn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Set marker and prevent evolution
            opponent.marker.addMarker(this.EVOLUTION_JAMMER_MARKER, this);
            opponent.canEvolve = false;
        }
        // Block evolution attempts when marker is present
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.EVOLUTION_JAMMER_MARKER, this)) {
                // Check if this is an evolution attempt (not a basic Pokémon being played to empty slot)
                const stage = effect.pokemonCard.stage;
                const isEvolved = stage === card_types_1.Stage.STAGE_1 || stage === card_types_1.Stage.STAGE_2;
                const target = effect.target;
                const hasTargetPokemon = target && target.cards.length > 0;
                // If it's an evolution card and there's a target Pokémon, block it
                if (isEvolved && hasTargetPokemon) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        // Clear the marker and reset canEvolve when opponent's turn ends
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.EVOLUTION_JAMMER_MARKER, this)) {
                player.marker.removeMarker(this.EVOLUTION_JAMMER_MARKER, this);
                // Reset canEvolve to default (false) - it will be set to true elsewhere if needed
                player.canEvolve = false;
            }
        }
        return state;
    }
}
exports.Bronzong = Bronzong;
