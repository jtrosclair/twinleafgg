"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dustox = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dustox extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Cascoon';
        this.cardType = G;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [];
        this.retreat = [C];
        this.powers = [{
                name: 'Boisterous Wind',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability. Flip a coin. If heads, put an Energy attached to your opponent\'s Active Pokémon into their hand.'
            }];
        this.attacks = [{
                name: 'Twilight Poison',
                cost: [G, G],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Asleep and Poisoned.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Dustox';
        this.fullName = 'Dustox M2a';
        this.RUSTLING_WIND_MARKER = 'RUSTLING_WIND_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Reset marker when Pokemon is played
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.RUSTLING_WIND_MARKER, this);
        }
        // Reset marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.RUSTLING_WIND_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.RUSTLING_WIND_MARKER, this);
        }
        // Rustling Wind ability
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if ability was already used this turn
            if (player.marker.hasMarker(this.RUSTLING_WIND_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check if opponent's active has energy cards
            const hasEnergy = opponent.active.energies.cards.some(card => card.superType === card_types_1.SuperType.ENERGY);
            if (!hasEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Mark ability as used
            player.marker.addMarker(this.RUSTLING_WIND_MARKER, this);
            // Flip coin
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, (result) => {
                if (result) {
                    // If heads, select and move energy to opponent's hand
                    store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        if (selected && selected.length > 0) {
                            const energyCard = selected[0];
                            opponent.active.moveCardTo(energyCard, opponent.hand);
                        }
                    });
                }
            });
        }
        // Twilight Poison attack - apply Asleep and Poisoned
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Apply both Asleep and Poisoned conditions
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [
                card_types_1.SpecialCondition.ASLEEP,
                card_types_1.SpecialCondition.POISONED
            ]);
            specialConditionEffect.target = opponent.active;
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Dustox = Dustox;
