"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simisear = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Simisear extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pansear';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Scratch',
                cost: [C],
                damage: 20,
                text: ''
            }, {
                name: 'Double Fire',
                cost: [R, R, C],
                damage: 80,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 80 damage times the number of heads.'
            }];
        this.set = 'NVI';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Simisear';
        this.fullName = 'Simisear NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 80 * heads;
            });
        }
        return state;
    }
}
exports.Simisear = Simisear;
