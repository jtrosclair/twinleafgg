"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caterpie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Caterpie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'String Shot',
                cost: [G],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }
        ];
        this.set = 'BS';
        this.setNumber = '45';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Caterpie';
        this.fullName = 'Caterpie BS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Caterpie = Caterpie;
