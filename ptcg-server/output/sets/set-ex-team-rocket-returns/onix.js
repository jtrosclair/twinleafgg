"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onix = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Onix extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Horn Rush',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
            {
                name: 'Granite Head',
                cost: [F, C],
                damage: 20,
                text: 'During your opponent\'s next turn, any damage done to Onix by attacks is reduced by 10 (after applying Weakness and Resistance).'
            }];
        this.set = 'TRR';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Onix';
        this.fullName = 'Onix TRR';
        this.BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (!result) {
                    effect.damage = 0;
                }
            });
        }
        // Granite Head
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const addMarkerEffect = new attack_effects_1.AddMarkerEffect(effect, this.BARRIER_ATTACK_MARKER, this);
            return store.reduceEffect(state, addMarkerEffect);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.source.marker.hasMarker(this.BARRIER_ATTACK_MARKER, this)) {
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 10;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.BARRIER_ATTACK_MARKER, this);
        }
        return state;
    }
}
exports.Onix = Onix;
