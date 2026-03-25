"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shinx2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shinx2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Reckless Charge',
                cost: [C],
                damage: 20,
                text: 'This Pokémon does 10 damage to itself.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shinx';
        this.fullName = 'Shinx NXD 43';
    }
    reduceEffect(store, state, effect) {
        // Reckless Charge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Shinx2 = Shinx2;
