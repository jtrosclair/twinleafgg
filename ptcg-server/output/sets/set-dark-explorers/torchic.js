"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torchic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Torchic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Reckless Charge',
                cost: [R, C],
                damage: 30,
                text: 'This Pokémon does 10 damage to itself.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Torchic';
        this.fullName = 'Torchic DEX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
        }
        return state;
    }
}
exports.Torchic = Torchic;
