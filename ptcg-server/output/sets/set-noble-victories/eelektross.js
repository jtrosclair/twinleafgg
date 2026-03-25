"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eelektross = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Eelektross extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Eelektrik';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Wild Charge',
                cost: [L, C, C],
                damage: 80,
                text: 'This Pokémon does 20 damage to itself.'
            },
            {
                name: 'Suction Drain',
                cost: [L, L, C, C],
                damage: 60,
                text: 'Heal 30 damage from this Pokémon. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eelektross';
        this.fullName = 'Eelektross NVI';
    }
    reduceEffect(store, state, effect) {
        // Wild Charge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
        }
        // Suction Drain
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 30);
            (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Eelektross = Eelektross;
