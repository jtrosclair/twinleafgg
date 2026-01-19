"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Galvantula = void 0;
const game_1 = require("../../game");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Galvantula extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Joltik';
        this.cardType = L;
        this.additionalCardTypes = [G];
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Double Thread',
                cost: [C],
                damage: 0,
                text: 'This attack does 30 damage to 2 of your opponent\'s Pokémon. Also apply Weakness and Resistance for Benched Pokémon.'
            },
            {
                name: 'Electroweb',
                cost: [L],
                damage: 30,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }];
        this.set = 'STS';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Galvantula';
        this.fullName = 'Galvantula STS';
        this.ELECTROWEB_MARKER = 'ELECTROWEB_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(30, effect, store, state, 2, 2, true);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Galvantula = Galvantula;
