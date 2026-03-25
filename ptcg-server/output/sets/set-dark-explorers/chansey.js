"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Chansey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Sing',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Double-Edge',
                cost: [C, C, C],
                damage: 60,
                text: 'This Pokémon does 30 damage to itself.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '80';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Chansey';
        this.fullName = 'Chansey DEX 80';
    }
    reduceEffect(store, state, effect) {
        // Sing
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Double-Edge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 30);
        }
        return state;
    }
}
exports.Chansey = Chansey;
