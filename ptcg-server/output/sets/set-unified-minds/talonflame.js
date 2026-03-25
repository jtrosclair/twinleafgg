"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Talonflame = void 0;
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Talonflame extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fletchinder';
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Heat Wave',
                cost: [R],
                damage: 40,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            },
            {
                name: 'Flare Raid',
                cost: [R, C],
                damage: 100,
                text: 'Discard an Energy from this Pokémon. This attack does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Talonflame';
        this.fullName = 'Talonflame UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Heat Wave
        // Ref: AGENTS-patterns.md (Burned status)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Attack 2: Flare Raid
        // Refs: set-unbroken-bonds/kyurem.ts (Hail Prison - discard energy), AGENTS-patterns.md (bench damage)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(50, effect, store, state);
        }
        return state;
    }
}
exports.Talonflame = Talonflame;
