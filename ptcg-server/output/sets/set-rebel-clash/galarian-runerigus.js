"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianRunerigus = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianRunerigus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Galarian Yamask';
        this.regulationMark = 'D';
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Spreading Spite',
                cost: [C, C],
                damage: 0,
                text: 'For each damage counter on this Galarian Runerigus, put 2 damage counters on your opponent\'s Pokémon in any way you like.'
            },
            {
                name: 'Mad Hammer',
                cost: [F, C, C],
                damage: 120,
                text: 'This Pokémon also does 30 damage to itself.'
            },
        ];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Galarian Runerigus';
        this.fullName = 'Galarian Runerigus RCL';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const counters = effect.player.active.damage * 2;
            attack_effects_1.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(counters, store, state, effect);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
        }
        return state;
    }
}
exports.GalarianRunerigus = GalarianRunerigus;
