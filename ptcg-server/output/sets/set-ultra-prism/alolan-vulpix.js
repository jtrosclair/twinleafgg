"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanVulpix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AlolanVulpix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.usedRoar = false;
        this.attacks = [
            {
                name: 'Roar',
                cost: [],
                damage: 0,
                text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
            },
            {
                name: 'Icy Snow',
                cost: [W],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '30';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alolan Vulpix';
        this.fullName = 'Alolan Vulpix UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Roar
        // Ref: AGENTS-patterns.md (Post-Damage Switching - AfterAttackEffect pattern)
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
exports.AlolanVulpix = AlolanVulpix;
