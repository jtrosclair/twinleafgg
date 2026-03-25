"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Liepard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Liepard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Purrloin';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Assist',
                cost: [D],
                damage: 0,
                copycatAttack: true,
                text: 'Choose 1 of your Benched Pokémon\'s attacks and use it as this attack.'
            },
            {
                name: 'Fury Swipes',
                cost: [D, D, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Liepard';
        this.fullName = 'Liepard BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.COPY_BENCH_ATTACK)(store, state, effect);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 40 * heads;
            });
        }
        return state;
    }
}
exports.Liepard = Liepard;
