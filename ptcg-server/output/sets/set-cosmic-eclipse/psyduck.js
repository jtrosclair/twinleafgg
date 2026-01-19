"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Psyduck = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Psyduck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Confusion Wave',
                cost: [W, C],
                damage: 20,
                text: 'Both Active Pokémon are now Confused.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Psyduck';
        this.fullName = 'Psyduck CEC';
    }
    reduceEffect(store, state, effect) {
        // Confusion Wave attack - confuse both active Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Psyduck = Psyduck;
