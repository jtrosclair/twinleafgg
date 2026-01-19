"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teddiursa = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Teddiursa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Baby-Doll Eyes',
                cost: [C],
                damage: 0,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Dig Claws',
                cost: [C, C],
                damage: 90,
                text: ''
            }];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.name = 'Teddiursa';
        this.fullName = 'Teddiursa DAA';
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
exports.Teddiursa = Teddiursa;
