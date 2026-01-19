"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Supersonic',
                cost: [L],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.',
            }
        ];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Magnemite';
        this.fullName = 'Magnemite UNM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Magnemite = Magnemite;
