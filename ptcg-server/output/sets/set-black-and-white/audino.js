"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Audino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Do the Wave',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the number of your Benched Pokémon.'
            },
            {
                name: 'Hip Bump',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Audino';
        this.fullName = 'Audino BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const benchCount = player.bench.reduce((count, b) => count + (b.cards.length > 0 ? 1 : 0), 0);
            effect.damage = 20 * benchCount;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
        }
        return state;
    }
}
exports.Audino = Audino;
