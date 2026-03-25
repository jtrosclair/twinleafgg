"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cacnea = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Cacnea extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Poison Sting',
                cost: [G],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cacnea';
        this.fullName = 'Cacnea PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Cacnea = Cacnea;
