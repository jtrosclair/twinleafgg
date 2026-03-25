"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sewaddle = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Sewaddle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'String Shot',
                cost: [G],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Sewaddle';
        this.fullName = 'Sewaddle EPO';
    }
    reduceEffect(store, state, effect) {
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
exports.Sewaddle = Sewaddle;
