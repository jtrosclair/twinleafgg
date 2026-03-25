"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klink = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Klink extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Smash Turn',
                cost: [C, C],
                damage: 20,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Klink';
        this.fullName = 'Klink DEX';
        this.usedSmashTurn = false;
    }
    reduceEffect(store, state, effect) {
        // Smash Turn - mark for switching after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedSmashTurn = true;
        }
        // After Smash Turn attack, switch self with benched
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedSmashTurn) {
            this.usedSmashTurn = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.usedSmashTurn) {
            this.usedSmashTurn = false;
        }
        return state;
    }
}
exports.Klink = Klink;
