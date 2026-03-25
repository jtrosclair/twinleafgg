"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKoko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class TapuKoko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Electro Ball',
                cost: [L],
                damage: 30,
                text: ''
            },
            {
                name: 'Nature Dive',
                cost: [L, L, C],
                damage: 100,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is an Ultra Beast, this attack does 100 more damage, and discard 2 Energy from this Pokémon.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tapu Koko';
        this.fullName = 'Tapu Koko UNM';
    }
    reduceEffect(store, state, effect) {
        // Attack 2: Nature Dive
        // Ref: set-team-up/tentacruel.ts (Ultra Beast tag check)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) {
                effect.damage += 100;
                (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
            }
        }
        return state;
    }
}
exports.TapuKoko = TapuKoko;
