"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanillish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Vanillish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vanillite';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Icy Snow',
                cost: [W],
                damage: 20,
                text: ''
            },
            {
                name: 'Icy Wind',
                cost: [W, C, C],
                damage: 50,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vanillish';
        this.fullName = 'Vanillish NXD';
    }
    reduceEffect(store, state, effect) {
        // Icy Wind
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Vanillish = Vanillish;
