"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Darmanitan = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Darmanitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Darumaka';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Fire Fang',
                cost: [R, C],
                damage: 20,
                text: 'The Defending Pokémon is now Burned.'
            },
            {
                name: 'Thrash',
                cost: [R, C, C],
                damage: 70,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage. If tails, this Pokémon does 20 damage to itself.'
            }
        ];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Darmanitan';
        this.fullName = 'Darmanitan BLW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    effect.damage += 20;
                }
                else {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 20);
                }
            });
        }
        return state;
    }
}
exports.Darmanitan = Darmanitan;
