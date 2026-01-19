"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purrloin = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Purrloin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dig Claws',
                cost: [D],
                damage: 10,
                text: ''
            },
            {
                name: 'Fake Out',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'DAA';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Purrloin';
        this.fullName = 'Purrloin DAA';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
                }
            });
        }
        return state;
    }
}
exports.Purrloin = Purrloin;
