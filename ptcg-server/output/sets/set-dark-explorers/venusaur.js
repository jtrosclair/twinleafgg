"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Venusaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ivysaur';
        this.cardType = G;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Floral Fragrance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Poison Powder',
                cost: [G, G, C, C],
                damage: 70,
                text: 'The Defending Pokémon is now Poisoned.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Venusaur';
        this.fullName = 'Venusaur DEX';
        this.FLORAL_FRAGRANCE_MARKER = 'FLORAL_FRAGRANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Reset marker when Pokémon is played
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FLORAL_FRAGRANCE_MARKER, this);
        }
        // Floral Fragrance ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.FLORAL_FRAGRANCE_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.FLORAL_FRAGRANCE_MARKER, this);
            let chosen = [];
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: true }), selected => {
                chosen = selected || [];
                if (chosen.length > 0) {
                    player.deck.moveCardsTo(chosen, player.hand);
                    store.prompt(state, new game_1.ShowCardsPrompt(state_utils_1.StateUtils.getOpponent(state, player).id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosen), () => { });
                }
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Poison Powder attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Clean up marker at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FLORAL_FRAGRANCE_MARKER, this)) {
            effect.player.marker.removeMarker(this.FLORAL_FRAGRANCE_MARKER, this);
        }
        return state;
    }
}
exports.Venusaur = Venusaur;
