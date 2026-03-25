"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Hydreigon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = N;
        this.hp = 150;
        this.weakness = [{ type: N }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Consume',
                cost: [D, C, C],
                damage: 40,
                text: 'Heal from this Pokemon the same amount of damage you did to the Defending Pokemon.'
            },
            {
                name: 'Destructor Beam',
                cost: [P, D, C, C],
                damage: 90,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokemon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '98';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon DRX 98';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Consume - heal damage equal to damage dealt
        // The base damage is 40, so heal 40 (before weakness/resistance modifiers)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 40);
        }
        // Attack 2: Destructor Beam - flip coin, if heads discard energy
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, attack_effects_1.DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
                }
            });
        }
        return state;
    }
}
exports.Hydreigon2 = Hydreigon2;
