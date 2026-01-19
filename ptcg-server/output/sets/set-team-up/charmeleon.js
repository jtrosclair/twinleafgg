"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmeleon = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Charmeleon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charmander';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Fire Fang',
                cost: [R, R],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Charmeleon';
        this.fullName = 'Charmeleon TEU';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED)(store, state, effect);
        }
        return state;
    }
}
exports.Charmeleon = Charmeleon;
