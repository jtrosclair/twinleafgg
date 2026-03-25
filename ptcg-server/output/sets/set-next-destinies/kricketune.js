"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketune = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Kricketune extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Kricketot';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'White Noise',
                cost: [C],
                damage: 20,
                text: 'The Defending Pokémon is now Asleep.'
            },
            {
                name: 'Draining Cut',
                cost: [G, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 40 damage times the number of heads. Heal from this Pokémon the same amount of damage you did to the Defending Pokémon.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kricketune';
        this.fullName = 'Kricketune NXD';
    }
    reduceEffect(store, state, effect) {
        // White Noise
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Draining Cut
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, effect.player, 2, results => {
                const heads = results.filter(r => r).length;
                const damage = heads * 40;
                effect.damage = damage;
                if (damage > 0) {
                    (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, damage);
                }
            });
        }
        return state;
    }
}
exports.Kricketune = Kricketune;
