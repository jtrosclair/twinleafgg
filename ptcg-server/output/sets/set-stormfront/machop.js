"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machop = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Machop extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: P, value: 10 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Kick',
                cost: [C],
                damage: 10,
                text: '',
            },
            {
                name: 'Knock Back',
                cost: [F, C],
                damage: 20,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.',
            }
        ];
        this.set = 'SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Machop';
        this.fullName = 'Machop SF';
        this.usedKnockBack = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedKnockBack = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedKnockBack === true) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedKnockBack) {
            this.usedKnockBack = false;
        }
        return state;
    }
}
exports.Machop = Machop;
