"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Herdier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Herdier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lillipup';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Roar',
                cost: [C],
                damage: 0,
                text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '87';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Herdier';
        this.fullName = 'Herdier DEX';
        this.usedRoar = false;
    }
    reduceEffect(store, state, effect) {
        // Roar - set flag for post-damage switch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedRoar = true;
        }
        // Switch opponent's Pokémon after attack
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedRoar) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            this.usedRoar = false;
            if (opponent.bench.some(b => b.cards.length > 0)) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        // Clean up flag at end of turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedRoar) {
            this.usedRoar = false;
        }
        return state;
    }
}
exports.Herdier = Herdier;
