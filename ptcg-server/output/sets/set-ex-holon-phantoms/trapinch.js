"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trapinch = void 0;
const game_1 = require("../../game");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Trapinch extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.DELTA_SPECIES];
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Big Bite',
                cost: [G],
                damage: 10,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Mud Slap',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'HP';
        this.setNumber = '84';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Trapinch';
        this.fullName = 'Trapinch HP';
        this.BIG_BITE_MARKER = 'BIG_BITE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Trapinch = Trapinch;
