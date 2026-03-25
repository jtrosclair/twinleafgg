"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LatiosEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class LatiosEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 170;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Mach Flight',
                cost: [P, C],
                damage: 40,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Luster Purge',
                cost: [W, P, C],
                damage: 150,
                text: 'Discard all Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '86';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latios-EX';
        this.fullName = 'Latios-EX PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Mach Flight - defending can't retreat
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_2.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_2.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Attack 2: Luster Purge - discard all energy from self
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
        }
        return state;
    }
}
exports.LatiosEx = LatiosEx;
