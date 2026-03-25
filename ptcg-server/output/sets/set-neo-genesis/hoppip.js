"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoppip = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Hoppip extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Hop',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Sprout',
                cost: [G],
                damage: 0,
                text: 'Search your deck for a Basic Pokémon named Hoppip and put it onto your Bench. Shuffle your deck afterward. (You can\'t use this attack if your Bench is full.)'
            }];
        this.set = 'N1';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hoppip';
        this.fullName = 'Hoppip N1';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { stage: game_1.Stage.BASIC, name: 'Hoppip' }, { min: 0, max: 1 });
        }
        return state;
    }
}
exports.Hoppip = Hoppip;
