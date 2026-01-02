"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = N;
        this.hp = 100;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Evolution Guidance',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon has any Energy attached, you may use this Ability. Search your deck for an Evolution Pokémon and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Tail Snap',
                cost: [W, L],
                damage: 60,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair M2a';
        this.EVOLUTION_GUIDANCE_MARKER = 'EVOLUTION_GUIDANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Reset marker when Pokemon is played
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.EVOLUTION_GUIDANCE_MARKER, this);
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.EVOLUTION_GUIDANCE_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.EVOLUTION_GUIDANCE_MARKER, this);
        }
        // Evolution Guidance ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check if ability is blocked
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            // Find this Pokémon in play
            let dragonairCardList = null;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    dragonairCardList = cardList;
                }
            });
            if (!dragonairCardList) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if this Pokémon has any Energy attached
            const energyCount = dragonairCardList.cards.filter((card) => card.superType === card_types_1.SuperType.ENERGY).length;
            if (energyCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if ability was already used this turn
            if (player.marker.hasMarker(this.EVOLUTION_GUIDANCE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Block non-evolution Pokémon from selection
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard) {
                    // Block Basic Pokémon (only allow Stage 1 and Stage 2)
                    if (card.stage === card_types_1.Stage.BASIC) {
                        blocked.push(index);
                    }
                }
                else {
                    // Block non-Pokémon cards
                    blocked.push(index);
                }
            });
            // Search deck for Evolution Pokémon
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 1, blocked });
            // Mark ability as used
            player.marker.addMarker(this.EVOLUTION_GUIDANCE_MARKER, this);
            // Add visual effect
            if (dragonairCardList) {
                dragonairCardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
            }
        }
        return state;
    }
}
exports.Dragonair = Dragonair;
