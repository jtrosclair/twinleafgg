"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elgyem = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Elgyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Psybeam',
                cost: [P],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }];
        this.set = 'UNM';
        this.name = 'Elgyem';
        this.fullName = 'Elgyem UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Elgyem = Elgyem;
