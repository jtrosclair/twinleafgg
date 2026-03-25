"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emolga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Emolga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Static Shock',
                cost: [L],
                damage: 20,
                text: ''
            },
            {
                name: 'Electrichain',
                cost: [L, C, C],
                damage: 40,
                text: 'If the Defending Pokémon has any Energy attached to it, this attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Emolga';
        this.fullName = 'Emolga NVI';
    }
    reduceEffect(store, state, effect) {
        // Electrichain
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if defending Pokémon has energy attached
            const hasEnergy = opponent.active.cards.some(c => c.superType === card_types_2.SuperType.ENERGY);
            if (hasEnergy) {
                const hasBenched = opponent.bench.some(b => b.cards.length > 0);
                if (hasBenched) {
                    (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
                }
            }
        }
        return state;
    }
}
exports.Emolga = Emolga;
