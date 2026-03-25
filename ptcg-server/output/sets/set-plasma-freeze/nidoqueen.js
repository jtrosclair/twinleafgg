"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoqueen = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Nidoqueen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nidorina';
        this.cardType = P;
        this.hp = 130;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Poison Horn',
                cost: [P, C],
                damage: 50,
                text: 'The Defending Pokémon is now Poisoned.'
            },
            {
                name: 'Double Stomp',
                cost: [P, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Nidoqueen';
        this.fullName = 'Nidoqueen PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Poison Horn
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Attack 2: Double Stomp
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage += heads * 30;
            });
        }
        return state;
    }
}
exports.Nidoqueen = Nidoqueen;
