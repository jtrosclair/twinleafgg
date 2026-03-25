"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throh = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Throh extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Circle Throw',
                cost: [F, C, C],
                damage: 60,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Throh';
        this.fullName = 'Throh BLW';
        this.usedCircleThrow = false;
    }
    reduceEffect(store, state, effect) {
        // Circle Throw - set flag for post-damage switch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedCircleThrow = true;
        }
        // Switch opponent's Pokémon after damage
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedCircleThrow) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            this.usedCircleThrow = false;
            if (opponent.bench.some(b => b.cards.length > 0)) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        // Clean up flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedCircleThrow) {
            this.usedCircleThrow = false;
        }
        return state;
    }
}
exports.Throh = Throh;
