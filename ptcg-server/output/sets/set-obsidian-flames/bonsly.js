"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bonsly = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Bonsly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 30;
        this.weakness = [{ type: G }];
        this.retreat = [];
        this.attacks = [
            { name: 'Blubbering', cost: [], damage: 10, text: 'Your opponent\'s Active Pokémon is now Confused.' },
        ];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Bonsly';
        this.fullName = 'Bonsly OBF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Bonsly = Bonsly;
