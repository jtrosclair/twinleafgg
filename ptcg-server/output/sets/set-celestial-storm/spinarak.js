"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinarak = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spinarak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Stun Poison',
                cost: [G],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed and Poisoned.'
            },
            {
                name: 'Pierce',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Spinarak';
        this.fullName = 'Spinarak CES';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Spinarak = Spinarak;
