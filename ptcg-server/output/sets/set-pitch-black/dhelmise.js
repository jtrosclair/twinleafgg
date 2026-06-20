"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dhelmise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const ghost_veil_1 = require("./ghost-veil");
class Dhelmise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Regretful Rage',
                cost: [P],
                damage: 30,
                damageCalculation: '+',
                text: 'If you have 4 or more Pokémon in your discard with the Ghost Veil Ability, this attack does 140 more damage.',
            }];
        this.set = 'M5';
        this.setNumber = '37';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dhelmise';
        this.fullName = 'Dhelmise M5';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if ((0, ghost_veil_1.countGhostVeilPokemonInDiscard)(effect.player) >= 4) {
                effect.damage += 140;
            }
        }
        return state;
    }
}
exports.Dhelmise = Dhelmise;
