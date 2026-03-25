"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndour = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Houndour extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Roar',
                cost: [C],
                damage: 0,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            },
            {
                name: 'Ambush',
                cost: [D, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Houndour';
        this.fullName = 'Houndour PLB';
        this.usedRoar = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedRoar = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedRoar) {
            this.usedRoar = false;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.bench.some(b => b.cards.length > 0)) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        if (effect instanceof game_phase_effects_2.EndTurnEffect && this.usedRoar) {
            this.usedRoar = false;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Houndour = Houndour;
