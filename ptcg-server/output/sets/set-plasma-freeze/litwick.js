"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litwick = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Litwick extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Singe',
                cost: [R],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Burned.'
            },
            {
                name: 'Live Coal',
                cost: [R, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PLF';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Litwick';
        this.fullName = 'Litwick PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Litwick = Litwick;
