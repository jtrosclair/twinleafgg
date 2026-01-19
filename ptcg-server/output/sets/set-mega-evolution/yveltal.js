"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Clutch',
                cost: [D],
                damage: 20,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Dark Feather',
                cost: [D, C, C],
                damage: 110,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal M1L';
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
exports.Yveltal = Yveltal;
