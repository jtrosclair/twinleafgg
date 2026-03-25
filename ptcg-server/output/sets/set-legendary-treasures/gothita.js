"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothita = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Gothita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Hypnotic Gaze',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Double Slap',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
            }
        ];
        this.set = 'LTR';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gothita';
        this.fullName = 'Gothita LTR 69';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Hypnotic Gaze
        // Ref: AGENTS-patterns.md (special conditions)
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Attack 2: Double Slap
        // Ref: AGENTS-patterns.md (multiple coin flips)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.Gothita = Gothita;
