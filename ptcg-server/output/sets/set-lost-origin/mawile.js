"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mawile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mawile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tempting Trap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat. During your next turn, the Defending Pokémon takes 90 more damage from attacks (after applying Weakness and Resistance).'
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Mawile';
        this.fullName = 'Mawile LOR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Add markers for next turn effects
            opponent.active.marker.addMarker(marker_constants_1.MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
            opponent.marker.addMarker(marker_constants_1.MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
            opponent.active.marker.addMarker(marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
            return state;
        }
        // Handle retreat blocking
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        // Clear retreat block at end of affected turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(marker_constants_1.MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(marker_constants_1.MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
            effect.player.active.marker.removeMarker(marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        // Handle damage boost effect
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(marker_constants_1.MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this) && effect.damage > 0) {
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.marker.hasMarker(marker_constants_1.MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this) && !opponent.marker.hasMarker(marker_constants_1.MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this)) {
                opponent.active.marker.removeMarker(marker_constants_1.MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
            }
        }
        return state;
    }
}
exports.Mawile = Mawile;
