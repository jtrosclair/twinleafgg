"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shinx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shinx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Jump On',
                cost: [L],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            },
            {
                name: 'Static Shock',
                cost: [L, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shinx';
        this.fullName = 'Shinx NXD';
    }
    reduceEffect(store, state, effect) {
        // Jump On
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 10;
                }
            });
        }
        return state;
    }
}
exports.Shinx = Shinx;
