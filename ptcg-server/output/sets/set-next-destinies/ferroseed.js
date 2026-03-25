"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ferroseed = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ferroseed extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Self Destruct',
                cost: [M, C],
                damage: 60,
                text: 'This Pokémon does 60 damage to itself.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '77';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ferroseed';
        this.fullName = 'Ferroseed NXD';
    }
    reduceEffect(store, state, effect) {
        // Self Destruct
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 60);
        }
        return state;
    }
}
exports.Ferroseed = Ferroseed;
