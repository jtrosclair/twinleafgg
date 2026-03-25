"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vigoroth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vigoroth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slakoth';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.usedRoar = false;
        this.attacks = [
            {
                name: 'Roar',
                cost: [C],
                damage: 0,
                text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
            },
            {
                name: 'Slash',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'UNM';
        this.setNumber = '169';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vigoroth';
        this.fullName = 'Vigoroth UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Roar
        // Ref: AGENTS-patterns.md (post-damage switching - opponent switches)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedRoar = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedRoar) {
            this.usedRoar = false;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.bench.some(b => b.cards.length > 0)) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedRoar = false;
        }
        return state;
    }
}
exports.Vigoroth = Vigoroth;
