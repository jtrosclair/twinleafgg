"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amoongus = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Amoongus extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Foongus';
        this.cardType = G;
        this.hp = 120;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dangerous Reaction',
                cost: [C],
                damage: 30,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is affected by a Special Condition, this attack does 120 more damage.'
            },
            {
                name: 'Seed Bomb',
                cost: [G, C],
                damage: 60,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Amoongus';
        this.fullName = 'Amoongus SV11B';
    }
    reduceEffect(store, state, effect) {
        // Dangerous Reaction
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.opponent.active.specialConditions.length > 0) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.Amoongus = Amoongus;
