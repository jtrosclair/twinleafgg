"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Woobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Woobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Nasal Suction',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Air Cutter',
                cost: [P],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Woobat';
        this.fullName = 'Woobat CEC';
    }
    reduceEffect(store, state, effect) {
        // Nasal Suction
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        // Air Cutter
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => { if (!result) {
                effect.damage = 0;
            } });
        }
        return state;
    }
}
exports.Woobat = Woobat;
