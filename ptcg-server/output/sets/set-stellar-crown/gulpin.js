"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gulpin = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Gulpin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Drool',
                cost: [D],
                damage: 10,
                text: ''
            },
            {
                name: 'Super Poison Breath',
                cost: [D, D, C],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Gulpin';
        this.fullName = 'Gulpin SCR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Gulpin = Gulpin;
