"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zubat = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Zubat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Bite',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Poison Spray',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned.'
            }];
        this.set = 'N3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Zubat';
        this.fullName = 'Zubat N3';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
        return state;
    }
}
exports.Zubat = Zubat;
