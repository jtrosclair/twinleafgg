"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaraptorFB = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class StaraptorFB extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.',
            },
            {
                name: 'Whirlwind',
                cost: [C, C, C],
                damage: 30,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.',
            }
        ];
        this.set = 'SV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Staraptor FB';
        this.fullName = 'Staraptor FB SV';
        this.usedWhirlwind = false;
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedWhirlwind = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWhirlwind === true) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedWhirlwind) {
            this.usedWhirlwind = false;
        }
        return state;
    }
}
exports.StaraptorFB = StaraptorFB;
