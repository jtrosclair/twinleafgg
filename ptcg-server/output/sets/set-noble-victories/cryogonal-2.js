"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cryogonal2 = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Cryogonal2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Icy Wind',
                cost: [W],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Ice Chain',
                cost: [W, W, C],
                damage: 50,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cryogonal';
        this.fullName = 'Cryogonal NVI 33';
        this.usedIceChain = false;
    }
    reduceEffect(store, state, effect) {
        // Icy Wind
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Ice Chain - switch defending Pokémon after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedIceChain = true;
        }
        // After Ice Chain, switch opponent's active with benched
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedIceChain) {
            this.usedIceChain = false;
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, opponent);
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_2.EndTurnEffect && this.usedIceChain) {
            this.usedIceChain = false;
        }
        return state;
    }
}
exports.Cryogonal2 = Cryogonal2;
