"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piplup = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Piplup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bubble Hold',
                cost: [W, W, W],
                damage: 80,
                text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.name = 'Piplup';
        this.fullName = 'Piplup CEC';
        this.BUBBLE_HOLD_MARKER = 'BUBBLE_HOLD_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Bubble Hold attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            if (((_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC) {
                opponent.active.marker.addMarker(this.BUBBLE_HOLD_MARKER, this);
                opponent.marker.addMarker(this.BUBBLE_HOLD_MARKER, this);
            }
        }
        // Block attacks when marker is present
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(this.BUBBLE_HOLD_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        // Clean up markers at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BUBBLE_HOLD_MARKER, this)) {
            effect.player.marker.removeMarker(this.BUBBLE_HOLD_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.marker.hasMarker(this.BUBBLE_HOLD_MARKER, this)) {
                    cardList.marker.removeMarker(this.BUBBLE_HOLD_MARKER, this);
                }
            });
        }
        return state;
    }
}
exports.Piplup = Piplup;
