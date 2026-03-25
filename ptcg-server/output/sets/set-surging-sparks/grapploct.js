"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grapploct = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Grapploct extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Clobbopus';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Chop',
                cost: [F],
                damage: 40,
                text: ''
            },
            {
                name: 'Raging Tentacles',
                cost: [F, F, C],
                damage: 130,
                text: 'If this Pokémon has any damage counters on it, this attack can be used for [F].'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '113';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Grapploct';
        this.fullName = 'Grapploct SSP';
    }
    reduceEffect(store, state, effect) {
        // Raging Tentacles
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (effect.player !== player || player.active.getPokemonCard() !== this) {
                return state;
            }
            if (effect.player.active.damage > 0) {
                effect.cost = [F];
            }
            return state;
        }
        return state;
    }
}
exports.Grapploct = Grapploct;
