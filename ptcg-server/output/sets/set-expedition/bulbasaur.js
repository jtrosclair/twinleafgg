"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bulbasaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sleep Seed',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Vine Whip',
                cost: [G, C],
                damage: 20,
                text: ''
            }];
        this.set = 'EX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Bulbasaur';
        this.fullName = 'Bulbasaur EX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.Bulbasaur = Bulbasaur;
