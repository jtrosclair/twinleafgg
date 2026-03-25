"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archeops = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Archeops extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Archen';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Acrobatics',
                cost: [F],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
            },
            {
                name: 'Swift Dive',
                cost: [F, F],
                damage: 100,
                text: 'If this Pok\u00e9mon\'s remaining HP is 50 or less, this attack\'s base damage is 50.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Archeops';
        this.fullName = 'Archeops PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage += 20 * heads;
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const remainingHp = player.active.hp - player.active.damage;
            if (remainingHp <= 50) {
                effect.damage = 50;
            }
        }
        return state;
    }
}
exports.Archeops = Archeops;
