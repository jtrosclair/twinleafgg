"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slugma = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Slugma extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 40;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Yawn',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Headbutt',
                cost: [C],
                damage: 10,
                text: ''
            }];
        this.set = 'UF';
        this.name = 'Slugma';
        this.fullName = 'Slugma UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
    }
    reduceEffect(store, state, effect) {
        // Fishing Tail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.Slugma = Slugma;
