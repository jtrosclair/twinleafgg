"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bisharp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slash',
                cost: [D, C],
                damage: 30,
                text: ''
            },
            {
                name: 'Fury Cutter',
                cost: [D, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip 3 coins. If 1 of them is heads, this attack does 10 more damage. If 2 of them are heads, this attack does 30 more damage. If all of them are heads, this attack does 60 more damage.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp DEX';
    }
    reduceEffect(store, state, effect) {
        // Fury Cutter
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            let heads = 0;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => { if (result) {
                heads++;
            } });
            switch (heads) {
                case 1:
                    effect.damage += 10;
                    break;
                case 2:
                    effect.damage += 30;
                    break;
                case 3:
                    effect.damage += 60;
                    break;
                default:
                    effect.damage += 0;
                    break;
            }
        }
        return state;
    }
}
exports.Bisharp = Bisharp;
