"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seedot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Seedot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Trip Over',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            }];
        this.set = 'NXD';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Seedot';
        this.fullName = 'Seedot NXD';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 10;
                }
            });
        }
        return state;
    }
}
exports.Seedot = Seedot;
