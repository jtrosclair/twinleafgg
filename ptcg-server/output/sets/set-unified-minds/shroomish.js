"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shroomish = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Shroomish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Poison Powder',
                cost: [G],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shroomish';
        this.fullName = 'Shroomish UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Poison Powder
        // Ref: AGENTS-patterns.md (Poisoned status)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Shroomish = Shroomish;
