"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gible2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Gible2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 60;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Sand-Attack',
                cost: [F],
                damage: 0,
                text: 'If the Defending Pokemon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
            },
            {
                name: 'Knock Away',
                cost: [W, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '87';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gible';
        this.fullName = 'Gible DRX 87';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'GIBLE2_DEFENDING_CANNOT_ATTACK_MARKER';
        this.SAND_ATTACK_MARKER = 'GIBLE2_SAND_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Sand-Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.ADD_MARKER)(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
        }
        if (effect instanceof game_effects_1.UseAttackEffect && (0, prefabs_1.HAS_MARKER)(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.SAND_ATTACK_MARKER, opponent, this)) {
                return state;
            }
            effect.preventDefault = true;
            (0, prefabs_1.ADD_MARKER)(this.SAND_ATTACK_MARKER, opponent, this);
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
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SAND_ATTACK_MARKER, this);
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
        }
        // Attack 2: Knock Away - flip for +20
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 20);
        }
        return state;
    }
}
exports.Gible2 = Gible2;
