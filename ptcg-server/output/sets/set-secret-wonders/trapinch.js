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
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: W, value: +10 }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Inviting Trap',
                cost: [C],
                damage: 10,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Sand Tomb',
                cost: [F],
                damage: 10,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Trapinch';
        this.fullName = 'Trapinch SW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, effect.opponent);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Trapinch = Trapinch;
