"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Ice Beam',
                cost: [W, C, C],
                damage: 50,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Ice Wing',
                cost: [W, C, C, C],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '27';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Articuno';
        this.fullName = 'Articuno NXD';
    }
    reduceEffect(store, state, effect) {
        // Ice Beam
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Articuno = Articuno;
