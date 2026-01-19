"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zeraora = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Zeraora extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Shocking Knuckle',
                cost: [C],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Strong Volt',
                cost: [L, L, C],
                damage: 120,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Zeraora';
        this.fullName = 'Zeraora TEF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, flipResult => {
                if (flipResult) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 1);
        }
        return state;
    }
}
exports.Zeraora = Zeraora;
