"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteelStar = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RegisteelStar extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.STAR];
        this.cardType = M;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Barrier Attack',
                cost: [M],
                damage: 10,
                text: 'During your opponent\'s next turn, any damage done to Registeel Star by attacks is reduced by 10 (after applying Weakness and Resistance).'
            },
            {
                name: 'Final Laser',
                cost: [M, M, C],
                damage: 70,
                text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like. If your opponent has only 1 Prize card left and Registeel Star is the only Pokémon you have in play, put 6 damage counters instead.'
            }];
        this.set = 'LM';
        this.setNumber = '92';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Registeel Star';
        this.fullName = 'Registeel Star LM';
        this.BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Flame Screen
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
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
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            let counters = 3;
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (playerBench === 0 && opponent.getPrizeLeft() === 1) {
                counters = 6;
            }
            (0, attack_effects_2.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(counters, store, state, effect);
        }
        return state;
    }
}
exports.RegisteelStar = RegisteelStar;
