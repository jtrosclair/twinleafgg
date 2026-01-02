"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lillipup = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lillipup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Baby-Doll Eyes',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.',
            },
            {
                name: 'Tackle',
                cost: [C, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'CEC';
        this.name = 'Lillipup';
        this.fullName = 'Lillipup CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            return prefabs_1.BLOCK_RETREAT(store, state, effect, this);
        }
        prefabs_1.BLOCK_RETREAT_IF_MARKER(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Lillipup = Lillipup;
