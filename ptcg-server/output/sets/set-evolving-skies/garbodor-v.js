"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarbodorV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class GarbodorV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 210;
        this.weakness = [{ type: F, value: 2 }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Trash Stench',
                cost: [D, C],
                damage: 40,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During your opponent\'s next turn, that Pokémon can\'t retreat.'
            },
            {
                name: 'Sludge Bomb',
                cost: [D, D, C],
                damage: 130,
                text: ''
            }];
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garbodor V';
        this.fullName = 'Garbodor V EVS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.GarbodorV = GarbodorV;
