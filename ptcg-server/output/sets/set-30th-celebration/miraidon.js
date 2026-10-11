"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miraidon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Miraidon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 120;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Mach Bolt',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: ''
            },
            {
                name: 'Electro Drift',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: 'Discard 2 [L] Energy from this Pokémon.'
            }];
        this.regulationMark = 'J';
        this.set = '30C';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Miraidon';
        this.fullName = 'Miraidon 30C';
    }
    reduceEffect(store, state, effect) {
        // Electro Drift
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2, card_types_1.CardType.LIGHTNING);
        }
        return state;
    }
}
exports.Miraidon = Miraidon;
