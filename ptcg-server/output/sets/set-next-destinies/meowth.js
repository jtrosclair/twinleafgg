"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Meowth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Scratch',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
            },
            {
                name: 'Cat Kick',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '80';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Meowth';
        this.fullName = 'Meowth NXD';
    }
    reduceEffect(store, state, effect) {
        // Double Scratch
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Meowth = Meowth;
