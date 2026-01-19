"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksPikachu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class PokeParksPikachu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Quick Attack',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            },
            {
                name: 'Thunderbolt',
                cost: [L, L, C],
                damage: 60,
                text: 'Discard all Energy attached to this Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Pikachu';
        this.fullName = 'PokéPark\'s Pikachu PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 10);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
        }
        return state;
    }
}
exports.PokeParksPikachu = PokeParksPikachu;
