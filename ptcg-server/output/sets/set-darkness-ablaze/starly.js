"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Starly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Starly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Sky Circus',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you played Bird Keeper from your hand during this turn, ignore all Energy in this Pokemon\'s attack costs.',
            }
        ];
        this.attacks = [
            {
                name: 'Keen Eye',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
            }
        ];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.setNumber = '145';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Starly';
        this.fullName = 'Starly DAA';
        this.STARLY_SKY_CIRCUS_MARKER = 'STARLY_SKY_CIRCUS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Sky Circus
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.name == 'Bird Keeper') {
            // Put a "played Bird Keeper this turn" marker on ourselves.
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            effect.player.marker.addMarker(this.STARLY_SKY_CIRCUS_MARKER, effect.trainerCard);
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.marker.hasMarker(this.STARLY_SKY_CIRCUS_MARKER)) {
            // If we have the marker, the attack cost will be free.
            effect.cost = [];
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.STARLY_SKY_CIRCUS_MARKER, this)) {
            // Remove marker at the end of turn.
            effect.player.marker.removeMarker(this.STARLY_SKY_CIRCUS_MARKER);
        }
        // Keen Eye
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 0, max: 2, allowCancel: true }, this.attacks[0]);
        }
        return state;
    }
}
exports.Starly = Starly;
