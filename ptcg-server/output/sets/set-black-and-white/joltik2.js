"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Joltik2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Leech Life',
                cost: [L],
                damage: 10,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Joltik';
        this.fullName = 'Joltik BLW 45';
    }
    reduceEffect(store, state, effect) {
        // Leech Life - heal same amount as damage dealt
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const healEffect = new attack_effects_1.HealTargetEffect(effect, effect.damage);
            healEffect.target = effect.player.active;
            store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Joltik2 = Joltik2;
