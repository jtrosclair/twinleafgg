"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee2 = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eevee2 extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Signs of Evolution',
                cost: [C],
                damage: 0,
                text: 'Search your deck for 3 Pokémon of different types that evolve from Eevee. Reveal them and put them into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Bite',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Eevee';
        this.fullName = 'Eevee PLF 90';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND)(store, state, effect.player, { evolvesFrom: 'Eevee' }, { min: 0, max: 3, differentTypes: true });
        }
        return state;
    }
}
exports.Eevee2 = Eevee2;
