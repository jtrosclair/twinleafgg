"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emolga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
class Emolga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bounce',
                cost: [L, C],
                damage: 30,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '49';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Emolga';
        this.fullName = 'Emolga NXD';
        this.usedBounce = false;
    }
    reduceEffect(store, state, effect) {
        // Bounce - set flag
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedBounce = true;
        }
        // After attack, switch self with benched
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedBounce) {
            this.usedBounce = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_2.EndTurnEffect && this.usedBounce) {
            this.usedBounce = false;
        }
        return state;
    }
}
exports.Emolga = Emolga;
