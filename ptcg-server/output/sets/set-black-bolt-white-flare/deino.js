"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Deino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Body Slam',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Darkness Fang',
                cost: [D, C, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'WHT';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Deino';
        this.fullName = 'Deino SV11W';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            return prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.player, this);
                }
            });
        }
        return state;
    }
}
exports.Deino = Deino;
