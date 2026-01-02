"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrocksZubat2 = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BrocksZubat2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.BROCKS];
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: P }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Poison Fang',
                cost: [G, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
            }];
        this.set = 'G1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Brock\'s Zubat';
        this.fullName = 'Brock\'s Zubat G1 74';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
                }
            });
        }
        return state;
    }
}
exports.BrocksZubat2 = BrocksZubat2;
