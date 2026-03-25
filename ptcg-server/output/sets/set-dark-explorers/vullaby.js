"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vullaby = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vullaby extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Whirlwind',
                cost: [D],
                damage: 10,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vullaby';
        this.fullName = 'Vullaby DEX';
        this.usedWhirlwind = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedWhirlwind = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWhirlwind) {
            this.usedWhirlwind = false;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.bench.some(b => b.cards.length > 0)) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedWhirlwind) {
            this.usedWhirlwind = false;
        }
        return state;
    }
}
exports.Vullaby = Vullaby;
