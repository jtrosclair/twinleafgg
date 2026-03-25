"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xurkitree = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Xurkitree extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Three Mirrors',
                cost: [L],
                damage: 30,
                damageCalculation: '+',
                text: 'If your opponent has exactly 3 Prize cards remaining, this attack does 90 more damage.'
            },
            {
                name: 'Signal Beam',
                cost: [L, L],
                damage: 50,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Xurkitree';
        this.fullName = 'Xurkitree UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Three Mirrors
        // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() === 3) {
                effect.damage += 90;
            }
        }
        // Attack 2: Signal Beam
        // Ref: AGENTS-patterns.md (Confused status)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Xurkitree = Xurkitree;
