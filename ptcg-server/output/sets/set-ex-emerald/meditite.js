"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meditite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meditite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'High Jump Kick',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Fake Out',
                cost: [F, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'EM';
        this.setNumber = '55';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meditite';
        this.fullName = 'Meditite EM';
    }
    reduceEffect(store, state, effect) {
        // Handle Fake Out attack
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Meditite = Meditite;
