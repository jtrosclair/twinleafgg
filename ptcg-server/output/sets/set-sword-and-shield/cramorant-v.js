"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CramorantV = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CramorantV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_V];
        this.stage = game_1.Stage.BASIC;
        this.retreat = [C];
        this.hp = 200;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.attacks = [
            {
                name: 'Beak Catch',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Spit Shot',
                cost: [C, C, C],
                damage: 0,
                text: 'Discard all Energy from this Pokémon. This attack does 160 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.name = 'Cramorant V';
        this.fullName = 'Cramorant V SSH';
    }
    reduceEffect(store, state, effect) {
        // Beak Catch
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND)(store, state, effect.player, this, {}, { min: 0, max: 2 }, this.attacks[0]);
        }
        // Spit Shot
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(160, effect, store, state);
        }
        return state;
    }
}
exports.CramorantV = CramorantV;
