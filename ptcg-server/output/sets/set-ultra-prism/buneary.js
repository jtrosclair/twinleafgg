"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buneary = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Buneary extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.WEAK_KNEED_MARKER = 'BUNEARY_UPR_WEAK_KNEED_MARKER';
        this.SMOKESCREEN_MARKER = 'BUNEARY_UPR_SMOKESCREEN_MARKER';
        this.attacks = [
            {
                name: 'Weak Kneed',
                cost: [C],
                damage: 0,
                text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
            },
            {
                name: 'Skip',
                cost: [C],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '106';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Buneary';
        this.fullName = 'Buneary UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Weak Kneed
        // Ref: set-unified-minds/wimpod.ts (Sand Attack - UseAttackEffect smokescreen pattern)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.ADD_MARKER)(this.WEAK_KNEED_MARKER, opponent.active, this);
        }
        if (effect instanceof game_effects_1.UseAttackEffect && (0, prefabs_1.HAS_MARKER)(this.WEAK_KNEED_MARKER, effect.player.active, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.SMOKESCREEN_MARKER, opponent, this)) {
                return state; // Avoids recursion
            }
            effect.preventDefault = true;
            (0, prefabs_1.ADD_MARKER)(this.SMOKESCREEN_MARKER, opponent, this); // Avoids recursion
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const useAttackEffect = new game_effects_1.UseAttackEffect(player, effect.attack);
                    store.reduceEffect(state, useAttackEffect);
                }
                else {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SMOKESCREEN_MARKER, this);
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.WEAK_KNEED_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.WEAK_KNEED_MARKER, this);
        }
        return state;
    }
}
exports.Buneary = Buneary;
