"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mienfoo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mienfoo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Triple Smash',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 10 times the number of heads.'
            }];
        this.set = 'NXD';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mienfoo';
        this.fullName = 'Mienfoo NXD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Mienfoo = Mienfoo;
