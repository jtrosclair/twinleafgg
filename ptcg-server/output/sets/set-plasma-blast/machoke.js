"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machoke = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Machoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Machop';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Last-Chance Chop',
                cost: [C],
                damage: 20,
                damageCalculation: '+',
                text: 'If this Pok\u00e9mon\'s remaining HP is 10, this attack does 70 more damage.'
            },
            {
                name: 'Seismic Toss',
                cost: [F, F, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'PLB';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Machoke';
        this.fullName = 'Machoke PLB';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const remainingHp = player.active.hp - player.active.damage;
            if (remainingHp === 10) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Machoke = Machoke;
