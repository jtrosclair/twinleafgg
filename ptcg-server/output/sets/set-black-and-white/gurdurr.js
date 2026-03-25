"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gurdurr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gurdurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Timburr';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Pound',
                cost: [F, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Stone Edge',
                cost: [F, F, C],
                damage: 50,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Gurdurr';
        this.fullName = 'Gurdurr BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 30;
                }
            });
        }
        return state;
    }
}
exports.Gurdurr = Gurdurr;
