"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tynamo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tynamo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 30;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.usedWildRiver = false;
        this.attacks = [
            {
                name: 'Wild River',
                cost: [C],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '63';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tynamo';
        this.fullName = 'Tynamo UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Wild River
        // Ref: AGENTS-patterns.md (post-damage switching)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedWildRiver = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWildRiver) {
            this.usedWildRiver = false;
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.player);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedWildRiver = false;
        }
        return state;
    }
}
exports.Tynamo = Tynamo;
