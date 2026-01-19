"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksLatios = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class PokeParksLatios extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Dragon Breath',
                cost: [G, C],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.If tails, this attack does nothing.'
            },
            {
                name: 'Luster Purge',
                cost: [L, C, C],
                damage: 60,
                text: 'Discard 3 Energy attached to this Pokémon.'
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Latios';
        this.fullName = 'PokéPark\'s Latios PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
                else {
                    effect.damage = 0;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 3);
        }
        return state;
    }
}
exports.PokeParksLatios = PokeParksLatios;
