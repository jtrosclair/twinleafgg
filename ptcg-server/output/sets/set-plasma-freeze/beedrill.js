"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beedrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Beedrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kakuna';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Swift Sting',
                cost: [G],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pokémon has full HP, this attack does 40 more damage, and the Defending Pokémon is now Confused and Poisoned.'
            },
            {
                name: 'Pierce',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Beedrill';
        this.fullName = 'Beedrill PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Swift Sting - if full HP, +40 damage, confuse and poison
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.damage === 0) {
                effect.damage += 40;
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Beedrill = Beedrill;
