"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marill = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Marill extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Hide',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            },
            {
                name: 'Flop',
                cost: [P, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Marill';
        this.fullName = 'Marill MC';
        this.PREVENT_DAMAGE_MARKER = 'PREVENT_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    const player = effect.player;
                    player.active.marker.addMarker(this.PREVENT_DAMAGE_MARKER, this);
                }
            });
        }
        // Prevent damage if marker is set
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_MARKER, this)) {
            effect.preventDefault = true;
            return state;
        }
        // Clear marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.marker.hasMarker(this.PREVENT_DAMAGE_MARKER, this)) {
                opponent.active.marker.removeMarker(this.PREVENT_DAMAGE_MARKER, this);
            }
        }
        return state;
    }
}
exports.Marill = Marill;
