"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cobalion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cobalion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Metal Horns',
                cost: [M, C],
                damage: 30,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            },
            {
                name: 'Sacred Sword',
                cost: [M, M, C],
                damage: 100,
                text: 'This Pokémon can\'t use Sacred Sword during your next turn.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Cobalion';
        this.fullName = 'Cobalion EPO';
        this.usedMetalHorns = false;
    }
    reduceEffect(store, state, effect) {
        // Metal Horns - set flag when attack is used
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedMetalHorns = true;
        }
        // Metal Horns - switch after damage is dealt
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedMetalHorns) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        // Clean up Metal Horns flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedMetalHorns) {
            this.usedMetalHorns = false;
        }
        // Sacred Sword - simplified "can't use next turn" pattern
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            if (!player.active.cannotUseAttacksNextTurnPending.includes('Sacred Sword')) {
                player.active.cannotUseAttacksNextTurnPending.push('Sacred Sword');
            }
        }
        return state;
    }
}
exports.Cobalion = Cobalion;
