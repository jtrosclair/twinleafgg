"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horsea = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Horsea extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Beat',
                cost: [C],
                damage: 10,
                text: ''
            },
            {
                name: 'Fin Smack',
                cost: [W, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            }];
        this.set = 'UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Horsea';
        this.fullName = 'Horsea UL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Horsea = Horsea;
