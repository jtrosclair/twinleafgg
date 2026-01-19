"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Archen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Unidentified Fossil';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Endeavor',
                cost: [C],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
            }];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Archen';
        this.fullName = 'Archen UNM';
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
                effect.damage += 20 * heads;
            });
        }
        return state;
    }
}
exports.Archen = Archen;
