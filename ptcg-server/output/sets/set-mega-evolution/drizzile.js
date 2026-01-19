"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drizzile = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Drizzile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sobble';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Double Stab',
                cost: [W],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage for each heads.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Drizzile';
        this.fullName = 'Drizzile M1S';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 30 * heads;
            });
        }
        return state;
    }
}
exports.Drizzile = Drizzile;
