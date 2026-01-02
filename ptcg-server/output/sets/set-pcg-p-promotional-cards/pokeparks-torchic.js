"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksTorchic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class PokeParksTorchic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Flamethrower',
                cost: [R, C, C],
                damage: 40,
                text: 'Discard a [R] Energy attached to this Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Torchic';
        this.fullName = 'PokéPark\'s Torchic PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, card_types_1.CardType.FIRE);
        }
        return state;
    }
}
exports.PokeParksTorchic = PokeParksTorchic;
