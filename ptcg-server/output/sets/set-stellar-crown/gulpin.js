"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gulpin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gulpin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Drool',
                cost: [D],
                damage: 10,
                text: ''
            },
            {
                name: 'Super Poison Breath',
                cost: [D, D, C],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Gulpin';
        this.fullName = 'Gulpin SCR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
        return state;
    }
}
exports.Gulpin = Gulpin;
