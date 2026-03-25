"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snover = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Snover extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Powder Snow',
                cost: [W],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Snover';
        this.fullName = 'Snover UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Powder Snow
        // Ref: AGENTS-patterns.md (Asleep status)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Snover = Snover;
